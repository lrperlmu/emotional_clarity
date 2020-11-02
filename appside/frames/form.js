'use strict';


/**
 * Rendering (View) code for generic frames with a configurable mixture of
 *   form elements
 * @author Leah Perlmutter
 */


class FormFrame extends Frame {
    /**
     * Construct FormFrame from an object
     *
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *    frame_data.template (string) -- the exact string 'form'
     *    frame_data.title (string) -- title
     *    frame_data.instruction (string) -- instruction
     *    frame_data.questions (list) -- each entry in the form [question, type, [required]]
     *          question (string) -- text to show user
     *          type (string) -- how to render the question:
     *                           'text', 'shorttext', 'yesno', 'likert', 'phq', 'customradio'
     *          required (boolean, optional) -- whether the question must be answered
     *                                          undefined/missing means not required
     *          follow (string, optional) -- text to display after the question
     *          choices (list of string, optional) -- for custom question types
     *    frame_data.qualifiers (list) - list of options for 'likert' type questions
     *    frame_data.values (list) - list of values corresponding to qualifiers
     *    frame_data.response_name (string) - name this frame will attach to each piece
     *                 of data in return value of get_user_input
     *
     *  Behavior undefined if frame does not have these properties.
     */
    constructor(frame_data, logger) {
        super();

        this.template = frame_data.template;
        this.title = frame_data.title;
        this.instruction = frame_data.instruction;
        this.questions = frame_data.questions;
        this.qualifiers = frame_data.qualifiers;
        this.values = frame_data.values;
        this.response_name = frame_data.response_name;
        this.logger = logger;
        this.has_questions = this.questions.length>0;

        this.responses = [];
        for(let q of this.questions) {
            this.responses.push('');
        }
    }

    /**
     * Render this frame into the DOM
     *
     * @require -- DOM must have a div whose ID is 'frame'
     *
     * @effects -- Does not preserve former content of <div id="frame">.
     *    Renders the data from this into that div.
     */
    render() {
        this.set_background();

        // make a new empty div with id frame, not yet in the dom
        let frame = document.createElement('div');
        $(frame).attr('id', 'frame');

        // frame title
        let title = document.createElement('h4');
        $(title).text(this.title);
        $(title).addClass('text-primary text-uppercase mb-4');
        frame.appendChild(title);

        // instructions
        let instruction = document.createElement('div');
        $(instruction).text(this.instruction);
        $(instruction).addClass('font-weight-light mb-4');
        frame.appendChild(instruction);

        let q_idx = 0;
        for(let q_info of this.questions) {
            let text = q_info[0];
            let type = q_info[1];
            let required = q_info[2];
            let follow = q_info[3];
            let choices = q_info[4];
            let response = this.responses[q_idx];

            // Insert node for the question
            let qtext = document.createElement('h5');
            $(qtext).attr('class', 'font-weight-light mb-2');
            $(qtext).text(text);
            if (required){
                let asterisk = document.createElement('span');
                $(asterisk).addClass('text-danger');
                $(asterisk).addClass('h5');
                $(asterisk).text(' *');
                qtext.appendChild(asterisk);
            }
            frame.appendChild(qtext);

            // render the input field -- dispatch to proper type of FormElement
            let element = FormElement.generate(type, this, choices);
            let html_element = element.generate_html(response, q_idx);
            frame.appendChild(html_element);

            if(follow) {
                let follow_text = document.createElement('h5');
                $(follow_text).attr('class', 'font-weight-light mb-2');
                $(follow_text).text(follow);
                frame.appendChild(follow_text);
            }

            q_idx += 1;
        }
        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
        this.check_required_questions();
    }

    /**
     * Check if all required questions in this form have been answered.
     * @effects enables "next" button if all complete, othewise disables it
     */
    check_required_questions() {
        let all_complete = true;

        // for each required question
        let q_idx = 0;
        for(let question of this.questions) {
            let type = question[1];
            // if question[2] is missing, this will get set to undefined, which is falsy
            let required = question[2];
            if(required) {
                // case for radio button.
                if(type === 'yesno' || type === 'likert' || type ===  'phq') {
                    // is at least one radio button of the group filled in?
                    let radio_button_group_name = `q_${q_idx}`;
                    let $checked = $(`input[type=radio][name=${radio_button_group_name}]:checked`);
                    let num_checked = $checked.length;
                    if(num_checked === 0) {
                        all_complete = false;
                    }
                }
                // case for text box
                else if(type === 'text' || type === 'shorttext') {
                    let text = $(`#q_${q_idx}_input`).val();
                    if (text == '')
                        all_complete = false;
                }
            }
            q_idx += 1;
        }
        if(all_complete) {
            this.enable_next_button();
        }
        else {
            this.disable_next_button();
        }
    }

    /**
     * Returns map of user input
     * @return Map of
     *    {question (string): {'name':name (string), 'response':response (int or string)} }
     */
    get_user_input() {
        let ret = new Map();

        let q_idx = 0;
        for(let q_info of this.questions) {
            let text = q_info[0];
            let type = q_info[1];
            let required = q_info[2];
            if (type === 'header') {
                q_idx += 1;
                continue;
            }

            // dispatch to proper type of FormElement
            let element = FormElement.generate(type, this);
            let user_response = element.get_input(q_idx);

            let value = {};
            value.response = user_response;
            value.name = this.response_name;
            ret.set(text, value);

            q_idx += 1;
        }
        return ret;
    }

    /**
     * Update this frame to reflect user responses in the data set passed in
     * @param data (UserDataSet)
     *
     * @modifies this
     * @effects - possibly updates this frame's response
     */
    fill_in_data(data) {
        let q_idx = 0;
        for(let q_info of this.questions) {
            let text = q_info[0];
            let type = q_info[1];
            if (type === 'header') {
                q_idx += 1;
                continue;
            }
            let known_response = data.lookup(text, this.response_name).response;
            this.responses[q_idx] = known_response;
            q_idx += 1;
        }
    }
}


/**
 * Input Element of a FormFrame
 */
class FormElement {
    /**
     * Generate the proper type of element given type as a string
     * @param type (string)
     * @param parent (FormFrame)
     * @param choices (list of string, optional)
     * @return instance of a subclass of FormElement
     */
    static generate(type, parent, choices) {
        let ret;
        if(type === 'text') {
            ret = new TextFormElement(true);
        } else if(type === 'shorttext') {
            ret = new TextFormElement(false);
        } else if(type === 'yesno') {
            ret = new RadioButtonFormElement(FEEDBACK_YESNO_OPTIONS, 
                FEEDBACK_YESNO_VALUES);
        } else if(type === 'likert') {
            ret = new RadioButtonFormElement(parent.qualifiers, parent.values);
        } else if(type === 'phq') {
            ret = new RadioButtonFormElement(PHQ_OPTIONS, PHQ_OPTION_VALUES);
        } else if(type === 'customradio') {
            ret = new RadioButtonFormElement(choices, choices);
        } else if(type === 'header') {
            ret = new HeaderFormElement();
        }
        // } else if(type === 'checkboxes') {
        //     ret = new CheckBoxFormElement(choices, choices);
        // }
        
        ret.parent = parent;
        return ret;
    }

    /**
     * Children must implement
     */
    get_input(q_idx) {
        console.log('get_input: not implemented');
    }

    /**
     * Children must implement
     */
    generate_html(response, q_idx) {
        console.log('generate_html: not implemented');
    }
}


//TODO: docs
class HeaderFormElement extends FormElement {
    constructor() {
        super();
    }
    get_input(q_idx) {
        console.error('this should never have been called');
    }
    generate_html(q_idx) {
        return document.createElement('div');
    }
}



/**
 * FormElement that makes radio buttons
 */
class RadioButtonFormElement extends FormElement {
    /**
     * Construct RadioButtonFormElement with the given choices
     * @param choices (list of string) - choices to be displayed for the radio buttons
     * @param values (list of string) - values to be stored for each choice
     * @param required (boolean) - whether the question is required
     */
    constructor(choices, values, required) {
        super();
        this.choices = choices;
        this.required = required;
        if(values === undefined) {
            this.values = choices;
        } else {
            this.values = values;
        }
    }

    /**
     * Construct html element containing a radio button for each choice in
     *   this.choices
     *
     * @param known_response (string) - response to be checked or empty string
     * @param q_idx (int) - question number of this question
     * @return a single html element with the radio buttons in it
     */
    generate_html(known_response, q_idx) {
        let ret = document.createElement('div');
        $(ret).addClass('mb-4');

        // button and label for each possible answer
        for(let i = 0; i < this.choices.length; i++) {
            let resp = this.choices[i];
            let val = this.values[i].toString();

            let button = document.createElement('input');
            $(button).attr('class', 'mr-1');
            // $(button).addClass('mr-1');
            $(button).attr('type', 'radio');
            $(button).attr('value', val); // storage value
            $(button).attr('name', `q_${q_idx}`); // radio button group
            $(button).attr('id', `q_${q_idx}_${resp}`); // for matching the label
            if(known_response === val) {
                $(button).attr('checked', 'checked');
            }

            $(button).click(function() {
                this.parent.check_required_questions();
            }.bind(this));

            let label = document.createElement('label');
            $(label).addClass('font-weight-light mr-3');
            $(label).attr('for', `q_${q_idx}_${resp}`); // matches with id of button
            $(label).text(resp); // display value

            ret.appendChild(button);
            ret.appendChild(label);

            // // if 6 or more answers, insert line break after each
            // if (this.choices.length > 5) {
            //     ret.appendChild(document.createElement('BR'));
            // }
        }
        return ret;
    }

    /**
     * Get the value of the button that is checked for the given question index,
     *   or empty string if none is checked
     * @param q_idx (int) - question index
     * @return (string) 'Yes', 'No', or ''
     */
    get_input(q_idx) {
        // value of checked button with the given question id in its name
        let ret = '';
        let $checked_button = $(`input[name='q_${q_idx}']:checked`);
        if($checked_button.length !== 0) {
            ret = $checked_button.val();
        }
        return ret;
    }
}


/**
 * FormElement that makes text boxes
 */
class TextFormElement extends FormElement {
    
    constructor(is_long, required) {
        super();
        this.is_long = is_long;
        this.required = required;
    }

    /**
     * Construct html element containing a text box
     *
     * @param known_response (string) - to be shown in the text box
     * @param q_idx (int) - question number of this question
     * @return the textbox as an html element
     */
    generate_html(response, q_idx) {
        let ret = document.createElement('div');
        $(ret).addClass('mb-4');
        // insert a text box
        let textbox = null;
        if (this.is_long) {
            textbox = document.createElement('textarea');
            $(textbox).addClass('long_answer_textbox');
        }
        else {
            textbox = document.createElement('input');
            $(textbox).attr('type', 'text');
            $(textbox).addClass('short_answer_textbox');
            $(textbox).attr('maxlength', SHORTTEXT_CHAR_LIMIT);
        }

        $(textbox).attr('id', `q_${q_idx}_input`);
        $(textbox).val(response);

        $(textbox).keyup(function() {
            this.parent.check_required_questions();
        }.bind(this));

        ret.appendChild(textbox);
        return ret;
    }

    /**
     * Get the value entered into the textbox for the given question index
     * @param q_idx (int) - question index
     * @return (string) contents of the textbox
     */
    get_input(q_idx) {
        // contents of textbox with given index
        let ret = $(`#q_${q_idx}_input`).val();
        return ret;
    }
}

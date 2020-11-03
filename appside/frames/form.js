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
     *                           'header', 'checkbox'
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
            // render question + input field -- dispatch to proper type of FormElement
            let element = FormElement.generate(q_info, this);
            let question_html = element.generate_html(q_idx);
            frame.appendChild(question_html);
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
            let element = FormElement.generate(q_info, this);
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
 * Input Element of a FormFrame, and its corresponding question
 */
class FormElement {
    /**
     * Generate the proper type of element given type as a string
     * @param q_info (list) -- see FormFrame param frame_data.questions
     * @param parent (FormFrame)
     * @return instance of a subclass of FormElement
     */
    static generate(q_info, parent) {
        let type = q_info[1];

        let ret;
        if(type === 'text') {
            ret = new TextFormElement(q_info, true);
        } else if(type === 'shorttext') {
            ret = new TextFormElement(q_info, false);
        } else if(type === 'yesno') {
            ret = new RadioButtonFormElement(q_info, FEEDBACK_YESNO_OPTIONS,
                FEEDBACK_YESNO_VALUES);
        } else if(type === 'likert') {
            ret = new RadioButtonFormElement(q_info, parent.qualifiers, parent.values);
        } else if(type === 'phq') {
            ret = new RadioButtonFormElement(q_info, PHQ_OPTIONS, PHQ_OPTION_VALUES);
        } else if(type === 'customradio') {
            ret = new RadioButtonFormElement(q_info, q_info[4], q_info[4]);
        } else if(type === 'header') {
            ret = new HeaderFormElement(q_info);
        } else if(type === 'checkbox') {
            ret = new CheckBoxFormElement(q_info, q_info[4], q_info[4]);
        } else {
            console.error('unknown form element type', type);
        }
        
        ret.parent = parent;
        return ret;
    }

    constructor(q_info) {
        if(new.target === FormElement) {
            throw new TypeError('cannot construct FormElement directly (use generator)');
        }
        this.info = q_info;
    }

    /**
     * Children must implement
     *
     * Get the value of the form element
     */
    get_input(q_idx) {
        console.log('get_input: not implemented');
    }

    /**
     * Children must implement
     *
     * Construct html element for the response area of this question
     *
     * @param known_response (string) - user's response or empty string
     * @param q_idx (int) - question number of this question
     * @return a single html element with the html of the response area
     */
    generate_input_area_html(known_response, q_idx) {
        console.log('generate_input_area_html: not implemented');
    }

    // helper method for generate_html
    generate_question_text(text, required) {
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
        return qtext;
    }

    // helper method for generate_html
    generate_follow_text(follow) {
        let follow_text = document.createElement('h5');
        if(follow) {
            $(follow_text).attr('class', 'font-weight-light mb-2');
            $(follow_text).text(follow);
            ret.appendChild(follow_text);
        }
        return follow_text;
    }

    /**
     * Default behavior for generating the html for this question and response area
     * @param q_idx (int) - index of this question
     * @return (Node) - html element for the question and response area
     */
    generate_html(q_idx) {
        let q_info = this.info;
        let text = q_info[0];
        let required = q_info[2];
        let follow = q_info[3];
        let known_response = this.parent.responses[q_idx];

        let ret = document.createElement('div');

        // Insert node for the question
        let qtext = this.generate_question_text(text, required);
        ret.appendChild(qtext);

        // Insert node for the input area
        let html_element = this.generate_input_area_html(known_response, q_idx);
        ret.appendChild(html_element);

        // Insert a line of text after the question, if applicable
        let follow_text = this.generate_follow_text(follow);
        ret.appendChild(follow_text);

        return ret;
    }

}


/**
 * FormElement that makes headers, which are not actually questions
 */
class HeaderFormElement extends FormElement {
    constructor(q_info) {
        super(q_info);
    }

    /**
     * Get the value of the form element
     */
    get_input(q_idx) {
        console.error('this should never have been called');
        // because FormFrame.get_user_input skips elements whose type is header
    }

    /**
     * Generate html for the response area
     * @return empty div because there is no response area associated with a header
     */
    generate_input_area_html(known_response, q_idx) {
        return document.createElement('div');
    }
}


/**
 * FormElement that makes single checkbox questions
 */
class CheckBoxFormElement extends FormElement {

    constructor(q_info) {
        super(q_info);
    }


    /**
     * Get the value of the checkbox for the given question index
     * @param q_idx (int) - question index
     * @return (boolean) whether the box is checked
     */
    get_input(q_idx) {
        let ret = false;
        let $box = $(`input[name='q_${q_idx}']`);
        return $box.prop('checked');
    }

    /**
     * Construct html element containing checkbox
     * @param known_response (boolean) - whether the checkbox is checked
     * @param q_idx (int) - question number of this question
     * @return the checkbox as an html element
     */
    generate_input_area_html(known_response, q_idx) {
        let text = this.info[0];

        // create a checkbox
        let box = document.createElement('input');
        $(box).attr('class', 'mr-1');
        $(box).attr('type', 'checkbox');
        $(box).attr('name', `q_${q_idx}`);
        $(box).attr('id', `q_${q_idx}_${text}`); // for matching the label
        if(known_response === true) {
            $(box).attr('checked', 'checked');
        }
        return box;
    }

    /**
     * Generate html for this question and its response area
     * @param q_idx (int) - index of this question
     * @return (Node) - html element for the question and response area
     */
    // override default behavior because checkbox goes before the question text
    // in this case
    // AND, the question text is a label
    generate_html(q_idx) {
        let q_info = this.info;
        let text = q_info[0];
        let required = q_info[2];
        let follow = q_info[3];
        let known_response = this.parent.responses[q_idx];

        let ret = document.createElement('div');

        // Insert node for the input area
        let html_element = this.generate_input_area_html(known_response, q_idx);
        ret.appendChild(html_element);

        // Insert node for the question
        let label = document.createElement('label');
        $(label).attr('class', 'form-check-label font-weight-light');
        $(label).attr('for', `q_${q_idx}_${text}`); // matches with id of button
        $(label).text(text); // display value
        ret.appendChild(label);

        // Insert a line of text after the question, if applicable
        let follow_text = this.generate_follow_text(follow);
        if(follow) ret.appendChild(follow_text);

        return ret;
    }
}


/**
 * FormElement that makes radio buttons questions
 */
class RadioButtonFormElement extends FormElement {
    /**
     * Construct RadioButtonFormElement with the given choices
     * @param choices (list of string) - choices to be displayed for the radio buttons
     * @param values (list of string) - values to be stored for each choice
     */
    constructor(q_info, choices, values) {
        super(q_info);
        this.choices = choices;
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
    generate_input_area_html(known_response, q_idx) {
        let ret = document.createElement('div');
        $(ret).addClass('mb-4');

        // button and label for each possible answer
        for(let i = 0; i < this.choices.length; i++) {
            let resp = this.choices[i];
            let val = this.values[i].toString();

            let button = document.createElement('input');
            $(button).attr('class', 'mr-1');
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
 * FormElement that makes text box questions
 */
class TextFormElement extends FormElement {
    
    constructor(q_info, is_long) {
        super(q_info);
        this.is_long = is_long;
    }

    /**
     * Construct html element containing a text box
     *
     * @param known_response (string) - to be shown in the text box
     * @param q_idx (int) - question number of this question
     * @return the textbox as an html element
     */
    generate_input_area_html(known_response, q_idx) {
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
        $(textbox).val(known_response);

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

'use strict';


/**
 * Rendering (View) code for post activity survey frames
 * @author Leah Perlmutter
 */


class FormFrame extends Frame {

    /**
     * Construct FormFrame from an object
     *
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *    frame_data.template (string) -- the exact string 'form'
     *    frame_data.title (string) -- title
     *    frame_data.questions (list) -- each entry in the form [question, type]
     *          question (string) -- text to show user
     *          type (string) -- how to render the question: 'text' or 'yesno'
     *    frame_data.response_name (string) - name this frame will attach to each piece
     *                 of data in return value of get_user_input
     *
     *  Behavior undefined if frame does not have these properties.
     */
    constructor(frame_data, logger) {
        super();

        this.template = frame_data.template;
        this.title = frame_data.title;
        this.questions = frame_data.questions;
        this.response_name = frame_data.response_name;
        this.logger = logger;

        this.responses = [];
        for(let q in this.questions) {
            this.responses.push('');
        }
    }

    render() {
        // make a new empty div with id frame, not yet in the dom
        let frame = document.createElement('div');
        $(frame).attr('id', 'frame');

        // frame title
        let title = document.createElement('h3');
        $(title).text(this.title);
        $(title).addClass('font-weight-light mb-4');
        frame.appendChild(title);


        let q_idx = 0;
        for(let q_info of this.questions) {
            let text = q_info[0];
            let type = q_info[1];
            let response = this.responses[q_idx];

            // insert a h5 node for the question
            let qtext = document.createElement('h5');
            $(qtext).text(text);
            frame.appendChild(qtext);

            // render the input field -- dispatch to proper type of FormElement
            let element = FormElement.generate(type);
            let html_element = element.generate_html(text, response, q_idx);
            frame.appendChild(html_element);

            q_idx += 1;
        }

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
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

            // dispatch to proper type of FormElement
            let element = FormElement.generate(type);
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
     * @return instance of a subclass of FormElement
     */
    static generate(type) {
        if(type === 'text') {
            return new TextFormElement();
        } else if(type === 'yesno') {
            return new YesNoFormElement();
        }
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
    generate_html(text, response, q_idx) {
        console.log('generate_html: not implemented');
    }
}


class YesNoFormElement extends FormElement {

    /**
     * Construct html element containing radio buttons for 'Yes' and 'No'
     *
     * @param text (string) - ignored
     * @param known_response (string) - response to be checked or empty string
     * @param q_idx (int) - question number of this question
     * @return a single html element with the radio buttons in it
     */
    generate_html(text, known_response, q_idx) {
        let ret = document.createElement('div');

        // button and label for each possible answer
        for(let resp of ['Yes', 'No']) {
            let div = document.createElement('div');
            $(div).addClass('form_radio');

            let button = document.createElement('input');
            $(button).attr('type', 'radio');
            $(button).attr('value', resp);
            $(button).attr('name', `q_${q_idx}`);
            $(button).attr('id', `q_${q_idx}_${resp}`);
            if(known_response === resp) {
                $(button).attr('checked', 'checked');
            }
            div.appendChild(button);

            let label = document.createElement('label');
            $(label).attr('for', `q_${q_idx}_${resp}`);
            $(label).text(resp);
            div.appendChild(label);

            ret.appendChild(div);
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
        ret = $(`input[name='q_${q_idx}']:checked`).val();
        return ret;
    }
}


class TextFormElement extends FormElement {

    /**
     * Construct html element containing a text box
     *
     * @param text (string) - ignored
     * @param known_response (string) - to be shown in the text box
     * @param q_idx (int) - question number of this question
     * @return the textbox as an html element
     */
    generate_html(text, response, q_idx) {
        // insert a text box
        let textbox = document.createElement('textarea');
        $(textbox).attr('id', `q_${q_idx}_input`);
        $(textbox).addClass('long_answer_textbox');
        $(textbox).val(response);

        return textbox;
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

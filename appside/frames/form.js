"use strict";


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

        let title = document.createElement('h3');
        $(title).text(this.title);
        $(title).addClass('font-weight-light mb-4');
        frame.appendChild(title);

        let q_idx = 0;
        for(let q_info of this.questions) {
            console.log('q_info', q_info);

            let text = q_info[0];
            let type = q_info[1];

            // insert a h5 node for the question
            let qtext = document.createElement('h5');
            $(qtext).text(text);
            frame.appendChild(qtext);

            if(type === 'text') {
                // insert a text box
                let textbox = document.createElement('textarea');
                $(textbox).attr('id', `q_${q_idx}_input`);
                $(textbox).addClass('long_answer_textbox');
                $(textbox).val(this.responses[q_idx]);
                frame.appendChild(textbox);
            } else if(type === 'yesno') {

                // insert radio buttons
                for(let resp of ['Yes', 'No']) {
                    let div = document.createElement('div');
                    $(div).addClass('form_radio');

                    let button = document.createElement('input');
                    $(button).attr('type', 'radio');
                    $(button).attr('value', 'button');
                    $(button).attr('name', `q_${q_idx}`);
                    $(button).attr('id', `q_${q_idx}_${resp}`);
                    if(this.responses[q_idx] === resp) {
                        $(button).attr('checked', 'checked');
                    }

                    div.appendChild(button);

                    let label = document.createElement('label');
                    $(label).attr('for', `q_${q_idx}_${resp}`);
                    $(label).text(resp);
                    div.appendChild(label);

                    frame.appendChild(div);
                }
            }
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
        // let input = new Map();
        // let value = {};
        // value.response = $('#user_input').val();
        // value.name = this.response_name;
        // input.set(this.truncated_prompt, value);
        // return input;
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




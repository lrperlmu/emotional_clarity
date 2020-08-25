"use strict";

/**
 * Rendering (View) code for likert frame
 * @author Rachel Sitt
 */


/**
 * A frame composed of a list of things.
 * 
 * Things in the list are to be rendered as a list of radio buttons.
 **/
class LikertFrame extends Frame {

    /**
     * Construct LikertFrame from an object
     * 
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *    frame_data.instructions (string) -- frame's instructions for user
     *    frame_data.questions (array) -- list of question/response pair
     *    -- Question (String): Response (int 1-5 or undefined)
     *    frame_data.qualifiers (array of string) -- Text for answer choices
     *    frame_data.response_name (string) - name this frame will attach to each piece
     *                 of data in return value of get_user_input
     *
     *  Behavior undefined if frame does not have these properties.
     */
    constructor(frame_data) {
        super();

        this.title = frame_data.title;
        this.instructions = frame_data.instructions;
        this.questions = frame_data.questions;
        this.qualifiers = frame_data.qualifiers;
        this.response_name = frame_data.response_name;
        this.has_questions = true;
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

        let title = document.createElement('h4');
        $(title).text(this.title);
        $(title).addClass('text-primary text-uppercase mb-4');
        frame.appendChild(title);
        
        // insert a h5 node for the instruction
        let instructions = document.createElement('div');
        $(instructions).attr('class', 'font-weight-light mb-4');
        $(instructions).text(this.instructions);
        frame.appendChild(instructions);

        // insert a radio button list for the statements
        let statements = document.createElement('div');
        // $(statements).attr('class', 'form-check');

        let i = 0;
        for (let data of this.questions) {
            let question = data[0];
            let answer = data[1];
            i += 1;

            let item = document.createElement('div');
            $(item).addClass('mb-3');

            let question_text = document.createElement('h5');
            $(question_text).attr('class', 'likert_question_text');
            $(question_text).attr('class', 'font-weight-light mb-1');
            $(question_text).text(question);
            item.appendChild(question_text);

            // the actual radio buttons
            for (let j = 1; j <= 5; j++) {
                let input = document.createElement('input');
                $(input).attr('class', 'form-check-input');
                $(input).attr('class', 'mr-1');
                $(input).attr('type', 'radio');
                $(input).attr('name', question);    // question text
                $(input).attr('id', question + j);
                $(input).attr('value', this.qualifiers[j - 1]); // 0-based index

                if (answer != undefined && answer == j) {
                    $(input).attr('checked', 'checked');    // one option checked per q
                }
                input.dataset.text = j;             // answer choice

                let input_text = document.createElement('label');
                $(input_text).attr('class', 'likert_input_text');
                $(input_text).attr('class', 'font-weight-light mr-3');
                $(input_text).attr('for', question + j);
                $(input_text).text(this.qualifiers[j - 1]);

                item.appendChild(input);
                item.appendChild(input_text);
            }
            statements.appendChild(item);

            // statements.appendChild(document.createElement('br'));
        }
        frame.appendChild(statements);

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }

    /**
     * Returns map of user input
     * @return Map of
     *    {statement (string): {'name':name (string), 'response':response (int 1-5)} }
     */
    get_user_input() {
        let input = new Map();
        var choices = document.getElementsByTagName('input');;
        for (let item of choices) {
            if(item.checked) {
                let value = {};
                value.name = this.response_name;
                value.response = item.dataset.text;
                input.set(item.name, value);
            }
        }
        return input;
    }

    /**
     * Update this frame to reflect user responses in the data set passed in
     * @param data (UserDataSet)
     *
     * @modifies this
     * @effects - possibly updates this frame's statement responses
     */
    fill_in_data(data) {
        for(let tuple of this.questions) { // [stmt, response]
            let text = tuple[0];
            let name = this.response_name;
            let known_response = data.lookup(text, name).response;
            tuple[1] = known_response;
        }
    }
}

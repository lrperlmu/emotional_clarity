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

        this.instructions = frame_data.instructions;
        this.questions = frame_data.questions;
        this.qualifiers = frame_data.qualifiers;
        this.user_input = new Map();
        this.response_name = frame_data.response_name;
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

        // make a new empty div with id frame, not yet in the dom
        let frame = document.createElement('div'); 
        $(frame).attr('id', 'frame');
        
        // insert a h5 node for the instruction
        let instructions = document.createElement('h5');
        $(instructions).text(this.instructions);
        frame.appendChild(instructions);

        // insert a radio button list for the statements
        let statements = document.createElement('div');
        $(statements).attr('class', 'form-check');

        let i = 0;
        for (let data of this.questions) {
            let question = data[0];
            let answer = data[1];
            i += 1;

            let question_text = document.createElement('h5');
            $(question_text).attr('class', 'likert_question_text');
            $(question_text).text(question);
            statements.appendChild(question_text);
            this.user_input.set(question, answer);

            // the actual radio buttons
            for (let j = 1; j <= 5; j++) {
                let input = document.createElement('input');
                $(input).attr('class', 'form-check-input');
                $(input).attr('class', 'likert_input');
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
                $(input_text).attr('for', question + j);
                $(input_text).text(this.qualifiers[j - 1]);

                statements.appendChild(input);
                statements.appendChild(input_text);
            }
            statements.appendChild(document.createElement('br'));
        }
        frame.appendChild(statements);

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }

    /**
     * Returns map of user input
     * containing keys {
     * 'question_text': int (1-5)
     * }
     * @return map of user input
     */
    get_user_input() {
        var choices = document.getElementsByTagName('input');;
        for (let each of choices) {
            if (each.checked) {
                this.user_input.set(each.name, each.dataset.text);
            }
        }
        return this.user_input;
    }
}

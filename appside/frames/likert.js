"use strict";

/**
 * Rendering (View) code for likert frame
 * @author Rachel Sitt
 */


/**
 * A frame composed of a list of things.
 * 
 * Things in the list are to be rendered as a list of checkboxes.
 **/
class LikertFrame extends Frame {

    /**
     * Construct LikertFrame from an object
     * 
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *    frame_data.template -- The exact string 'statements'
     *    frame_data.title (string) -- The frame's title
     *    frame_data.instruction (string) -- Instructions for user
     *    frame_data.question (string) -- Text to appear before the list of statements
     *  Behavior undefined if frame does not have these properties.
     */
    constructor(frame_data) {
        super();

        // check validity (todo)
        // has title with length > 1
        // has question with length > 1

        // set fields
        this.title = LIKERT_TITLE;
        this.instructions = LIKERT_INSTRUCTIONS;
        this.questions = frame_data.questions;
        this.user_input = new Map();
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
        
        // insert a h5 node for the title
        let title = document.createElement('h5');
        $(title).text(this.title);
        $(title).attr('class', 'text-info text-uppercase mb-2');
        frame.appendChild(title);

        // insert a h2 node for the question
        let question = document.createElement('h2');
        $(question).text(this.question);
        $(question).attr('class', 'font-weight-light mb-4');
        frame.appendChild(question);
        
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
            $(question_text).text(data);
            statements.appendChild(question_text);
            this.user_input.set(question, undefined);

            // the actual radio buttons
            for (let j = 1; j <= 5; j++) {
                let input = document.createElement('input');
                $(input).attr('class', 'form-check-input');
                $(input).attr('class', 'likert_input');
                $(input).attr('type', 'radio');
                $(input).attr('name', question);    // question text
                $(input).prop('checked', answer);
                input.dataset.text = j;             // answer choice

                let input_text = document.createElement('p');
                $(input_text).attr('class', 'likert_input_text');
                $(input_text).text(j);

                statements.appendChild(input);
                statements.appendChild(input_text);
            }
            statements.appendChild(document.createElement('br'));
        }
        frame.appendChild(statements);

        let next = document.createElement('button');
        $(next).attr('class', 'bodymap_button');
        $(next).text('Next');
        $(next).click(function() {
            console.log(this.get_user_input());
        }.bind(this));
        statements.appendChild(next);

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
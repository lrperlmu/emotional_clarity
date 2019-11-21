"use strict";

/**
 * Rendering (View) code for self report frame
 * @author Rachel Sitt
 */


/**
 * A frame specifically purposed for self report at pre-measurement.
 * 
 * Frame contains 2 questions, first input as textbox and second as likert.
 **/
class SelfReportFrame extends Frame {

    /**
     * Construct SelfReport from an object
     * 
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *    frame_data.template -- The frame's template
     *    frame_data.title (string) -- The frame's title
     *    frame_data.questions (Array of map of string) -- 2 key/value pairs
     *    -- formatted as (key: question, value: answer); value is empty string by default
     *    frame_data.qualifiers (Array of string) -- 5 answers for second question
     *  Behavior undefined if frame does not have these properties.
     */
    constructor(frame_data) {
        super();
        
        this.template = frame_data.template;
        this.title = frame_data.title;
        this.questions = frame_data.questions;
        this.qualifiers = frame_data.qualifiers;
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
        
        // insert a h2 node for the title
        let title = document.createElement('h5');
        $(title).text(this.title);
        $(title).attr('class', 'text-info text-uppercase mb-2');
        frame.appendChild(title);

        let question1 = document.createElement('h3');
        $(question1).text(this.questions[0][0]);
        $(question1).attr('class', 'font-weight-light mb-4');
        frame.appendChild(question1);

        let textbox = document.createElement('textarea');    // input for first question
        $(textbox).attr('class', 'self_report_textbox');
        $(textbox).val(this.questions[0][1]);
        frame.appendChild(textbox);

        let container = document.createElement('div');  // flexbox for content
        $(container).attr('class', 'self_report_frame');

        let question2 = document.createElement('h3');
        $(question2).text(this.questions[1][0]);
        $(question2).attr('class', 'font-weight-light mb-4');
        container.appendChild(question2);

        for (let answer of this.qualifiers) {
            let input = document.createElement('input');
            $(input).attr('class', 'form-check-input');
            $(input).attr('class', 'self_report_input');
            $(input).attr('type', 'radio');
            $(input).attr('name', this.questions[1][0]);    // question text
            $(input).attr('id', this.questions[1][0] + answer);
            $(input).attr('value', answer);

            if (this.questions[1][1] === answer) {
                $(input).attr('checked', 'checked');    // one option checked per q
            }
            input.dataset.text = answer;             // answer choice

            let input_text = document.createElement('label');
            $(input_text).attr('class', 'self_report_input_text');
            $(input_text).attr('for', this.questions[1][0] + answer);
            $(input_text).text(answer);

            container.appendChild(input);
            container.appendChild(input_text);
        }
        frame.appendChild(container);
        
        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }

    /**
     * Returns map of user input
     * questions: [
     * 'question_text': 'answer choice',
     * ]
     * @return map of user input
     */
    get_user_input() {
        var textbox = document.getElementsByTagName('textarea');
        this.questions[0][1] = $(textbox).val().trim();

        var choices = document.getElementsByTagName('input');
        for (let each of choices) {
            if (each.checked) {
                this.questions[1][1] = each.dataset.text;
            }
        }
        return this.questions;
    }
}
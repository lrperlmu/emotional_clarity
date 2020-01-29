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
     *    frame_data.template (string) -- Exact String phrase 'likert'
     *    frame_data.questions (Array of map of string) -- 2 key/value pairs
     *    -- formatted as (key: question, value: answer); value is empty string by default
     *    frame_data.qualifiers (Array of string) -- 5 answers for second question
     *    frame_data.response_name (string) - name this frame will attach to each piece
     *                 of data in return value of get_user_input
     *  Behavior undefined if frame does not have these properties.
     */
    constructor(frame_data) {
        super();
        
        this.template = frame_data.template;
        this.questions = frame_data.questions;
        this.qualifiers = frame_data.qualifiers;
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

        let question1 = document.createElement('h3');
        $(question1).text(this.questions[0][0]);
        $(question1).attr('class', 'font-weight-light mb-4');
        frame.appendChild(question1);

        let textbox = document.createElement('textarea');    // input for first question
        $(textbox).attr('class', 'self_report_textbox');
        $(textbox).val(this.questions[0][1]);
        frame.appendChild(textbox);

        let container = document.createElement('div');
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

    // DELETE ONCE VERIFIED THAT INPUT IS GOTTEN ACCURATELY IN THE NEW WAY
    // /**
    //  * Returns map of user input
    //  * questions: [
    //  * 'question_text': 'answer choice',
    //  * ]
    //  * @return map of user input
    //  */
    // get_user_input() {
    //     var textbox = document.getElementsByTagName('textarea');
    //     this.questions[0][1] = $(textbox).val().trim();

    //     var choices = document.getElementsByTagName('input');
    //     for (let each of choices) {
    //         if (each.checked) {
    //             this.questions[1][1] = each.dataset.text;
    //         }
    //     }
    //     return this.questions;
    // }

    /**
     * Returns map of user input
     * @return Map of
     *    {question (string): {'name':name (string), 'response':response (int or string)} }
     */
    get_user_input() {
        let input = new Map();
        let textbox = document.getElementsByTagName('textarea');
        let value = {};
        value.response = $(textbox).val().trim();
        value.name = this.response_name;
        input.set(this.questions[0][0], value);

        let choices = document.getElementsByTagName('input');
        for (let choice of choices) {
            if (choice.checked) {
                let value = {};
                value.name = this.response_name;
                value.response = choice.dataset.text;
                input.set(this.questions[1][0], value);
            }
        }
        return input;
    }

    /**
     * Update this frame to reflect user responses in the data set passed in
     * @param data (UserDataSet)
     *
     * @modifies this
     * @effects - possibly updates this frame's question responses
     */
    fill_in_data(data) {
        for(let tuple of this.questions) { // [question, response]
            let text = tuple[0];
            let name = this.response_name;
            let known_response = data.lookup(text, name).response;
            tuple[1] = known_response;
        }
    }
}

"use strict";

/**
 * Rendering (View) code for consent disclosure frame
 * @author Rachel Sitt
 */


/**
 * A frame specifically purposed for consent disclosure.
 * 
 * Frame contains pdf file and a set of checkboxes.
 **/
class ConsentFrame extends Frame {

    /**
     * Construct ConsentFrame from an object
     * 
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *    frame_data.template -- The frame's template
     *    frame_data.title (string) -- The frame's title
     *    frame_data.questions (Array of map of string) -- 2 key/value pairs
     *    -- formatted as (key: question, value: boolean); value is false by default
     *  Behavior undefined if frame does not have these properties.
     */
    constructor(frame_data) {
        super();
        
        this.template = frame_data.template;
        this.title = frame_data.title;
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
        
        // insert a h2 node for the title
        let title = document.createElement('h5');
        $(title).text(this.title);
        $(title).attr('class', 'text-info text-uppercase mb-2');
        frame.appendChild(title);

        let pdf = document.createElement('iframe');
        $(pdf).attr('src', 'images/consent.pdf');
        $(pdf).attr('class', 'consent_pdf');
        frame.appendChild(pdf);

        let container = document.createElement('div');  // flexbox for content
        $(container).attr('class', 'consent_frame');

        for (let each_question of this.questions) {
            let question_text = each_question[0];
            let answer = each_question[1];

            let input = document.createElement('input');
            $(input).attr('class', 'form-check-input');
            $(input).attr('class', 'consent_input');
            $(input).attr('type', 'checkbox');
            $(input).attr('name', question_text);    // question text
            input.dataset.text = question_text;
            $(input).attr('checked', answer);
            container.appendChild(input);

            let label = document.createElement('label');
            $(label).attr('class', 'form-check-label');
            $(label).attr('class', 'consent_label');
            $(label).attr('name', question_text);
            $(label).text(question_text);
            container.appendChild(label);

            this.user_input.set(question_text, false);

            container.appendChild(document.createElement('br'));

            $(label).click(function() {
                $(input).attr('checked', true);
            }.bind(this));
        }
        frame.appendChild(container);

        let next = document.createElement('button');
        $(next).text('Continue');
        $(next).click(function() {
            console.log(this.get_user_input());
        }.bind(this));
        frame.appendChild(next);
        
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
        var choices = document.getElementsByTagName('input');;
        for (let each of choices) {
            if (each.checked) {
                this.user_input.set(each.dataset.text, true);
            } else {
                this.user_input.set(each.dataset.text, false);
            }
        }
        return this.user_input;
    }
}
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
class ConsentDisclosureFrame extends Frame {

    /**
     * Construct ConsentDisclosureFrame from an object
     * 
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *    frame_data.template (string) -- Exact string 'consent_disclosure'
     *    frame_data.title (string) -- The frame's title
     *    frame_data.instructions (string) -- instructions for user to read pdf
     *    frame_data.questions (Array of map of string) -- question/response pairs
     *    -- formatted as (key: question, value: boolean); value is false by default
     *    frame_data.response_name (string) - name this frame will attach to each piece
     *                 of data in return value of get_user_input
     *  Behavior undefined if frame does not have these properties.
     */
    constructor(frame_data) {
        super();
        this.template = frame_data.template;
        this.title = frame_data.title;
        this.instructions = frame_data.instructions;
        this.questions = frame_data.questions;
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
        
        // insert a h2 node for the title
        let title = document.createElement('h5');
        $(title).text(this.title);
        $(title).attr('class', 'text-info text-uppercase mb-2');
        frame.appendChild(title);

        let instructions = document.createElement('h5');
        $(instructions).attr('class', 'text-info text-uppercase mb-2');

        $(instructions).attr('class', 'consent_instructions');
        $(instructions).text(this.instructions);
        frame.appendChild(instructions);

        let pdf = document.createElement('a');
        $(pdf).attr('href', 'images/consent.pdf');
        $(pdf).attr('target', '_blank');    // opens pdf in new window/tab
        $(pdf).attr('class', 'consent_pdf');
        $(pdf).text('Consent Disclosure Form');
        frame.appendChild(pdf);

        let container = document.createElement('div');
        $(container).attr('class', 'consent_frame');

        for (let each_question of this.questions) {
            let question_text = each_question[0];
            let answer = each_question[1];

            let input = document.createElement('input');
            $(input).attr('class', 'form-check-input');
            $(input).attr('class', 'consent_input');
            $(input).attr('type', 'checkbox');
            $(input).attr('id', question_text);
            $(input).attr('disabled', true);

            $(input).prop('checked', answer);
            input.dataset.text = question_text;
            container.appendChild(input);

            let label = document.createElement('label');
            $(label).attr('class', 'form-check-label');
            $(label).attr('class', 'consent_label');
            $(label).attr('grayed', true);
            $(label).attr('for', question_text);
            $(label).text(question_text);
            container.appendChild(label);

            this.user_input.set(question_text, false);

            container.appendChild(document.createElement('br'));
        }

        $(pdf).click(function() {   // ONLY when pdf is clicked will checkboxes enable user input
            container = this.after_form(container);
        }.bind(this));
        frame.appendChild(container);
        
        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }

    /**
     * Enables users to select/unselect checkboxes
     * @param frame contains input and label elements
     * @effects allows checkboxes to be checked and labels to auto styling
     */
    after_form(frame) {
        var checkboxes = document.getElementsByTagName('input');
        for (let checkbox of checkboxes) {
            $(checkbox).attr('disabled', false);
        }
        var labels = document.getElementsByTagName('label');
        for (let label of labels) {
            $(label).attr('grayed', false);
        }
        return frame;
    }

    /**
     * Returns map of user input
     * @return Map of 
     *    {statement (string): {'name':name (string), 'response':response (boolean)} }
     */
    get_user_input() {
        var choices = document.getElementsByTagName('input');;
        for (let item of choices) {
            let value = {};
            value.name = this.response_name;
            value.response = item.checked;
            this.user_input.set(item.dataset.text, value);
        }
        return this.user_input;
    }
}

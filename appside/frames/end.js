"use strict";

/**
 * End frame
 * @author Leah Perlmutter
 */


/**
 * Last frame presented to the user when doing the study.
 */
class EndFrame extends Frame {

    /**
     * Constructs EndFrame template
     * @param frame_data -- object containing the frame's data. expected fields:
     *     frame_data.template -- The exact string 'end'
     *     frame_data.title (string)
     *     frame_data.completion_text (string)
     *     frame_data.completion_code (string)
     *     frame_data.directions (string)
     *     frame_data.contact (html string)
     * @param logger - Logger object
     */
    constructor(frame_data, logger) {
        super(logger);
        this.title = frame_data.title;
        this.completion_text = frame_data.completion_text;
        this.completion_code = frame_data.completion_code;
        this.directions = frame_data.directions;
        this.contact = frame_data.contact;
        this.template = frame_data.template;
    }

    /**
     * Render the end frame and present completion code to user
     *
     * Logging
     *   record completion code in database
     *   record end timestamp in database
     *
     * @requires - DOM must have a div whose ID is 'frame'
     * @effects - Does not preserve former content of <div id='frame'>.
     *      Renders the data from this frame into that div.
     */
    render() {
        // make a new empty div with id frame, not yet in the dom
        let frame = document.createElement('div');
        $(frame).attr('id', 'frame');

        // insert a h2 node for the title
        let title = document.createElement('h2');
        $(title).text(this.title);
        frame.appendChild(title);

        // insert a p node for the completion text
        let completion_text = document.createElement('p');
        $(completion_text).text(this.completion_text + ' ' + this.completion_code);
        frame.appendChild(completion_text);

        // insert a div for the directions
        let directions = document.createElement('div');
        $(directions).html(this.directions);
        frame.appendChild(directions);

        // insert a div for the directions
        let contact = document.createElement('div');
        $(contact).html(this.contact);
        frame.appendChild(contact);

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);

        this.logger.logTimestamp('end');
        this.logger.logCompletionCode(this.completion_code);
    }
}

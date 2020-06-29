"use strict";

/**
 * Rendering (View) code for body frames
 * @author Leah Perlmutter
 */


/**
 * Renderer (View) for Frame
 *
 * Abstract parent class of the specific types of frame.
 */
class Frame {

    constructor(logger) {
        if (new.target == Frame) {
            throw new TypeError('cannot construct Frame directly (use child)');
        }
        this.logger = logger;
    }

    /**
     * Render this frame into the DOM
     *
     * @require -- DOM must have a div whose ID is 'frame'
     *
     * @effects -- Does not preserve former content or attributes of <div id="frame">.
     *    Renders the data from this into that div.
     */
    render() {
        // replace the old frame with a placeholder
        let frame = document.createElement('div'); 
        $(frame).attr('id', 'frame');
        $(frame).text('I don\'t know how to render this type of frame');
        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }

    /**
     * Returns empty map
     * @return empty map
     */
    get_user_input() {
        return new Map();
    }

}

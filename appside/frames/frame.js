"use strict";

/**
 * Rendering (View) code for body frames
 * @author Leah Perlmutter
 */



class Frame {

    render() {
        // replace the old frame with a placeholder
        let frame = document.createElement('div'); 
        $(frame).attr('id', 'frame');
        $(frame).text('I don\'t know how to render this type of frame');
        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }
}

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

    /**
     * Construct new frame
     */
    constructor() {
        if (new.target == Frame) {
            throw new TypeError('cannot construct Frame directly (use FrameFactory)');
        }
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


/**
 * Factory to build various kinds of frame objects polymorphically
 */
class FrameFactory {
    /**
     * Take in a frame template and return the correct type of Frame object,
     * initialized with the given template field from frame.
     */
    static build(frame) {
        if(frame.template === INTRO_FRAME_TEMPLATE) {
            return new IntroFrame(frame);
        } else if(frame.template === STATEMENTS_FRAME_TEMPLATE) {
            return new StatementsBodyFrame(frame);
        } else if(frame.template === SUMMARY_COUNT_FRAME_TEMPLATE) {
            return new SummaryFrameCount(frame);
        } else if(frame.template === LIKERT_FRAME_TEMPLATE) {
            return new LikertFrame(frame);
        } else if(frame.template === SELF_REPORT_FRAME_TEMPLATE) {
            return new SelfReportFrame(frame);
        } else if(frame.template === CONSENT_FRAME_TEMPLATE) {
            return new ConsentDisclosureFrame(frame);
        } else {
            throw new Error('Frame template not recognized ' + frame.template);
        }
    }
}

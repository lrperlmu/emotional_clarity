"use strict";

/**
 * Rendering (View) code for body frames
 * @author Leah Perlmutter
 */


/**
 * Renderer (View) for Frame
 *
 * Abstract parent class of the specific types of frame.
 *
 * Has some view and some model functionality. Separable if need be, but at the
 *   time of writing I think it's overkill to have a model class for each frame
 *   AND a view class for each frame.
 */
class Frame {

    /**
     * Construct new frame
     */
    constructor(logger) {
        if (new.target == Frame) {
            throw new TypeError('cannot construct Frame directly (use FrameFactory)');
        }
        this.logger = logger;
        this.is_app = false;
        this.has_questions = false;
        this.template = 'none'; // to be ovewritten by child constructor
    }

    /**
     * Render this frame into the DOM
     * VIEW functionality
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
     * Set the background based on whether the frame is
     * part of the app or not.
     *
     * @effects -- Changes class definitions of body
     */
    set_background() {
        if (this.is_app){
            let body = document.getElementsByTagName('body'); 
            $(body[0]).addClass('doodle');

            let divs = document.getElementsByTagName('div');
            $(divs[0]).removeClass('bg-secondary');
            $(divs[1]).removeClass('bg-light');

            let icons = $('#ec_app_icon');
            if (icons.length === 0) {
                let icon = document.createElement('img');
                icon.setAttribute('src', EC_ICON);
                icon.setAttribute('height', 50);
                $(icon).addClass('float-right');
                $(icon).attr('id', 'ec_app_icon');
                $(icon).attr('alt', EC_ICON_ALT);
                $(divs[1]).prepend(icon);
            }

        }
        else {
            let body = document.getElementsByTagName('body'); 
            $(body[0]).removeClass('doodle');

            let divs = document.getElementsByTagName('div');
            $(divs[0]).addClass('bg-secondary');
            $(divs[1]).addClass('bg-light');

            let icons = $('#ec_app_icon');
            if (icons.length > 0) {
                icons[0].remove();
            }
        }
    }

    /**
     * Returns map of user input
     * VIEW functionality (depends on how frame was rendered and how user
     *  interacted with that rendering to provide input)
     * @return empty map
     */
    get_user_input() {
        return new Map();
    }

    /**
     * Get this frame's data from the argument and upate the frame
     * MODEL functionality
     *
     * @param data (UserDataSet)
     *
     * @modifies this frame
     * @effects updates this frame's data
     */
    fill_in_data(data) {
    }

    /**
     * Tell if this is a blocker frame
     * @return false
     */
    is_blocker() {
        return false;
    }

    /**
     * Disable the next button so user can't advance (nav functionality)
     * @effects -- disables next button if it was enabled
     */
    disable_next_button() {
        $('.nav_next_button').prop('disabled', true);
        $('.nav_next_button').addClass('button_disabled');
    }

    /**
     * Enable the next button so user can advance (nav functionality)
     * @effects -- enables next button if it was disabled
     */
    enable_next_button() {
        $('.nav_next_button').prop('disabled', false);
        $('.nav_next_button').removeClass('button_disabled');
    }
}


/**
 * Placeholder fake frame that can be inserted into a list of frames. It doesn't get
 * rendered to the user, but once you pass this fame, you can't go back. Cannot be the
 * last frame in the list.
 */
class BlockerFrame extends Frame {
    /**
     * Tell if this is a blocker frame
     * @return false
     */
    is_blocker() {
        return true;
    }
}


/**
 * Factory to build various kinds of frame objects polymorphically
 */
class FrameFactory {
    /**
     * Take in a frame template and return the correct type of Frame object,
     * initialized with the given template field from frame.
     *
     * @param frame (dumb frame object). Has field 'template' indicating the intended type.
     * @param logger (Logger)
     */
    static build(frame, logger) {
        if(frame.template === INTRO_FRAME_TEMPLATE) {
            return new IntroFrame(frame, logger);
        } else if(frame.template === STATEMENTS_FRAME_TEMPLATE) {
            return new StatementsBodyFrame(frame, logger);
        } else if(frame.template === SUMMARY_COUNT_FRAME_TEMPLATE) {
            return new SummaryFrameCount(frame, logger);
        } else if(frame.template === LIKERT_FRAME_TEMPLATE) {
            return new LikertFrame(frame, logger);
        } else if(frame.template === SELF_REPORT_FRAME_TEMPLATE) {
            return new SelfReportFrame(frame, logger);
        } else if(frame.template === CONSENT_FRAME_TEMPLATE) {
            return new ConsentDisclosureFrame(frame, logger);
        } else if (frame.template === END_FRAME_TEMPLATE) {
            return new EndFrame(frame, logger);
        } else {
            throw new Error('Frame template not recognized ' + frame.template);
        }
    }
}


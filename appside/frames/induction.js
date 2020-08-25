"use strict";

/**
 * Rendering (View) code for mood induction frame
 * @author Leah Perlmutter
 */


/**
 * Frames whose only input is one textbox
 */
class TextboxFrame extends Frame {
    
    /**
     * Construct ShortAnswerFrame from an object
     * 
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *    frame_data.title (string) -- name of the frame
     *    frame_data.prompt (string) -- promp
     *    frame_data.truncated_prompt (string) -- 768 bytes or less for firebase
     *    frame_data.response_name (string) - name this frame will attach to each piece
     *                 of data in return value of get_user_input
     *
     *  Behavior undefined if frame does not have these properties.
     */
    constructor(frame_data, logger) {
        super();
        if (new.target == TextboxFrame) {
            throw new TypeError('cannot construct TextboxFrame directly (use child)');
        }
        this.title = frame_data.title;
        this.prompt = frame_data.prompt;
        this.response_name = frame_data.response_name;
        this.truncated_prompt = frame_data.truncated_prompt;
        this.response = "";
    }

    /**
     * Returns map of user input
     * It's retrieved from the element with id 'user_input'
     * @return Map of
     *    {question (string): {'name':name (string), 'response':response (int or string)} }
     */
    get_user_input() {
        let input = new Map();
        let value = {};
        value.response = $('#user_input').val();
        value.name = this.response_name;
        input.set(this.truncated_prompt, value);
        return input;
    }

    /**
     * Update this frame to reflect user responses in the data set passed in
     * @param data (UserDataSet)
     *
     * @modifies this
     * @effects - possibly updates this frame's response
     */
    fill_in_data(data) {
        let known_response = data.lookup(this.truncated_prompt, this.response_name).response;
        this.response = known_response;
    }
}


/**
 * TextboxFrame with a small text box and a character limit
 */
class ShortAnswerFrame extends TextboxFrame {

    /**
     * Construct ShortAnswerFrame from an object
     * 
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *    frame_data.template (string) -- the exact string 'short_answer'
     *    frame_data.instruction (string) -- after text box
     *    frame_data.char_limit (positive int) -- character limit
     *  Behavior undefined if frame does not have these properties.
     */
    constructor(frame_data, logger) {
        super(frame_data, logger);
        this.instruction = frame_data.instruction
        this.char_limit = frame_data.char_limit;
        this.template = frame_data.template;
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
        this.set_background();

        // make a new empty div with id frame, not yet in the dom
        let frame = document.createElement('div'); 
        $(frame).attr('id', 'frame');
        
        let title = document.createElement('h4');
        $(title).text(this.title);
        $(title).addClass('text-primary text-uppercase mb-4');
        frame.appendChild(title);

        // insert a h5 node for the instruction
        let prompt = document.createElement('div');
        $(prompt).addClass('font-weight-light mb-2');
        $(prompt).text(this.prompt);
        frame.appendChild(prompt);

        // insert a text box for entry
        let textbox = document.createElement('textarea');
        $(textbox).attr('id', 'user_input');
        $(textbox).addClass('short_answer_textbox');
        $(textbox).attr('maxlength', this.char_limit);
        $(textbox).val(this.response);
        frame.appendChild(textbox);

        // insert a h5 node for the instruction
        let instruction = document.createElement('div');
        $(instruction).text(this.instruction);
        $(instruction).addClass('font-weight-light mb-2');
        frame.appendChild(instruction);

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }

}


/**
 * TextboxFrame with a large text box and a time limit
 * Auto-advances after time limit
 */
class TimedLongAnswerFrame extends TextboxFrame {
    /**
     * Construct TimedLongAnswerFrame from an object
     * 
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *    frame_data.template (string) -- the exact string 'long_answer'
     *    frame_data.time_limit (positive int) -- number of seconds
     *
     *  Behavior undefined if frame does not have these properties.
     */
    constructor(frame_data, logger) {
        super(frame_data, logger);
        this.time_limit = frame_data.time_limit;
        this.template = frame_data.template;
        this.is_auto_advance = false;
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
        this.set_background();

        // make a new empty div with id frame, not yet in the dom
        let frame = document.createElement('div'); 
        $(frame).attr('id', 'frame');
        
        let title = document.createElement('h5');
        $(title).text(this.title);
        $(title).addClass('text-primary text-uppercase mb-2');
        frame.appendChild(title);

        // insert a h5 node for the instruction
        let prompt = document.createElement('div');
        $(prompt).text(this.prompt);
        $(prompt).addClass('font-weight-light mb-4');
        frame.appendChild(prompt);

        // insert a text box for entry
        let textbox = document.createElement('textarea');
        $(textbox).attr('id', 'user_input');
        $(textbox).addClass('long_answer_textbox');
        $(textbox).val(this.response);
        frame.appendChild(textbox);

        // machinery to prevent advancing until timeout and advance at that time
        this.disable_next_button();
        let timeout_millis = this.time_limit * 1000;
        let auto_advance = function() {
            $('.nav_next_button').click();
        };
        let enable_next_botton = function() {
            $('.nav_next_button').prop('disabled', false);
            $('.nav_next_button').removeClass('button_disabled');
        };
        if (this.is_auto_advance)
            setTimeout(auto_advance, timeout_millis);
        else
            setTimeout(enable_next_botton, timeout_millis);

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }
}

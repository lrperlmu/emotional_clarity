"use strict";

/**
 * Rendering (View) code for summary frames
 * @author Leah Perlmutter
 */

class SummaryFrame extends Frame {
    /**
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *    frame_data.title (string) -- The frame's title
     *    frame_data.description (string) -- Text to appear before the list of matched emotions
     *    frame_data.graphic (string) -- URL of an image to display
     *    frame_data.follow_text -- text that comes after the list
     * 
     *    TODO: revise
     *    frame_data.type -- the exact string'count'
     *    frame_data.matched_emotions (object) -- list of matched emotions e with these fields:
     *       [] -- sequence of matched emotions e, with the following fields
     *         e.emotion -- the name of the emotion
     *         e.responses (list of string) -- list of matcbhing user responses 
     *  Behavior undefined if frame does not have these properties.
     * 
     */
    constructor(frame_data) {
        super(frame_data);
        this.title = frame_data.title;
        this.description = frame_data.description;
        this.has_graphic = false;
        if ('graphic' in frame_data) {
            if (frame_data.graphic.length > 0) {
                this.graphic = frame_data.graphic;
                this.has_graphic = true;
            }
        }
        this.follow_text = frame_data.follow_text;

        // todo: account for frame.type and frame.matched_emotions
        
        if (frame_data.type === 'qualifier') {
            this.matched_emotions = new MatchListQualifier(frame_data.matched_emotions);
        } else if (frame_data.type === 'count') {
            this.matched_emotions = new MatchListCount(frame_data.matched_emotions);
        } else {
            console.error('unrecognized frame data type ' + frame_data.type);
        }
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
        let title = document.createElement('h2');
        $(title).text(this.title);
        frame.appendChild(title);

        // insert a p node for the description
        let description = document.createElement('p');
        $(description).text(this.description);
        frame.appendChild(description);

        let flex_div = document.createElement('div');
        $(flex_div).attr('class', 'flex');
        frame.appendChild(flex_div);

        // if there is a graphic, make a two-column layout and put the graphic on the left. 
        // there is a more object oriented way to do this check. Refactor.
        if (this.has_graphic) {
            let graphic_col = document.createElement('div');
            $(graphic_col).attr('class', 'summary_graphic');
            let graphic_img = document.createElement('img');
            $(graphic_img).attr('src', this.graphic);
            $(graphic_img).attr('class', 'summary_img');
            graphic_col.appendChild(graphic_img);
            flex_div.appendChild(graphic_col);
        }
        
        // If no graphic, match list text will be the whole width.
        let text_col = document.createElement('div');
        $(text_col).attr('class', 'summary_body');
        flex_div.appendChild(text_col);

        this.matched_emotions.render_into(text_col);
        
        let follow_text = document.createTextNode(this.follow_text);
        text_col.appendChild(follow_text);

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);

    }
}


class SummaryFrameCount extends SummaryFrame {
    constructor(frame_data) {
    }


}


class MatchListCount {

    /**
     * Construct MatchListCount from an array containing matched emotions.
     * @param e_list (list) -- list of objects e with these fields:
     *         e.emotion -- the name of the emotion
     *         e.responses (list of string) -- list of matching user responses 
     */
    constructor(e_list) {
        this.emotions = e_list;
    }

    /**
     * Render this list of matching emotions by appending elements to the given dom element
     * @param element -- domm element to append to
     * @effects -- preserves existing content of element and appends 
     *   an unordered list of matches to it
     */
    render_into(element) {
        // Iterate over matched emotions and put in a line for each
        //   element.emotion, element.responses
        let match_list = element.appendChild(document.createElement('ul'));
        for (let item of this.emotions) {
            let list_item = match_list.appendChild(document.createElement('li'));

            let match_string = this.build_match_string(item.responses.length, item.emotion);
            $(list_item).text(match_string);
            $(list_item).attr('class', 'summary_match_list_item');

            list_item.appendChild(document.createElement('br'));
            // TODO: pay attention to info_sheet_links field
            // if false, no emotion buttons!
            // possibly pass in parent, call its render_emotion_name method.
            let emotion_button = document.createElement('button');
            $(emotion_button).attr('type', 'button');
            $(emotion_button).text('more info on ' + item.emotion);
            $(emotion_button).click(function() {
                alert('placeholder for navigating to emotion info page for ' + item.emotion);
            });
            list_item.appendChild(emotion_button);
            list_item.appendChild(document.createTextNode(' '));

            let responses_button = document.createElement('button');
            $(responses_button).attr('type', 'button');
            $(responses_button).text('see which ones');
            $(responses_button).click(function() {
                alert('placeholder for navigating to responses for ' + item.emotion);
            });
            list_item.appendChild(responses_button);

            match_list.appendChild(list_item);
        }
        element.appendChild(match_list);
    }

    // helper method to construct match string using count
    build_match_string(count, emotion) {
        let ret = '';
        if (count === 1) {
            ret = '1 of your responses corresponds with ';
        }
        else {
            ret = count + ' of your responses correspond with ';
        }
        ret = ret + emotion;
        return ret;
    }
}

class MatchListQualifier {

    /**
     * Construct MatchListCount from an array containing matched emotions.
     * @param e_list (list) -- list of objects e with these fields:
     *         e.emotion -- the name of the emotion
     *         e.qualifier (string) -- string describing the strength of the match
     */
    constructor(e_list) {
        this.emotions = e_list;
    }

    /**
     * Render this list of matching emotions by appending elements to the given dom element
     * @param element -- domm element to append to
     * @effects -- preserves existing content of element and appends 
     *   an unordered list of matches to it
     */
    render_into(element) {
        // Iterate over matched emotions and put in a line for each
        //   element.emotion, element.responses
        let match_list = element.appendChild(document.createElement('ul'));
        for (let item of this.emotions) {
            let list_item = match_list.appendChild(document.createElement('li'));

            match_list.appendChild(list_item);
        }
        element.appendChild(match_list);

    }

    build_match_string(qualifier) {
        let capitalized_qualifier = qualifier.charAt(0).toUpperCase() + qualifier.slice(1);
        let ret = capitalized_qualifier + ' match with ';
        return ret;
    }


}



/**
 * Render a summary frame whose type is count.
 * 
 * @require -- DOM must have a div whose ID is 'frame'
 * 
 * @effects -- Does not preserve former content of <div id="frame">.
 *     Renders the data from the argument into that div.
 * 
 **/
function render_summary_frame_count(frame_data) {

    // make a new empty div with id frame, not yet in the dom
    let frame = document.createElement('div'); 
    $(frame).attr('id', 'frame');

    // insert a h2 node for the title
    let title = document.createElement('h2');
    $(title).text(frame_data.title);
    frame.appendChild(title);

    // insert a p node for the description
    let description = document.createElement('p');
    $(description).text(frame_data.description);
    frame.appendChild(description);

    let flex_div = document.createElement('div');
    $(flex_div).attr('class', 'flex');
    frame.appendChild(flex_div);

    // if there is a graphic, make a two-column layout and put the graphic on the left. 
    // there is a more object oriented way to do this check. Refactor.
    if ('graphic' in frame_data && frame_data.graphic.length > 0) {
        let graphic_col = document.createElement('div');
        $(graphic_col).attr('class', 'summary_graphic');
        let graphic_img = document.createElement('img');
        $(graphic_img).attr('src', frame_data.graphic);
        $(graphic_img).attr('class', 'summary_img');
        graphic_col.appendChild(graphic_img);
        flex_div.appendChild(graphic_col);
    }
    
    // If no graphic, match list text will be the whole width.
    let text_col = document.createElement('div');
    $(text_col).attr('class', 'summary_body');
    flex_div.appendChild(text_col);

    // function to construct match string using count
    let build_match_string = function(count) {
        let ret = '';
        if (count === 1) {
            ret = '1 of your responses corresponds with ';
        }
        else {
            ret = count + ' of your responses correspond with ';
        }
        return ret;
    };

    // Iterate over matched emotions and put in a line for each
    //   element.emotion, element.responses
    let match_list = text_col.appendChild(document.createElement('ul'));
    for (let item of frame_data.matched_emotions) {
        let list_item = match_list.appendChild(document.createElement('li'));

        let match_string = build_match_string(item.responses.length);
        $(list_item).text(match_string);
        $(list_item).attr('class', 'summary_match_list_item');

        let emotion_button = document.createElement('button');
        $(emotion_button).attr('type', 'button');
        $(emotion_button).text(item.emotion);
        $(emotion_button).click(function() {
            alert('placeholder for navigating to emotion info page for ' + item.emotion);
        });
        list_item.appendChild(emotion_button);

        match_list.appendChild(list_item);
    }
    text_col.appendChild(match_list);
    
    let old_frame = $('#frame')[0];
    old_frame.replaceWith(frame);

}


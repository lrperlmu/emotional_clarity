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
        this.matched_emotions = frame_data.matched_emotions;
        
        // list of functions to call to append additional content to a list item
        this.additional_content = [];
        if (frame_data.info_sheet_links) {
            this.additional_content.push(this.create_emotion_button);
        }
        if (frame_data.offer_ideas) {
            this.additional_content.push(this.create_ideas_button);
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

        // insert at text node for the description
        let description = document.createTextNode(this.description);
        text_col.appendChild(description);
        text_col.append(document.createElement('br'));

        let emotion_list = this.render_emotion_list();
        text_col.appendChild(emotion_list);

        let follow_text = document.createTextNode(this.follow_text);
        text_col.appendChild(follow_text);

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }


    render_emotion_list() {
        let match_list = document.createElement('ul');
        for (let item of this.matched_emotions) {

            // create the list item
            let list_item = match_list.appendChild(document.createElement('li'));

            // build match string
            let match_string = this.build_match_string(item);
            $(list_item).text(match_string);
            $(list_item).attr('class', 'summary_match_list_item');
            list_item.appendChild(document.createElement('br'));

            list_item.appendChild(this.create_additional_content(item));

            match_list.appendChild(list_item);
        }
        return match_list;
    }


    create_ideas_button(item) {
        let ideas_button = document.createElement('button');
        $(ideas_button).attr('type', 'button');
        $(ideas_button).text('ideas for dealing with ' + item.emotion);
        $(ideas_button).click(function() {
            alert(
                'placeholder for navigating to "ideas for dealing with ' 
                    + item.emotion + '".'
            );
        });
        return ideas_button;
    }

    create_additional_content(item) {
        let ret = document.createElement('div');
        for (let creator of this.additional_content) {
            let element = creator(item);
            ret.appendChild(element);
            ret.appendChild(document.createTextNode(' '));
        }
        return ret;
    }

    create_emotion_button(item) {
        let emotion_button = document.createElement('button');
        $(emotion_button).attr('type', 'button');
        $(emotion_button).text('more info on ' + item.emotion);
        $(emotion_button).click(function() {
            alert('placeholder for navigating to emotion info page for ' + item.emotion);
        });
        return emotion_button;
    }

}


class SummaryFrameCount extends SummaryFrame {
    constructor(frame_data) {
        super(frame_data);
        this.additional_content.unshift(this.create_responses_button);
    }

    // helper method to construct match string using count
    build_match_string(item) {
        let count = item.responses.length;
        let emotion = item.emotion
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

    create_responses_button(item) {
        // Create SEE RESPONSES button
        let responses_button = document.createElement('button');
        $(responses_button).attr('type', 'button');
        $(responses_button).text('see which ones');
        $(responses_button).click(function() {
            alert('placeholder for navigating to responses for ' + item.emotion);
        });
        return responses_button;
    }

}


class SummaryFrameQualifier extends SummaryFrame {
    constructor(frame_data) {
        super(frame_data);
    }

    // helper method to construct match string using qualifier
    build_match_string(item) {
        let qualifier = item.qualifier;
        //let capitalized_qualifier = qualifier.charAt(0).toUpperCase() + qualifier.slice(1);
        let ret = 'A ' + qualifier + ' match with ' + item.emotion;
        return ret;
    }


}

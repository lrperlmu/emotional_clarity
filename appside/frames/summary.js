
"use strict";

/**
 * Rendering (View) code for summary frames
 * @author Leah Perlmutter
 */


/**
 * Renderer (View) for the Summary Frame
 *
 * Abstract parent class of the specific types of summary frame.
 *
 * Child classes must implement build_match_string which takes in an object
 *   returns a string saying how well the users's responses match that object's emotion.
 */
class SummaryFrame extends Frame {
    /**
     * Construct SummaryFrame from frame_data
     *
     * @param frame_data - Object containing the frame's data. Expected fields:
     *    frame_data.title (string) - The frame's title
     *    frame_data.description (string) - Text to appear before the list of matched emotions
     *    frame_data.graphic (string) - URL of an image to display
     *    frame_data.follow_text - text that comes after the list
     *    frame_data.info_sheet_links - true to show 'more info on [emotion]' buttons
     *    frame_data.offer_ideas - true to show 'ideas for dealing with [emotion]' buttons
     *    frame_data.matched_emotions (object) - list of emotions e, each having these fields:
     *         e.emotion - the name of the emotion
     *         e.responses (list of string) - list of matching user responses
     *    frame_data.is_app (boolean) - true if the frame is part of the actual app,
     *         false if it is part of the experiment. Changes the visual design.
     *    frame_data.template (string) - specified in child constructor
     */
    constructor(frame_data) {
        if (new.target == SummaryFrame) {
            throw new TypeError('cannot construct SummaryFrame directly (use child)');
        }

        super(frame_data);
        this.title = frame_data.title;
        this.instruction = frame_data.instruction;
        this.description = frame_data.description;
        this.has_graphic = false;
        this.is_app = frame_data.is_app;
        this.template = frame_data.template;

        if ('graphic' in frame_data) {
            if (frame_data.graphic.length > 0) {
                this.graphic = frame_data.graphic;
                this.has_graphic = true;
            }
        }
        this.follow_text = frame_data.follow_text;
        this.matched_emotions = frame_data.matched_emotions;
        
        // list of functions to call to append additional content to a list item
        // this serves as a hook for child classes to add content
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
     * @effects -- Does not preserve former content or attributes of <div id="frame">.
     *    Renders the data from this into that div.
     */
    render() {
        this.set_background();

        // make a new empty div with id frame, not yet in the dom
        let frame = document.createElement('div'); 
        $(frame).attr('id', 'frame');

        // insert a h2 node for the title
        let title = document.createElement('h5');
        $(title).text(this.title);
        $(title).attr('class', 'text-info text-uppercase');
        frame.appendChild(title);

        let flex_div = document.createElement('div');
        $(flex_div).attr('class', 'summary_flex');
        frame.appendChild(flex_div);

        // if there is a graphic, make a two-column layout and put the graphic on the left. 
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

        let instruction = document.createElement('h2');
        $(instruction).text(this.instruction);
        $(instruction).attr('class', 'font-weight-light mb-4');
        text_col.appendChild(instruction);

        // insert at text node for the description
        let description = document.createElement('div');
        $(description).html(this.description);
        $(description).attr('class', 'font-weight-light mb-4');
        text_col.appendChild(description);

        let emotion_list = this.render_emotion_list();
        text_col.appendChild(emotion_list);

        let follow_text = document.createElement('div');
        $(follow_text).text(this.follow_text);
        $(follow_text).attr('class', 'font-weight-light');
        text_col.appendChild(follow_text);

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }

    // Helper method to render the list of emotions
    render_emotion_list() {
        let listDiv = document.createElement('div');
        $(listDiv).attr('class', 'font-weight-light mb-4');
        let match_list = document.createElement('ul');
        for (let item of this.matched_emotions) {

            // create the list item
            let list_item = match_list.appendChild(document.createElement('li'));

            // build match string
            let match_string = this.build_match_string(item);
            let emotion_name = document.createElement('h5');
            $(emotion_name).text(match_string);

            // optional content and child-specified content
            emotion_name.appendChild(this.create_additional_content(item));
            $(emotion_name).attr('class', 'font-weight-light summary_match_list_item');
            list_item.appendChild(emotion_name);

            match_list.appendChild(list_item);
        }
        listDiv.appendChild(match_list);
        return listDiv;
    }


    // Helper method that strings together the additional content of this.
    // Appends each content creator's content, then whitespace.
    create_additional_content(item) {
        let ret = document.createElement('div');
        $(ret).addClass('summary_additional_content');

        for (let creator of this.additional_content) {
            // need to pass in this in case the method needs to use it, because the way
            //   we're calling these methods makes the 'this' context get lost
            let element = creator(this, item);
            ret.appendChild(element);
            ret.appendChild(document.createTextNode(' '));
        }
        return ret;
    }

    // Creates "Ideas for dealing with [emotion]" Buttons
    // @param self - this will be passed in, in case the 'this' context is lost
    // @param item - object with fields:
    //     emotion - name of emotion
    create_ideas_button(self, item) {
        let ideas_button = document.createElement('button');
        $(ideas_button).attr('type', 'button');
        $(ideas_button).text(`ideas for dealing with ${item.emotion}`);
        $(ideas_button).click(function() {
            alert(
                `placeholder for navigating to "ideas for dealing with ${item.emotion}"`
            );
        });
        return ideas_button;
    }

    // Creates "More info on [emotion]" Buttons
    // @param self - this will be passed in, in case the 'this' context is lost
    // @param item - object with fields:
    //     emotion - name of emotion
    create_emotion_button(self, item) {
        let emotion_button = document.createElement('button');
        $(emotion_button).attr('type', 'button');
        $(emotion_button).text(`more info on ${item.emotion}`);
        $(emotion_button).click(function() {
            alert(`placeholder for navigating to emotion info page for ${item.emotion}`);
        });
        return emotion_button;
    }
}


/**
 * Renderer (View) for the SummaryFrameCount
 *
 * This kind of summary frame can show how many and which user responses match each
 *  emotion in its list.
 */
class SummaryFrameCount extends SummaryFrame {

    /**
     * Construct SummaryFrameCount from frame_data
     *
     * @param frame_data - Object containing the frame's data. Expected fields:
     *    [All fields specified in parent constructor] and the following:
     *    frame_data.template - the exact string 'count'
     */
    constructor(frame_data) {
        super(frame_data);
        this.additional_content.unshift(this.create_responses_button);
    }

    // helper method to construct match string from item
    build_match_string(item) {
        return item.emotion;
    }

    // Creates "See which ones" Buttons to display the list of responses
    //     matching the given emotion.
    // @param self - this will be passed in, in case the 'this' context is lost
    // @param item - object with fields:
    //     emotion - name of emotion
    //     responses - list of user responses matching this emotion
    // @return - a div containing the button and a hidden div that appears when
    //           the button is clicked and shows responses
    create_responses_button(self, item) {
        let emotion = item.emotion;

        let responses_container = document.createElement('div');
        $(responses_container).attr('class', 'summary_responses_container');

        // button to make popup appear
        let responses_button = document.createElement('button');
        $(responses_button).attr('class', 'btn btn-outline-info px-1 py-0');
        $(responses_button).attr('type', 'button');
        
        let count = item.responses.length;
        if(count === 1) {
            $(responses_button).text('1 response');
        } else {
            $(responses_button).text(`${count} responses`);
        }

        $(responses_button).attr('data-toggle', 'popover');
        $(responses_button).attr('title', 'Responses consistent with ' + self.build_match_string(item));
        
        let response_list = document.createElement('ul');
        for (let response of item.responses) {
            let list_item = document.createElement('li');
            list_item.appendChild(document.createTextNode(response));
            response_list.appendChild(list_item);
        }
        
        $(responses_button).attr('data-html', 'true');
        $(responses_button).popover({container: 'body', content: response_list});

        responses_container.appendChild(responses_button);
        return responses_container;
    }
}


/**
 * Renderer (View) for the SummaryFrameQualifier
 *
 * This kind of summary frame can show "how strong" of a match the user's response is
 *   for each emotion in its list
 */
class SummaryFrameQualifier extends SummaryFrame {

    /**
     * Construct SummaryFrameQualifier from frame_data
     *
     * @param frame_data - Object containing the frame's data. Expected fields:
     *    [All fields specified in parent constructor] and the following:
     *    frame_data.template - the exact string 'qualifier'
     */
    constructor(frame_data) {
        super(frame_data);
    }

    // helper method to construct match string using qualifier
    build_match_string(item) {
        let qualifier = item.qualifier;
        let ret = `A ${qualifier} match with ${item.emotion}`;
        return ret;
    }
}

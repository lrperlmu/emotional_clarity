"use strict";

/**
 * Rendering (View) code for frames with body maps
 * @author Rachel Sitt
 */


/**
 * Frame displays body map for each emotion and body part, then asks
 * how much it applies to user.
 */
class BodyMapColorFrame extends Frame {
    
    /** Constructs Body Map Color frame template
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *      frame_data.title (string)
     *      frame_data.question (string) -- question users answer
     *      frame_data.qualifiers (array of strings)
     *          -- lists all answer choices used in questionnaire
     * Behavior undefined if frame does not have these properties.
     **/
    constructor(frame_data) {
        super();
        this.title = frame_data.title;
        this.question = frame_data.question;
        this.qualifiers = frame_data.qualifiers;
        this.emotion = frame_data.emotion;
        this.bodypart = frame_data.bodypart;
        this.answer = null;
        this.user_input = new Map();
    }

    /**
     * Renders Body Map Color frame
     * @require -- DOM must have a div whose ID is 'frame'
     *
     * @effects -- Does not preserve former content of <div id='frame'>.
     *      Renders the data from the argument into that div.
     *
     **/
    render() {
        // make a new empty div with id frame, not yet in the dom
        let frame = document.createElement('div');
        $(frame).attr('id', 'frame');

        let title = document.createElement('h2');
        $(title).text(this.title);
        frame.appendChild(title);
        
        frame.graphic_column = document.createElement('div');             // displays body image and scale
        $(frame.graphic_column).attr('class', 'bodymap_color_frame_graphic_column');

        frame.text_column = document.createElement('div');            // displays questionnaire and NEXT button
        $(frame.text_column).attr('class', 'bodymap_color_frame_text_column');

        let greeting = document.createElement('h4');            // displays when emotion/bodypart NOT specified
        $(greeting).text('Please select an emotion.');
        frame.graphic_column.appendChild(greeting);

        if (this.emotion != null && this.bodypart != null) {
            this.render_graphic_column(frame);                    // only renders when emotion is specified
            this.render_text_column(frame);                   // only renders when bodypart is specified
        }

        frame.appendChild(frame.graphic_column);
        frame.appendChild(frame.text_column);

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }

    /** 
     * Private helper method for bodymap_color
     * Renders frame.graphic_column
     *
     * @param frame -- div that holds content of template
     *          frame.graphic_column (div) -- holds content from this function
     * 
     * @requires
     *          this.emotion (String) exists
     *          this.bodyparts (array of String) contains the 6 body parts
     *
     * @effects -- does not preserve any content from frame.graphic_column
     *      Renders specified emotion graphic, cropped to specified bodypart,
     *      and displays scale.png
     **/
    render_graphic_column(frame) {
        frame.graphic_column.innerHTML = '';
        const bodymap = document.createElement('img');
        $(bodymap).attr('class', 'bodymap_color_img');
        if (this.emotion != null) {
            $(bodymap).attr('src', 'images/' + this.emotion + '.png');
        }

        if (this.bodypart != null) {      // clipping picture when specified body part
            $(bodymap).attr('class', `bodymap_color_img bodymap_color_${this.bodypart}`);
        }
        frame.graphic_column.appendChild(bodymap);    

        const bg_image = document.createElement('img');
        $(bg_image).attr('src', 'images/outline.png');
        $(bg_image).attr('class', 'bodymap_color_bg_img');
        frame.graphic_column.appendChild(bg_image);

        const scale = document.createElement('img');
        $(scale).attr('src', 'images/scale.png');
        $(scale).attr('class', 'bodymap_color_scale_img');
        frame.graphic_column.appendChild(scale);
    }

    /**
     * Private helper method for bodymap_color
     * Renders frame.text_column
     *
     * @param frame -- div frame must contain frame.text_column
     *          frame.text_column (div) -- holds content from this function
     * 
     * @requires
     *          this.bodypart (String) be an element in bodyparts
     *          this.question (String) exists
     *          this.qualifiers (array of String) contains answer choices
     *
     * @effects -- does not preserve any content from frame.text_column
     *      If no specified bodypart, renders links to each bodypart
     *      If specified body part, renders questionnaire
     **/
    render_text_column(frame) {
        frame.text_column.innerHTML = '';
        let question = document.createElement('p');
        var string = this.bodypart + ' in ' + this.emotion;
        $(question).text(this.question.replace('{}', string));
        frame.text_column.appendChild(question);

        for (let choice of this.qualifiers) {
            let radio = document.createElement('input');
            $(radio).attr('type', 'radio');
            $(radio).attr('name', this.emotion + '_' + this.bodypart);
            $(radio).attr('id', choice);
            radio.dataset.text = choice;

            let label = document.createElement('label');
            $(label).attr('for', choice);
            $(label).text(choice);
            frame.text_column.appendChild(radio);
            frame.text_column.appendChild(label);
            frame.text_column.appendChild(document.createElement('br'));
        }

        // next will be implemented in navigator?
        let next = document.createElement('button');
        $(next).attr('class', 'bodymap_color_button');
        $(next).text('Next');
        frame.text_column.appendChild(next);

    }

    /**
     * Returns map of user input
     * containing keys {
     * 'emotion': null or string
     * 'bodypart': null or string
     * 'answer': null or string of qualifier
     * }
     * @return map of user input
     */
    get_user_input() {
        var choices = document.getElementsByTagName('input');;
        for (let each of choices) {
            if (each.checked) { this.answer = each.dataset.text; } // only one checked
        }
        this.user_input.set('emotion', this.emotion);
        this.user_input.set('bodypart', this.bodypart);
        this.user_input.set('answer', this.answer);
        return this.user_input;
    }
}

/**
 * Frame shows two body map images and asks user to color body parts
 * corresponding to level of increased or decreased sensation.
 */
class BodyMapColorFwdFrame extends Frame {

    /**
     * Constructs Body Map Color Forward template
     *
     * @param frame_data -- contains frame data including
     *      frame_data.title (String) -- title of frame
     *      frame_data.colors (arrays of String) -- 2 arrays of color names
     *      frame_data.texts (arrays of String) -- 2 arrays of instruction text
     **/
    constructor(frame_data) {
        super();
        this.title = frame_data.title;
        this.colors = frame_data.colors;
        this.texts = frame_data.texts;
    }
    /**
     * Renders Body Map Color Forward frame
     * @require -- DOM must have a div whose ID is 'frame'
     *
     * @effects -- Does not preserve former content of <div id='frame'>.
     *      Renders the data from the argument into that div.
     *
     **/

    render() {
        this.image = new Image();
        this.image.src = 'images/outline.png';

        let frame = document.createElement('div');
        $(frame).attr('id', 'frame');

        let title = document.createElement('h2');
        $(title).text(this.title);
        $(title).attr('class', 'bodymap_color_fwd_title');
        frame.appendChild(title);

        frame.left = document.createElement('div');
        $(frame.left).attr('class', 'bodymap_color_fwd_frame_left');

        frame.center = document.createElement('div');
        $(frame.center).attr('class', 'bodymap_color_fwd_frame_center');

        let scale = document.createElement('img');
        $(scale).attr('src', 'images/scale.png');
        $(scale).attr('class', 'bodymap_color_fwd_scale');
        frame.center.appendChild(scale);

        frame.right = document.createElement('div');
        $(frame.right).attr('class', 'bodymap_color_fwd_frame_right');

        let inc = new BodyMapCanvas(frame.left, this.colors[0], this.texts[0]);
        $(inc).attr('class', 'bodymap_color_fwd_canvas_inc');
        let dec = new BodyMapCanvas(frame.text_column, this.colors[1], this.texts[1]);
        $(dec).attr('class', 'bodymap_color_fwd_canvas_dec');
        inc.render();
        dec.render();

        frame.appendChild(frame.left);
        frame.appendChild(frame.center);
        frame.appendChild(frame.right);

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }
}

/**
 * Renders body map image with clickable/color-changing body parts
 */
class BodyMapCanvas {

    /**
     * Constructs necessary fields for body map image
     *
     * @param frame (div)-- must be an empty div
     * @param colors (array of String)-- contains 3 color names
     * @param text (String) -- instructional text
     *
     **/
    constructor(frame, colors, text, qualifiers) {
        this.frame = frame;
        this.colors = colors;
        this.text = text;
    }

    /**
     * Renders body map with clickable body parts
     *
     * @effects renders content of bodyMapCanvas including
     *      header, scale, clear and next buttons,
     *      and clickable/color-changing body parts
     **/
    render() {

        // Instructional text
        let text = document.createElement('h4');
        $(text).text(this.text);
        this.frame.appendChild(text);

        // SVG
        let bg = document.createElementNS(SVG_URL, 'svg');
        $(bg).attr('class', 'bodymap_canvas_bg');

        let img = document.createElementNS(SVG_URL, 'image');
        $(img).attr('class', 'bodymap_canvas_img');
        $(img).attr('href', 'images/outline.png');
        bg.appendChild(img);

        // Body Part Click Sections
        let head = document.createElementNS(SVG_URL, 'rect');
        $(head).attr('class', 'bodymap_canvas_head');

        let neck = document.createElementNS(SVG_URL, 'rect');
        $(neck).attr('class', 'bodymap_canvas_neck');

        let arm_left = document.createElementNS(SVG_URL, 'polygon'); // left from client view
        $(arm_left).attr('class', 'bodymap_canvas_arm_left');
        $(arm_left).attr('points', '28,110 50,105 35,200 27,220 27,260 23,290 23,300 7,300 5,280 3,270 3,230 15,170 15,140');

        let arm_right = document.createElementNS(SVG_URL, 'polygon')    // right from client view
        $(arm_right).attr('class', 'bodymap_canvas_arm_right');
        $(arm_right).attr('points', '120,100 150,115 160,150 160,170 172,230 172,250 170,300 150,300 150,295 146,260 145,218 140,200');

        let hands = document.createElementNS(SVG_URL, 'polygon');
        $(hands).attr('class', 'bodymap_canvas_hands');
        $(hands).attr('points', '23,300 28,320 28,331 32,340 30,344 15,344 5,330 7,300 170,300 170,310 172,330 163,345 147,345 142,340 145,335 145,320 150,300');

        let chest = document.createElementNS(SVG_URL, 'polygon');
        $(chest).attr('class', 'bodymap_canvas_chest');
        $(chest).attr('points', '50,105 70,93 105,93 120,100 138,195 132,220 135,270 40,270 43,220 37,195');

        let belly = document.createElementNS(SVG_URL, 'rect');
        $(belly).attr('class', 'bodymap_canvas_belly');

        let legs = document.createElementNS(SVG_URL, 'polygon');
        $(legs).attr('class', 'bodymap_canvas_legs');
        $(legs).attr('points', '40,250 137,255 140,340 130,385 125,440 125,490 110,555 87,555 93,525 88,480 90,450 90,400 87,370 83,410 83,450 84,490 82,520 87,555 63,555 50,490 48,400 36,335 37,260');

        let feet = document.createElementNS(SVG_URL, 'polygon');
        $(feet).attr('class', 'bodymap_canvas_feet');
        $(feet).attr('points', '87,555 110,555 120,590 110,595 95,595 87,585 87,555 87,585 80,595 60,595 55,585 63,570 63,555');

        bg.appendChild(neck);
        bg.appendChild(head);
        bg.appendChild(arm_left);
        bg.appendChild(arm_right);
        bg.appendChild(hands);
        bg.appendChild(chest);
        bg.appendChild(legs);
        bg.appendChild(belly);
        bg.appendChild(feet);

        $(bg).children().attr('fill', 'black'); // temporarily black, not set in CSS
        $(bg).children().attr('data-clicked', '0');
        $(bg).children().click(function(e) {    // changes fill color of body part
            e.target.dataset.clicked = (e.target.dataset.clicked + 1) % 3;
            $(e.target).attr('fill', this.colors[e.target.dataset.clicked]);
        }.bind(this));

        // Buttons
        let clear = document.createElement('button');
        $(clear).text('Clear');
        $(clear).click(function() {
            $(bg).children().attr('data-clicked', '0');
            $(bg).children().attr('fill', 'black');
        });
        let next = document.createElement('button');
        $(next).text('Next');
        $(next).click(function() {
            let result = 'Results: \n';
            for (let bodypart of $(bg).children()) {
                result += $(bodypart).attr('class') + ': ';
                result += this.colors[bodypart.dataset.clicked] + '\n';
            }
            alert(result);
        }.bind(this));

        this.frame.appendChild(bg);
        this.frame.appendChild(clear);
        this.frame.appendChild(next);
    }
}

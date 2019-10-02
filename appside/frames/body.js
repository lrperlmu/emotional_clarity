"use strict";

/**
 * Rendering (View) code for body frames
 * @author Leah Perlmutter, Rachel Sitt
 */


/**
 * A frame composed of a list of things.
 * 
 * Things in the list are to be rendered as a list of checkboxes.
 **/
class ListBodyFrame extends Frame {

    /**
     * Construct ListBodyFrame from an object
     * 
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *    frame_data.template -- The exact string 'statements'
     *    frame_data.title (string) -- The frame's title
     *    frame_data.question (string) -- Text to appear before the list of statements
     *  Behavior undefined if frame does not have these properties.
     */
    constructor(frame_data) {
        super();

        // check validity (todo)
        // has title with length > 1
        // has question with length > 1

        // set fields
        this.template = frame_data.template;
        this.title = frame_data.title;
        this.question = frame_data.question;
        this.user_input = new Map();
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
        let title = document.createElement('h5');
        $(title).text(this.title);
        $(title).attr('class', 'text-info text-uppercase mb-2');
        frame.appendChild(title);

        // insert a p node for the question
        let question = document.createElement('h2');
        $(question).text(this.question);
        $(question).attr('class', 'font-weight-light mb-4');
        frame.appendChild(question);
        
        // insert a checkbox list for the statements
        let statements = document.createElement('div');
        $(statements).attr('class', 'form-check');

        let i = 0;
        for (let statement of this.items) {
            let name = 'stmt' + i;
            i += 1;

            // the actual checkbox
            let input = document.createElement('input');
            $(input).attr('class', "form-check-input");
            $(input).attr('type', 'checkbox');
            $(input).attr('name', name);
            $(input).attr('id', name);
            input.dataset.text = statement;
            statements.appendChild(input);

            // label that can also be clicked to select the checkbox
            let label = document.createElement('label');
            $(label).attr('class', "form-check-label");
            $(label).attr('for', name);
            $(label).text(statement);
            statements.appendChild(label);
            this.user_input.set(statement, 'false');
            
            statements.appendChild(document.createElement('br'));
        }
        frame.appendChild(statements);

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }

    /**
     * Returns map of user input
     * containing keys {
     * 'question_text': boolean (if checked: true)
     * }
     * @return map of user input
     */
    get_user_input() {
        var choices = document.getElementsByTagName('input');;
        for (let each of choices) {
            if (each.checked) {
                this.user_input.set(each.dataset.text, true);
            } else {
                this.user_input.set(each.dataset.text, false);
            }
        }
        return this.user_input;
    }
}

/**
 * Frame consisting of a list of statements. Statements can be any length,
 * including longer than one line.
 */
class StatementsBodyFrame extends ListBodyFrame {

    /**
     * Construct StatementsBodyFrame from an object
     * 
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *    all fields required by super constructor
     *    frame_data.statements (list of string) -- Statements the user can agree/disagree with
     *        contains at least one element.
     */
    constructor(frame_data) {
        super(frame_data);

        // todo: check validity of statements (list of at least one)
        
        this.items = frame_data.statements;
    }
}

/**
 * Frame consisting of a list of words. We expect each word is shorter than one line.
 */
class WordsBodyFrame extends ListBodyFrame {

    /**
     * Construct WordsBodyFrame from an object
     * 
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *    all fields required by super constructor
     *    frame_data.words (list of string) -- Words the user can agree or disagree with
     *        contains at least one element.
     */
    constructor(frame_data) {
        super(frame_data);

        // todo: check validity of words (list of at least one)
        
        this.items = frame_data.words;
    }
}

/**
 * Frame consists of a list of statements relating to body sensations
 * and a body map image.
 */
class BodyMapFrame extends Frame {

     /**
     * Construct a body map frame
     *
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *      frame_data.title (string)
     *      frame_data.question (string) -- text before checkboxes
     *      frame_data.statements (list of string) -- checkbox statements
     * Behavior undefined if frame doe snot have these properties.
     **/
    constructor(frame_data) {
        super();

        this.title = frame_data.title;
        this.question = frame_data.question;
        this.statements = frame_data.statements;
        this.user_input = new Map();
    }

    /**
     * Render a frame for the body maps template.
     *
     * @require -- DOM must have a div whose ID is 'frame'
     *
     * @effects -- Does not preserve former content of <div id="frame">.
     *      Renders the data from the argument into that div,
     *      including graphic for body map.
     *
     **/
     
    render() {
        // make a new empty div with id frame, not yet in the dom
        let frame = document.createElement('div');
        $(frame).attr('id', 'frame');
        let title = document.createElement('h2');
        $(title).text(this.title);
        frame.appendChild(title);

        let left = document.createElement('div');
        $(left).attr('class', 'bodymap_frame_left');

        let right = document.createElement('div');
        $(right).attr('class', 'bodymap_frame_right');

        // body maps graphic column
        var graphic = document.createElement('img');
        $(graphic).attr('src', 'images/neutral.png');
        $(graphic).attr('class', 'bodymap_img');
        left.appendChild(graphic);

        let question = document.createElement('h4');
        $(question).text(this.question);
        right.appendChild(question);

        // checkboxes
        let i = 0;
        for (let stmt of this.statements) {
            let name = 'label' + i;
            i++;

            let check = document.createElement('input');
            $(check).attr('type', 'checkbox');
            $(check).attr('id', name);
            check.dataset.text = stmt;
            right.appendChild(check);

            let label = document.createElement('label');
            $(label).attr('for', name);
            $(label).text(stmt);

            right.appendChild(label);
            right.appendChild(document.createElement('br'));

            this.user_input.set(stmt, 'false'); // all unchecked
        }

        // next will be implemented in navigator?
        let next = document.createElement('button');
        $(next).attr('class', 'bodymap_button');
        $(next).text('Next');
        right.appendChild(next);

        // append both columns to frame
        frame.appendChild(right);
        frame.appendChild(left);

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }

    /**
     * Returns map of user input
     * if render() is called, map with keys as each statement's text and value boolean;
     * otherwise, returns uninitialized map
     * @return map of user input
     */
    get_user_input() {
        var choices = document.getElementsByTagName('input');
        for (let each of choices) {
            if (each.checked) {
                this.user_input.set(each.dataset.text, 'true');
            } else {
                this.user_input.set(each.dataset.text, 'false');
            }
        }
        return this.user_input;
    }
}

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
        
        frame.left = document.createElement('div');             // displays body image and scale
        $(frame.left).attr('class', 'bodymap_color_frame_left');

        frame.right = document.createElement('div');            // displays questionnaire and NEXT button
        $(frame.right).attr('class', 'bodymap_color_frame_right');

        let greeting = document.createElement('h4');            // displays when emotion/bodypart NOT specified
        $(greeting).text('Please select an emotion.');
        frame.left.appendChild(greeting);

        if (this.emotion != null && this.bodypart != null) {
            this.render_left_col(frame);                    // only renders when emotion is specified
            this.render_right_col(frame);                   // only renders when bodypart is specified
        }

        frame.appendChild(frame.left);
        frame.appendChild(frame.right);

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }

    /** 
     * Private helper method for bodymap_color
     * Renders frame.left
     *
     * @param frame -- div that holds content of template
     *          frame.left (div) -- holds content from this function
     * 
     * @requires
     *          this.emotion (String) exists
     *          this.bodyparts (array of String) contains the 6 body parts
     *
     * @effects -- does not preserve any content from frame.left
     *      Renders specified emotion graphic, cropped to specified bodypart,
     *      and displays scale.png
     **/
    render_left_col(frame) {
        frame.left.innerHTML = '';
        const bodymap = document.createElement('img');
        $(bodymap).attr('class', 'bodymap_color_img');
        if (this.emotion != null) {
            $(bodymap).attr('src', 'images/' + this.emotion + '.png');
        }

        if (this.bodypart != null) {      // clipping picture when specified body part
            $(bodymap).attr('class', `bodymap_color_img bodymap_color_${this.bodypart}`);
        }
        frame.left.appendChild(bodymap);    

        const bg_image = document.createElement('img');
        $(bg_image).attr('src', 'images/outline.png');
        $(bg_image).attr('class', 'bodymap_color_bg_img');
        frame.left.appendChild(bg_image);

        const scale = document.createElement('img');
        $(scale).attr('src', 'images/scale.png');
        $(scale).attr('class', 'bodymap_color_scale_img');
        frame.left.appendChild(scale);
    }

    /**
     * Private helper method for bodymap_color
     * Renders frame.right
     *
     * @param frame -- div frame must contain frame.right
     *          frame.right (div) -- holds content from this function
     * 
     * @requires
     *          this.bodypart (String) be an element in bodyparts
     *          this.question (String) exists
     *          this.qualifiers (array of String) contains answer choices
     *
     * @effects -- does not preserve any content from frame.right
     *      If no specified bodypart, renders links to each bodypart
     *      If specified body part, renders questionnaire
     **/
    render_right_col(frame) {
        frame.right.innerHTML = '';
        let question = document.createElement('p');
        var string = this.bodypart + ' in ' + this.emotion;
        $(question).text(this.question.replace('{}', string));
        frame.right.appendChild(question);

        for (let choice of this.qualifiers) {
            let radio = document.createElement('input');
            $(radio).attr('type', 'radio');
            $(radio).attr('name', this.emotion + '_' + this.bodypart);
            $(radio).attr('id', choice);
            radio.dataset.text = choice;

            let label = document.createElement('label');
            $(label).attr('for', choice);
            $(label).text(choice);
            frame.right.appendChild(radio);
            frame.right.appendChild(label);
            frame.right.appendChild(document.createElement('br'));
        }

        // next will be implemented in navigator?
        let next = document.createElement('button');
        $(next).attr('class', 'bodymap_color_button');
        $(next).text('Next');
        frame.right.appendChild(next);

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
        let dec = new BodyMapCanvas(frame.right, this.colors[1], this.texts[1]);
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
        let url = 'http://www.w3.org/2000/svg';
        let bg = document.createElementNS(url, 'svg');
        $(bg).attr('class', 'bodymap_canvas_bg');

        let img = document.createElementNS(url, 'image');
        $(img).attr('class', 'bodymap_canvas_img');
        $(img).attr('href', 'images/outline.png');
        bg.appendChild(img);

        // Body Part Click Sections
        // "polygon points can only be specified as element attribute, not CSS"
        // - tinyurl.com/svgPolygon
        let head = document.createElementNS(url, 'rect');
        $(head).attr('class', 'bodymap_canvas_head');

        let neck = document.createElementNS(url, 'rect');
        $(neck).attr('class', 'bodymap_canvas_neck');

        let arm_left = document.createElementNS(url, 'polygon'); // left from client view
        $(arm_left).attr('class', 'bodymap_canvas_arm_left');
        $(arm_left).attr('points', '28,110 50,105 35,200 27,220 27,260 23,290 23,300 7,300 5,280 3,270 3,230 15,170 15,140');

        let arm_right = document.createElementNS(url, 'polygon')    // right from client view
        $(arm_right).attr('class', 'bodymap_canvas_arm_right');
        $(arm_right).attr('points', '120,100 150,115 160,150 160,170 172,230 172,250 170,300 150,300 150,295 146,260 145,218 140,200');

        let hands = document.createElementNS(url, 'polygon');
        $(hands).attr('class', 'bodymap_canvas_hands');
        $(hands).attr('points', '23,300 28,320 28,331 32,340 30,344 15,344 5,330 7,300 170,300 170,310 172,330 163,345 147,345 142,340 145,335 145,320 150,300');

        let chest = document.createElementNS(url, 'polygon');
        $(chest).attr('class', 'bodymap_canvas_chest');
        $(chest).attr('points', '50,105 70,93 105,93 120,100 138,195 132,220 135,270 40,270 43,220 37,195');

        let belly = document.createElementNS(url, 'rect');
        $(belly).attr('class', 'bodymap_canvas_belly');

        let legs = document.createElementNS(url, 'polygon');
        $(legs).attr('class', 'bodymap_canvas_legs');
        $(legs).attr('points', '40,250 137,255 140,340 130,385 125,440 125,490 110,555 87,555 93,525 88,480 90,450 90,400 87,370 83,410 83,450 84,490 82,520 87,555 63,555 50,490 48,400 36,335 37,260');

        let feet = document.createElementNS(url, 'polygon');
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
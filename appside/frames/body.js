"use strict";

/**
 * Rendering (View) code for body frames
 * @author Leah Perlmutter
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

        // insert a p node for the question
        let question = document.createElement('p');
        $(question).text(this.question);
        frame.appendChild(question);
        
        // insert a checkbox list for the statements
        let statements = document.createElement('div');
        let i = 0;
        for (let statement of this.items) {
            let name = 'stmt' + i;
            i += 1;

            // the actual checkbox
            let input = document.createElement('input');
            $(input).attr('type', 'checkbox');
            $(input).attr('name', name);
            $(input).attr('id', name);
            statements.appendChild(input);

            // label that can also be clicked to select the checkbox
            let label = document.createElement('label');
            $(label).attr('for', name);
            $(label).text(statement);
            statements.appendChild(label);
            
            statements.appendChild(document.createElement('br'));
        }
        frame.appendChild(statements);

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
        
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
        left.style.backgroundColor = "lightpink";
        left.style.width = "300px";
        left.style.left = '0px';
        left.style.height = '100%';
        left.style.position = 'absolute';

        let right = document.createElement('div');
        right.style.backgroundColor = "lightblue";
        right.style.left = '300px';
        right.style.height = '100%';
        right.style.position = 'absolute';


        // body maps graphic column
        var graphic = document.createElement('img');
        graphic.setAttribute("src", "images/neutral.png");
        graphic.setAttribute("width", "150px");
        left.appendChild(graphic);


        // statement column
        $(right).attr('text-align', 'left');

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
            right.appendChild(check);

            let label = document.createElement('label');
            $(label).text(stmt);
            right.appendChild(label);

            right.appendChild(document.createElement('br'));
        }


        // append both columns to frame
        frame.appendChild(right);
        frame.appendChild(left);

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }
}

/**
 * Frame gives introduction and portrays an image.
 */
class IntroFrame extends Frame {

    /** Constructs Intro frame template
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *      frame_data.title (string)
     *      frame_data.text (string) -- content of each page on introduction
     *      frame_data.graphic (string) -- URL link to graphic
     * Behavior undefined if frame does not have these properties.
     **/

    constructor(frame_data) {
        super();

        this.title = frame_data.title;
        this.text = frame_data.text;
        this.graphic = frame_data.graphic;
    }

    /** Render the Intro frame template
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

        // insert a h2 node for the title
        let title = document.createElement('h2');
        $(title).text(this.title);
        frame.appendChild(title);

        // insert a h5 node for the header1
        let header = document.createElement('h5');
        $(header).text('When to do this activity');
        frame.appendChild(header);

        // insert a p node for the content of header1
        let content = document.createElement('p');
        $(content).text(this.text);
        frame.appendChild(content);

        // insert graphic
        if (this.graphic.length > 0) {
            var graphic = document.createElement('img');
            graphic.setAttribute('src', this.graphic);
            graphic.setAttribute('height', '228');
            frame.appendChild(graphic);
        }
        
        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
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
     *      frame_data.emotions (array of strings)
     *          -- lists all emotions used excluding neutral
     *      frame_data.bodyparts (array of string)
     *          -- lists all body parts used
     *      frame_data.qualifiers (array of strings)
     *          -- lists all answer choices used in questionnaire
     *      frame_data.emotion (string) -- "neutral", placeholder for emotion type
     *      frame_data.bodypart (string) -- "", placeholder for body part
     * Behavior undefined if frame does not have these properties.
     **/
    constructor(frame_data) {
        super();

        this.title = frame_data.title;
        this.question = frame_data.question;
        this.emotions = frame_data.emotions;    // array of emotions
        this.bodyparts = frame_data.bodyparts;  // array of body parts
        this.qualifiers = frame_data.qualifiers;
        this.emotion = frame_data.emotion;      // default: neutral
        this.bodypart = frame_data.bodypart;    // default: ''
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
        // create links to each emotion
        for (let curr of this.emotions) {
            let emotion_link = document.createElement('label');
            emotion_link.style.textDecoration = 'underline';
            $(emotion_link).attr('class', 'emotion_link');
            $(emotion_link).attr('id', curr);
            $(emotion_link).text(curr.charAt(0).toUpperCase() + curr.slice(1));
            emotion_link.onclick = function() {
                this.emotion = curr;
                this.bodypart = '';
                this.render_left_col(frame);
                this.render_right_col(frame);
            }.bind(this);
            frame.append(emotion_link);
            frame.append(document.createTextNode('\xa0\xa0\xa0'));
        }

        frame.left = document.createElement('div');
        $(frame.left).attr('class', 'bodymap_color_frameLeft');

        frame.right = document.createElement('div');
        $(frame.right).attr('class', 'bodymap_color_frameRight');

        let greeting = document.createElement('h4');
        $(greeting).text("Please select an emotion.");
        frame.left.appendChild(greeting);

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
        $(bodymap).attr('src', 'images/' + this.emotion + '.png');

        if (this.bodypart.length > 0) {      // clipping picture when specified body part
            if (this.bodypart === this.bodyparts[0]) { // head
                bodymap.style.clipPath = 'circle(12% at 50% 6%)';
            } else if (this.bodypart === this.bodyparts[1]) { // neck
                bodymap.style.clipPath =
                'polygon(25% 12%, 42% 15%, 58% 15%, 75% 12%, 75% 15%, 70% 16%, 60% 17%, 40% 17%, 30% 16%, 25% 15%)';
            } else if (this.bodypart === this.bodyparts[2]) {     // chest
                bodymap.style.clipPath = 'polygon(16% 18%, 40% 15%, 60% 15%, 84% 18%, 77% 36%, 25% 36%)';
            } else if (this.bodypart === this.bodyparts[3]) { // arms
                bodymap.style.clipPath =
                'polygon(0% 0%, 0% 100%, 20% 100%, 22% 0, 80% 0, 79% 100%, 23% 100%, 23% 100%, 100% 100%, 100% 0%)';
            } else if (this.bodypart === this.bodyparts[4]) { // belly
                bodymap.style.clipPath = 'ellipse(33% 9% at 50% 43%)'; // ellipse
            } else { // legs
                bodymap.style.clipPath = 'polygon(20% 45%, 50% 51%, 83% 44%, 73% 100%, 25% 100%)';  // V shape
            }
        }
        frame.left.appendChild(bodymap);    

        const bg_image = document.createElement('img');
        $(bg_image).attr('src', 'images/outline.png');
        $(bg_image).attr('class', 'bodymap_color_bgImg');
        frame.left.appendChild(bg_image);

        const scale = document.createElement('img');
        $(scale).attr('src', 'images/scale.png');
        $(scale).attr('class', 'bodymap_color_scaleImg');
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
     *          this.bodypart (String) exists
     *          this.bodyparts (array of String) contains types of emotions
     *          this.question (String) exists
     *          this.qualifiers (array of String) contains answer choices
     *
     * @effects -- does not preserve any content from frame.right
     *      If no specified bodypart, renders links to each bodypart
     *      If specified body part, renders questionnaire
     **/
    render_right_col(frame) {
        frame.right.innerHTML = '';
        if (this.bodypart.length === 0) {     // body part not selected
            for (let part of this.bodyparts) {
                let body_link = document.createElement('p');
                $(body_link).attr('class', 'bodymap_color_bodyLink');
                $(body_link).text(part.charAt(0).toUpperCase() + part.slice(1));
                body_link.onclick = function () {   // clicked on body part
                    this.bodypart = part;
                    this.render_left_col(frame);
                    this.render_right_col(frame);
                }.bind(this);
                frame.right.appendChild(body_link);
            }
        } else {    // body part is selected
            let question = document.createElement('h4');
            $(question).text(this.question);
            frame.right.appendChild(question);

            for (let choice of this.qualifiers) {
                let radio = document.createElement('input');
                $(radio).attr('type', 'radio');
                $(radio).attr('name', 'emotion');
                $(radio).attr('id', choice);

                let label = document.createElement('label');
                $(label).attr('for', choice);
                $(label).text(choice);
                frame.right.appendChild(radio);
                frame.right.appendChild(label);
                frame.right.appendChild(document.createElement('br'));
            }
        }
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
     *      frame_data.qualifiers (arrays of String) -- 2 arrays of label names
     **/
    constructor(frame_data) {
        super();
        this.title = frame_data.title;
        this.colors = frame_data.colors;
        this.texts = frame_data.texts;
        this.qualifiers = frame_data.qualifiers;
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
        frame.appendChild(title);

        frame.left = document.createElement('div');
        $(frame.left).attr('class', 'bodymap_color_fwd_frameLeft');

        frame.right = document.createElement('div');
        $(frame.right).attr('class', 'bodymap_color_fwd_frameRight');

        let inc = new BodyMapCanvas(frame.left, this.colors[0], this.texts[0], this.qualifiers[0]);
        $(inc).attr('class', 'bodymap_color_fwd_canvas_inc');
        let dec = new BodyMapCanvas(frame.right, this.colors[1], this.texts[1], this.qualifiers[1]);
        $(dec).attr('class', 'bodymap_color_fwd_canvas_dec');
        inc.render();
        dec.render();

        frame.appendChild(frame.left);
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
     * @param qualifiers (String) -- color label description
     *
     **/
    constructor(frame, colors, text, qualifiers) {
        this.frame = frame;
        this.colors = colors;
        this.text = text;
        this.qualifiers = qualifiers;
    }

    /**
     * Renders body map with clickable body parts
     *
     * @effects renders content of bodyMapCanvas including
     *      header, instruction texts, clear and next buttons,
     *      and clickable/color-changing body parts
     **/
    render() {

        // Instructional text
        let text = document.createElement('h4');
        $(text).text(this.text);
        this.frame.appendChild(text);

        let qualifiers = document.createElement('p');
        $(qualifiers).text(this.qualifiers);
        this.frame.appendChild(qualifiers);

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

        let hand_left = document.createElementNS(url, 'polygon');   // left from client view
        $(hand_left).attr('class', 'bodymap_canvas_hand_left');
        $(hand_left).attr('points', '23,300 28,320 28,331 32,340 30,344 15,344 5,330 7,300');

        let hand_right = document.createElementNS(url, 'polygon');  // right from client view
        $(hand_right).attr('class', 'bodymap_canvas_hand_right');
        $(hand_right).attr('points', '170,300 170,310 172,330 163,345 147,345 142,340 145,335 145,320 150,300');

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
        bg.appendChild(hand_left);
        bg.appendChild(hand_right);
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
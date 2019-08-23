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

class BodyMapFrame extends Frame {

     /**
     * Construct a body map frame

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

class BodyMapColorFwdFrame extends Frame {

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
        let dec = new BodyMapCanvas(frame.right, this.colors[1], this.texts[1], this.qualifiers[0]);
        inc.render();
        dec.render();

        frame.appendChild(frame.left);
        frame.appendChild(frame.right);

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }
}

/** 
 * Render body map image with pre-designed selection area
 **/
class BodyMapCanvas {

    /**
     * Constructs necessary fields for body map image
     *
     * @param frame, array of colors (3), instructional text
     *
     **/
    constructor(frame, color, text, qualifiers) {
        this.frame = frame;
        this.color = color;
        this.text = text;
        this.qualifiers = qualifiers;
        this.draw;
    }

    /**
     * Renders image with clickable parts
     * .............. MORE DETAILS TBD
     **/
    render() {
        this.draw = document.createElement('canvas');
        $(this.draw).attr('class', 'bodymap_color_fwd_canvas');
        $(this.draw).attr('width', 175);     // css styling cannot override inline style
        $(this.draw).attr('height', 597);    // css styling cannot override inline style
        if(typeof G_vmlCanvasManager != 'undefined') {
            this.draw = G_vmlCanvasManager.initElement(this.draw);
        }
        var context = this.draw.getContext('2d');

        $(this.draw).click(function(e) {
            context.beginPath();
            context.strokeStyle = this.color;
            context.moveTo(e.clientX - 40, e.clientY - 70);
            context.lineTo(e.clientX, e.clientY);
            context.stroke();
        }.bind(this));
        
        // Instructional text
        let text = document.createElement('h4');
        $(text).text(this.text);
        this.frame.appendChild(text);

        let qualifiers = document.createElement('p');
        $(qualifiers).text(this.qualifiers);
        this.frame.appendChild(qualifiers);

        let img = new Image();
        img.src = 'images/outline.png';

        // Buttons (initializes and clears drawing)
        let clear = document.createElement('button');
        $(clear).text('Start');
        $(clear).click(function() {
            $(clear).text('Clear');
            context.clearRect(0, 0, 175, 597);
            context.drawImage(img, 0, 0, 175, 597);
        });
        let next = document.createElement('button');
        $(next).text('Next');
        $(next).click(function() {
            alert('Placeholder for "NEXT" button');
        });
        this.frame.appendChild(clear);
        this.frame.appendChild(next);
        this.frame.appendChild(this.draw);
    }
}
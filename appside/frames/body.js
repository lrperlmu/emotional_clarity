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
        graphic.setAttribute("src", "bodymaps/neutral.png");
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
        $(bodymap).attr('src', 'bodymaps/' + this.emotion + '.png');

        if (this.bodypart.length > 0) {      // clipping picture when specified body part
            if (this.bodypart === this.bodyparts[0]) { // head
                bodymap.style.clipPath = 'circle(12% at 50% 6%)';
            } else if (this.bodypart === this.bodyparts[1]) { // neck
                bodymap.style.clipPath =
                'polygon(25% 12%, 42% 15%, 58% 15%, 75% 12%, 75% 15%, 70% 16%, 60% 17%, 40% 17%, 30% 16%, 25% 15%)';
            } else if (this.bodypart === this.bodyparts[2]) {     // chest
                // bodymap.style.clipPath = 'inset(15% 22% 62% 22%)';   // rect shape
                bodymap.style.clipPath = 'ellipse(31% 12% at 50% 28%)'; // ellipse shape
            } else if (this.bodypart === this.bodyparts[3]) { // arms
                bodymap.style.clipPath =
                'polygon(0% 0%, 0% 100%, 20% 100%, 22% 0, 80% 0, 79% 100%, 23% 100%, 23% 100%, 100% 100%, 100% 0%)';
            } else if (this.bodypart === this.bodyparts[4]) { // belly
                // bodymap.style.clipPath =
                //'polygon(22% 37%, 80% 37%, 85% 45%, 80% 58%, 21% 58%, 18% 45%)';  // rect shape
                bodymap.style.clipPath = 'ellipse(33% 11% at 50% 48%)'; // ellipse shape
            } else { // legs
                bodymap.style.clipPath = 'polygon(20% 56%, 50% 61%, 80% 56%, 70% 100%, 25% 100%)';  // V shape
                // bodymap.style.clipPath = 'inset(58% 20% 0% 20%)';    // rect shape
            }
        }
        frame.left.appendChild(bodymap);    

        const bg_image = document.createElement('img');
        $(bg_image).attr('src', 'bodymaps/neutral.png');
        $(bg_image).attr('class', 'bodymap_color_bgImg');
        frame.left.appendChild(bg_image);

        const scale = document.createElement('img');
        $(scale).attr('src', 'bodymaps/scale.png');
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
        this.image.src = 'bodymaps/blank.png';
        // increasing
        this.incX = new Array();
        this.incY = new Array();
        this.incDrag = new Array();
        var incPaint;
        // decreasing
        this.decX = new Array();
        this.decY = new Array();
        this.decDrag = new Array();
        var decPaint;

        let frame = document.createElement('div');
        $(frame).attr('id', 'frame');

        let title = document.createElement('h2');
        $(title).text('Body Map Color -- Forward');
        frame.appendChild(title);

        frame.left = document.createElement('div');
        $(frame.left).attr('class', 'bodymap_color_fwd_frameLeft');

        frame.right = document.createElement('div');
        $(frame.right).attr('class', 'bodymap_color_fwd_frameRight');

        let textL = document.createElement('h4');
        $(textL).text('Draw on this body where bodily sensations are increased. Click below to start.');
        frame.left.appendChild(textL);

        let textR = document.createElement('h4');
        $(textR).text('Draw on this body where bodily sensations are decreased. Click below to start.');
        frame.right.appendChild(textR);

        // canvas board for increasing
        var draw_inc = document.createElement('canvas');
        $(draw_inc).attr('class', 'bodymap_color_fwd_canvasI');
        $(draw_inc).attr('width', 175);     // css styling cannot override inline style
        $(draw_inc).attr('height', 597);    // css styling cannot override inline style
        if(typeof G_vmlCanvasManager != 'undefined') {
            draw_inc = G_vmlCanvasManager.initElement(draw_inc);
        }
        var contextI = draw_inc.getContext('2d');

        // canvas board for decreasing
        var draw_dec = document.createElement('canvas');
        $(draw_dec).attr('width', 175); // css styling cannot override inline style
        $(draw_dec).attr('height', 597); // css styling cannot override inline style
        $(draw_dec).attr('class', 'bodymap_color_fwd_canvasD');
        if(typeof G_vmlCanvasManager != 'undefined') {
            draw_dec = G_vmlCanvasManager.initElement(draw_dec);
        }
        var contextD = draw_dec.getContext('2d');
        
        // Event Listeners for increasing
        $(draw_inc).mousedown(function(e) {
            this.incPaint = true;
            this.incX.push(e.clientX - 40);
            this.incY.push(e.clientY - 70);
            this.incDrag.push(false);
            this.redraw(contextI, 'red');
        }.bind(this));

        $(draw_inc).mousemove(function(e) {
            if (this.incPaint) {
                this.incX.push(e.clientX - 40);
                this.incY.push(e.clientY - 70);
                this.incDrag.push(true);
                this.redraw(contextI, 'red');
            }
        }.bind(this));

        $(draw_inc).mouseup(function(e) {
            this.incPaint = false;
        }.bind(this));

        $(draw_inc).mouseleave(function(e) {
            this.incPaint = false;
        }.bind(this));

        // Event Listeners for decreasing
        $(draw_dec).mousedown(function(e) {
            this.decPaint = true;
            this.decX.push(e.clientX - 340);
            this.decY.push(e.clientY - 70);
            this.decDrag.push(false);
            this.redraw(contextD, 'blue');
        }.bind(this));

        $(draw_dec).mousemove(function(e) {
            if (this.decPaint) {
                this.decX.push(e.clientX - 340);
                this.decY.push(e.clientY - 70);
                this.decDrag.push(true);
                this.redraw(contextD, 'blue');
            }
        }.bind(this));

        $(draw_dec).mouseup(function(e) {
            this.decPaint = false;
        }.bind(this));

        $(draw_dec).mouseleave(function(e) {
            this.decPaint = false;
        }.bind(this));

        let clearLeft = document.createElement('button');
        $(clearLeft).text('Clear');
        $(clearLeft).click(function() {
            contextI.clearRect(0, 0, 175, 597);
            this.incX = [];
            this.incY = [];
            this.incDrag = [];
        }.bind(this));

        let clearRight = document.createElement('button');
        $(clearRight).text('Clear');
        $(clearRight).click(function() {
            contextD.clearRect(0, 0, 175, 597);
            this.decX = [];
            this.decY = [];
            this.decDrag = [];
        }.bind(this));

        frame.left.appendChild(draw_inc);
        frame.right.appendChild(draw_dec);
        frame.left.appendChild(clearLeft);
        frame.right.appendChild(clearRight);
        frame.appendChild(frame.left);
        frame.appendChild(frame.right);

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }

    /**
     * Private helper method for bodymap_color_fwd,
     * Draws over clicked area on canvas
     * 
     * @param context -- canvas must be 175x597
     * @param color -- (String) either 'red' or 'blue',
     *          also used to differentiate canvases
     *
     * @effects -- draws at specified area the specified color
    **/

    redraw(context, color) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // clears canvas
        context.beginPath();
        context.lineWidth = 7;
        context.lineCap = 'round';
        context.strokeStyle = color;
        if (color === 'red') {  // increasing
            context.moveTo(this.incX[0], this.incY[0]);
            context.lineTo(this.incX[0], this.incY[0]);

            for (var i = 0; i < this.incX.length; i++) {
                if (this.incDrag[i]) {      // if dragging, continue line
                    context.lineTo(this.incX[i], this.incY[i]);
                } else {
                    context.stroke();   // closes line
                    context.beginPath();    // creates new line
                    context.moveTo(this.incX[i], this.incY[i]);
                    context.lineTo(this.incX[i], this.incY[i]);
                }
            }
        } else {        // decreasing
            context.moveTo(this.decX[0], this.decY[0]);
            context.lineTo(this.decX[0], this.decY[0]);

            for (var i = 0; i < this.decX.length; i++) {
                if (this.decDrag[i]) {      // if dragging, continue line
                    context.lineTo(this.decX[i], this.decY[i]);
                } else {
                    context.stroke();   // closes line
                    context.beginPath();    // creates new line
                    context.moveTo(this.decX[i], this.decY[i]);
                    context.lineTo(this.decX[i], this.decY[i]);
                }
            }
        }
        context.stroke();   // closes line
        context.drawImage(this.image, 0, 0, 175, 597); // sets image on top
    }
}
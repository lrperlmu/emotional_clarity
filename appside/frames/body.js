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
        graphic.setAttribute("src", "bodymaps/Neutral.png");
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
     * @param frame -- Object containing the frame's data. Expected fields:
     *      frame.title (string)
     *      frame.text (string) -- content of each page on introduction
     *      frame.graphic (string) -- URL link to graphic
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
    /**
     *
     *
     **/

    constructor(frame_data) {
        super();

        this.title = frame_data.title;
        this.question = frame_data.question;
        this.emotions = frame_data.emotions;    // array of emotions
        this.bodyparts = frame_data.bodyparts;  // array of emotions
        this.qualifiers = frame_data.qualifiers;
        this.emotion = frame_data.emotion;      // default: neutral
        this.bodypart = frame_data.bodypart;    // default: ''
    }

    /**
     *
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
        frame.left.style.width = '300px';
        frame.left.style.left = '0px';
        frame.left.style.height = '100%';
        frame.left.style.position = 'absolute';

        frame.right = document.createElement('div');
        frame.right.style.left = '300px';
        frame.right.style.height = '100%';
        frame.right.style.position = 'absolute';

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
 * @param frame -- div frame must contain frame.left
 * @param emotion -- String from one of emotions array or 'Neutral'
 * @param bodypart -- String from one of bodyparts array or is empty
 *
 * @effects -- does not preserve any content from frame.left
 *      Renders specified emotion graphic, cropped to specified bodypart,
 *      and displays scale.png
 **/
render_left_col(frame) {
    frame.left.innerHTML = '';
    const bodymap = document.createElement('img');
    bodymap.setAttribute('src', 'bodymaps/' + this.emotion + '.png');
    bodymap.setAttribute('width', '120px');
    bodymap.style.left = '0px';
    bodymap.style.zIndex = '2';     // in front of bg_image
    bodymap.style.position = 'absolute';

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
    bg_image.setAttribute('src', 'bodymaps/neutral.png');
    bg_image.setAttribute('width', '120px');
    bg_image.style.left = '0px';
    bg_image.style.position = 'absolute';
    bg_image.style.zIndex = '1';        // behind bodymap
    frame.left.appendChild(bg_image);

    const scale = document.createElement('img');
    scale.setAttribute('src', 'bodymaps/scale.png');
    scale.setAttribute('width', '140px');
    scale.style.position = 'absolute';
    scale.style.left = '140px';
    scale.style.top = '90px'
    frame.left.appendChild(scale);
}

/**
 * Private helper method for bodymap_color
 * Renders frame.right
 *
 * @param frame -- div frame must contain frame.right
 * @param quest -- String comes from sample_app.body[2].question
 * @param emotion -- String from one of emotions array or 'Neutral'
 * @param bodypart -- String from one of bodyparts array or is empty
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
            body_link.style.textDecoration = 'underline';
            body_link.style.color = 'blue';
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

    render() {
        let frame = document.createElement('div');
        $(frame).attr('id', 'frame');

        let title = document.createElement('h2');
        $(title).text('Body Map Color -- Forward');
        frame.appendChild(title);

        frame.left = document.createElement('div');
        frame.left.style.width = '300px';
        frame.left.style.left = '0px';
        frame.left.style.height = '100%';
        frame.left.style.position = 'absolute';

        frame.right = document.createElement('div');
        frame.right.style.width = '300px';
        frame.right.style.left = '300px';
        frame.right.style.height = '100%';
        frame.right.style.position = 'absolute';

        let textL = document.createElement('h4');
        $(textL).text('Draw on this body where bodily sensations are increased.');
        frame.left.appendChild(textL);

        let textR = document.createElement('h4');
        $(textR).text('Draw on this body where bodily sensations are decreased.');
        frame.right.appendChild(textR);

        // graphic for increasing
        const img_inc = document.createElement('img');
        img_inc.src = 'bodymaps/Neutral.png';
        img_inc.style.width = '175px';
        img_inc.style.height = 'auto';
        img_inc.style.top = '70px';
        img_inc.style.left = '40px';
        img_inc.style.position = 'absolute';
        img_inc.style.zIndex = '1';     // behind canvas

        // graphic for decreasing
        const img_dec = document.createElement('img');
        img_dec.src = 'bodymaps/Neutral.png';
        img_dec.style.width = '175px';
        img_dec.style.height = '597px';
        img_dec.style.top = '70px';
        img_dec.style.left = '40px';
        img_dec.style.position = 'absolute';
        img_dec.style.zIndex = '1';     // behind canvas

        // canvas board for increasing
        var draw_inc = document.createElement('canvas');
        $(draw_inc).attr('width', img_inc.style.width);
        $(draw_inc).attr('height', img_inc.style.height);
        // draw_inc.style.width = img_inc.style.width;
        // draw_inc.style.height = img_inc.style.height;
        draw_inc.style.top = '70px';
        draw_inc.style.left = '40px';
        draw_inc.style.position = 'absolute';
        draw_inc.style.zIndex = '2';
        draw_inc.setAttribute('id', 'canvasI');
        var contextI = draw_inc.getContext('2d');

        // canvas board for decreasing
        var draw_dec = document.createElement('canvas');
        draw_dec.style.width = img_dec.style.width;
        draw_dec.style.height = img_dec.style.height;
        draw_dec.style.top = '70px';
        draw_dec.style.left = '40px';
        draw_dec.style.position = 'absolute';
        draw_dec.style.zIndex = '2';
        draw_dec.setAttribute('id', 'canvasD');
        var contextD = draw_dec.getContext('2d');
        
        // when drawing event listener
        draw_inc.onclick = function (e) {
            //return draw(img_inc, (e.clientX - 40) * 1.7, (e.clientY - 70) / 4, contextI, 'red');
            this.draw(img_inc, e.clientX - 40, e.clientY - 70, contextI, 'red');
        }.bind(this);
        draw_dec.onclick = function (e) {
            this.draw(img_dec, (e.clientX - 340) * 1.7, (e.clientY - 70) / 4, contextD, 'blue');
        }.bind(this);
        frame.left.appendChild(img_inc);
        frame.left.appendChild(draw_inc);

        frame.right.appendChild(img_dec);
        frame.right.appendChild(draw_dec);

        frame.appendChild(frame.left);
        frame.appendChild(frame.right);

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }

/**
 * Private helper method for bodymap_color_fwd,
 * Draws circle over clicked area on canvas
 * 
 * @param img -- graphic must be 175x597
 * @param x -- integer of x coordinate of clicked point
 * @param y -- integer of y coordinate of clicked point
 * @param draw -- canvas.getContext; method draws on this
 * @param color -- canvas uses this String as the drawing color
 *
 * @require -- screen must be scrolled to bottom to yield correct results
 *
 * @effects -- draws circle at specified area on specified canvas
**/

draw(img, x, y, draw, color) {
    draw.beginPath();
    draw.fillStyle = color;
    draw.arc(x, y, 5, 0, 2 * Math.PI);
    // draw.ellipse(x, y, 13, 2, 0, 0, 2 * Math.PI);
    // used ellipse over circle to offset y
    draw.fill();
    console.log('x: ' + x + ', y: ' + y);
}
}
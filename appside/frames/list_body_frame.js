"use strict";

/**
 * Rendering (View) code for body frames with lists of checkboxes
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
     *    frame_data.graphic (string) -- URL/path to image or null
     *    frame_data.response_name (string) - name this frame will attach to each piece
     *                 of data in return value of get_user_input
     *  Behavior undefined if frame does not have these properties.
     */
    constructor(frame_data) {
        super();
        if (new.target == ListBodyFrame) {
            throw new TypeError('cannot construct ListBodyFrame directly (use FrameFactory)');
        }

        // check validity (todo)
        // has title with length > 1
        // has question with length > 1

        // set fields
        this.template = frame_data.template;
        this.title = frame_data.title;
        this.question = frame_data.question;
        this.user_input = new Map();
        this.graphic = frame_data.graphic;
        this.response_name = frame_data.response_name;
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

        let container = document.createElement('div');  // flexbox for content
        $(container).attr('class', 'list_body_frame');

        let text_column = document.createElement('div');  // if no graphic, it occupies entire container
        $(text_column).attr('class', 'frame_text_column');

        if (this.graphic != null) {
            let graphic_column = document.createElement('div');
            $(graphic_column).attr('class', 'frame_graphic_column');
            // SVG
            let bg = document.createElementNS(SVG_URL, 'svg');
            $(bg).attr('class', 'list_body_bg');

            let img = document.createElementNS(SVG_URL, 'image');
            $(img).attr('class', 'list_body_graphic');
            $(img).attr('href', 'images/neutral.png');
            bg.appendChild(img);

            if (this.bodypart != null) {
                let highlight = document.createElementNS(SVG_URL, 'rect');
                if (this.bodypart != 'arms') {
                    $(highlight).attr('class', `list_body_graphic list_body_${this.bodypart}`);
                } else {    // 2 SVG elements for arms
                    $(highlight).attr('class', `list_body_graphic list_body_arm1`);
                    let highlight2 = document.createElementNS(SVG_URL, 'rect');
                    $(highlight2).attr('class', `list_body_graphic list_body_arm2`);
                    bg.appendChild(highlight2);
                }
                bg.appendChild(highlight);
            }
            graphic_column.appendChild(bg);
            container.appendChild(graphic_column);
        }

        // insert a p node for the question
        let question = document.createElement('h2');
        $(question).text(this.question);
        $(question).attr('class', 'font-weight-light mb-4');
        text_column.appendChild(question);
        
        // insert a checkbox list for the statements
        let statements = document.createElement('div');
        $(statements).attr('class', 'form-check');

        let i = 0;
        for (let tuple of this.items) {
            let statement = tuple[0];
            let answer = tuple[1];
            let note_text = tuple[2];

            let name = 'stmt' + i;
            i += 1;

            // the actual checkbox
            let input = document.createElement('input');
            $(input).attr('class', 'form-check-input');
            $(input).attr('type', 'checkbox');
            $(input).attr('name', name);
            $(input).attr('id', name);
            $(input).prop('checked', answer);
            input.dataset.text = statement;
            statements.appendChild(input);

            // label that can also be clicked to select the checkbox
            let label = document.createElement('label');
            $(label).attr('class', 'form-check-label');
            $(label).attr('for', name);
            $(label).text(statement);
            statements.appendChild(label);
            this.user_input.set(statement, 'false');

            // label that appears when the checkbox is checked
            let note = document.createElement('note');
            $(note).text(` (${note_text})`);
            statements.appendChild(note);
            function show_hide_note() {
                if($(input).prop('checked') === true) {
                    $(note).attr('class', 'listbody-note-visible');
                }
                else {
                    $(note).attr('class', 'listbody-note-hidden');
                }
            };
            show_hide_note();
            $(input).change(show_hide_note);
            
            statements.appendChild(document.createElement('br'));
        }
        text_column.appendChild(statements);

        container.appendChild(text_column);
        frame.appendChild(container);
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
     *    frame_data.statements -- list of 3-element lists containing the following:
     *          * statement (string)
     *          * response (boolean)
     *          * emotion (string)
            [ [stmt, response, emotion], [...], ...]
     *      contains at least one element.
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
class BodyMapFrame extends ListBodyFrame {

     /**
     * Construct a body map frame
     *
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *      frame_data.title (string)
     *      frame_data.question (string) -- text before checkboxes
     *      frame_data.bodypart (string) -- type of body part
     *      frame_data.statements (list of string) -- checkbox statements
     * Behavior undefined if frame doe snot have these properties.
     **/
    constructor(frame_data) {
        super(frame_data);
        this.bodypart = frame_data.bodypart;   
        this.graphic = '';
        this.items = frame_data.statements;
    }
}


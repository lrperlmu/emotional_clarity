"use strict";

/**
 * Renders (View) code for intro frame
 */

/**
 * Renders IntroFrame
 */
class IntroFrame extends Frame {

    /** Constructs Intro frame template
     * @param frame_data -- Object containing the frame's data. Expected fields:
     *      frame_data.template -- The exact string 'intro'
     *      frame_data.title (string)
     *      frame_data.text (array of string) -- content of each paragraph of introduction
     *      frame_data.graphic (string) -- URL link to graphic
     * Behavior undefined if frame does not have these properties.
     **/
    constructor(frame_data) {
        super();

        this.title = frame_data.title;
        this.instruction = frame_data.instruction;
        this.text = frame_data.text;
        this.graphic = frame_data.graphic;
        this.template = frame_data.template;
        this.is_app = frame_data.is_app;
    }

    /** Render the Intro frame template
     * @require -- DOM must have a div whose ID is 'frame'
     *
     * @effects -- Does not preserve former content of <div id='frame'>.
     *      Renders the data from the argument into that div.
     *
     **/
    render() {
        this.setBackground();

        // make a new empty div with id frame, not yet in the dom
        let frame = document.createElement('div');
        $(frame).attr('id', 'frame');

        // insert a h5 node for the title
        let title = document.createElement('h5');
        $(title).addClass('text-info text-uppercase');
        $(title).text(this.title);
        frame.appendChild(title);

        let container = document.createElement('div');  // flexbox for content
        $(container).attr('class', 'list_body_frame');

        let text_column = document.createElement('div');  // if no graphic, it occupies entire container
        $(text_column).attr('class', 'frame_text_column');

        let instruction = document.createElement('h3');
        $(instruction).addClass('font-weight-light mb-4');
        $(instruction).text(this.instruction);
        text_column.appendChild(instruction);

        // insert a p node for the content of header1
        for (let para of this.text) {
            let content = document.createElement('p');
            $(content).text(para);
            $(content).attr('class', 'intro_text');
            $(content).attr('class', 'font-weight-light mb-2');
            text_column.appendChild(content);
        }

        // insert graphic
        if(typeof this.graphic !== 'undefined') {
            var graphic = document.createElement('img');
            graphic.setAttribute('src', this.graphic);
            graphic.setAttribute('height', '228');
            text_column.appendChild(graphic);
        }
        
        container.appendChild(text_column);
        frame.appendChild(container);
        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }
}

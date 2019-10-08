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
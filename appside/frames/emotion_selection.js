"use strict";

/**
 * Rendering (View) code for emotion selection frame
 * @author Leah Perlmutter
 */


/**
 * Renderer (View) for EmotionSelectionFrame
 */
class EmotionSelectionFrame extends Frame {

    constructor() {
        super();
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
        let title_text = 'Emotion Selection';
        let description_text = 'Which emotions do you think you might be feeling now?';
        let emotions = [
            'Anger', 'Disgust', 'Envy', 'Fear', 'Guilt', 'Jealousy', 'Sadness', 'Shame',
        ];

        // make a new empty div with id frame, not yet in the dom
        let frame = document.createElement('div');
        $(frame).attr('id', 'frame');

        // insert a h2 node for the title
        let title = document.createElement('h5');
        $(title).text(title_text);
        $(title).attr('class', 'text-info text-uppercase mb-2');
        frame.appendChild(title);

        // insert a p node for the description
        let description = document.createElement('h2');
        $(description).text(description_text);
        $(description).attr('class', 'font-weight-light mb-4');
        frame.appendChild(description);

        let flex_div = document.createElement('div');
        $(flex_div).attr('class', 'selection_flex');
        frame.appendChild(flex_div);

        // Make a rectangle for each emotion
        // clicking in the rectangle toggles its border from light to bold
        for (let emotion of emotions) {
            let rect = document.createElement('button');
            $(rect).attr('id', `selection_rect_${emotion}`);
            $(rect).attr('type', 'button');
            $(rect).attr('class', 'btn btn-outline-info');
            $(rect).text(emotion);
            $(rect).click(function() {
                rect.classList.toggle('btn-outline-info');
                rect.classList.toggle('btn-info');
            });
            flex_div.appendChild(rect);
        }

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }
}


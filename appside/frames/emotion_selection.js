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
        let title = document.createElement('h2');
        $(title).text(title_text);
        frame.appendChild(title);

        // insert a p node for the description
        let description = document.createElement('p');
        $(description).text(description_text);
        frame.appendChild(description);

        let flex_div = document.createElement('div');
        $(flex_div).attr('class', 'selection_flex');
        frame.appendChild(flex_div);

        // Make a rectangle for each emotion
        // clicking in the rectangle toggles its border from light to bold
        for (let emotion of emotions) {
            let rect = document.createElement('span');
            $(rect).attr('id', `selection_rect_${emotion}`);
            $(rect).attr('class', 'selection_rect');
            $(rect).text(emotion);
            $(rect).click(function() {
                rect.classList.toggle('selected');
            });
            flex_div.appendChild(rect);
        }

        let old_frame = $('#frame')[0];
        old_frame.replaceWith(frame);
    }
}


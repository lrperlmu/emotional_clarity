'use strict';
let emotions = ['Anger', 'Disgust', 'Envy', 'Fear', 'Happiness', 'Love', 'Sadness', 'Shame'];
let qualifiers = ['Very much', 'Neutral', 'Not at all', 'I don\'t know'];
let bodyparts = ['Head', 'Neck', 'Chest', 'Arms', 'Belly', 'Legs'];

$(document).ready(function() {
    main();
});

function main() {
    let sample_app = SAMPLE_APP;
    let frame = sample_app.body[2]; // template: bodymap_statements
    render_bodymap_color(frame, 'neutral');
}

/**

 * Render a frame for the body map color template.
 *
 * @param frame -- Object containing the frame's data. Expected fields:
 *      frame.title (string)
 *      frame.question (string) -- text before checkboxes
 * Behavior undefined if frame doe snot have these properties.
 *
 * @require -- DOM must have a div whose ID is 'frame'
 *
 * @effects -- Does not preserve former content of <div id='frame'>.
 *      Renders the data from the argument into that div,
        including graphic for body map.
 *
 **/

function render_bodymap_color(frame_data, emotion) {
    // create button to pick which body part (for now) INCLUDE overall
    // have general layout set
    // have a place to get EMOTION

    // make a new empty div with id frame, not yet in the dom
    let frame = document.createElement('div');
    $(frame).attr('id', 'frame');


    let title = document.createElement('h2');
    $(title).text(frame_data.title);
    frame.appendChild(title);

    // create links to each emotion
    for (let curr of emotions) {
        let emotion_link = document.createElement('label');
        emotion_link.style.textDecoration = 'underline';
        $(emotion_link).attr('class', 'emotion_link');
        $(emotion_link).attr('id', curr);
        $(emotion_link).text(curr);
        emotion_link.onclick = function() {
        	render_bodymap_color(frame_data, curr, '')};

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

    render_left_col(frame, frame_data, emotion, '');
    render_right_col(frame, frame_data, emotion, '');

    frame.appendChild(frame.left);
    frame.appendChild(frame.right);

    let old_frame = $('#frame')[0];
    old_frame.replaceWith(frame);
}

function render_left_col(frame, frame_data, emotion, bodypart) {

	const bodymap = document.createElement('img');
    bodymap.setAttribute('src', 'bodymaps/' + emotion + '.png');
    bodymap.setAttribute('width', '120px');
    bodymap.style.left = '0px';
    bodymap.style.zIndex = '2';		// in front of bg_image
    bodymap.style.position = 'absolute';

    if (bodypart.length > 0) {		// clipping picture when specified body part
    	if (bodypart === bodyparts[0]) {			// head
   			bodymap.style.clipPath = 'circle(12% at 50% 6%)';
	    } else if (bodypart === bodyparts[1]) {		// neck
	    	bodymap.style.clipPath = 'polygon(25% 12%, 42% 15%, 58% 15%, 75% 12%, 75% 15%, 70% 16%, 60% 17%, 40% 17%, 30% 16%, 25% 15%)';
		} else if (bodypart === bodyparts[2]) {		// chest
	    	// bodymap.style.clipPath = 'inset(15% 22% 62% 22%)';	// rect shape
	    	bodymap.style.clipPath = 'ellipse(31% 12% at 50% 28%)';	// ellipse shape
		} else if (bodypart === bodyparts[3]) {		// arms
			bodymap.style.clipPath =
			'polygon(0% 0%, 0% 100%, 20% 100%, 22% 0, 80% 0, 79% 100%, 23% 100%, 23% 100%, 100% 100%, 100% 0%)';
		} else if (bodypart === bodyparts[4]) {		// belly
			// bodymap.style.clipPath =
			//'polygon(22% 37%, 80% 37%, 85% 45%, 80% 58%, 21% 58%, 18% 45%)';	// rect shape
			bodymap.style.clipPath = 'ellipse(33% 11% at 50% 48%)';	// ellipse shape
		} else {									// legs
			bodymap.style.clipPath = 'polygon(20% 56%, 50% 61%, 80% 56%, 70% 100%, 25% 100%)';	// V shape
			// bodymap.style.clipPath = 'inset(58% 20% 0% 20%)';	// rect shape
		}
    }
    frame.left.appendChild(bodymap);    

    const bg_image = document.createElement('img');
    bg_image.setAttribute('src', 'bodymaps/neutral.png');
    bg_image.setAttribute('width', '120px');
    bg_image.style.left = '0px';
    bg_image.style.position = 'absolute';
    bg_image.style.zIndex = '1';		// behind bodymap
    frame.left.appendChild(bg_image);

    const scale = document.createElement('img');
    scale.setAttribute('src', 'bodymaps/scale.png');
    scale.setAttribute('width', '140px');
    scale.style.position = 'absolute';
    scale.style.left = '140px';
    scale.style.top = '90px'
    frame.left.appendChild(scale);

}

function render_right_col(frame, frame_data, emotion, bodypart) {

	if (emotion === 'neutral') {
    	let header = document.createElement('h4');
    	$(header).text('Welcome! Please pick an emotion.');
    	frame.right.appendChild(header);
    } else if (bodypart.length === 0) {		// body part not selected
	    for (let bodypart of bodyparts) {
	    	let body_link = document.createElement('p');
	    	body_link.style.textDecoration = 'underline';
	    	body_link.style.color = 'blue';
	    	$(body_link).text(bodypart);
	    	body_link.onclick = function () {	// clicked on body part
	    		frame.left.innerHTML = '';
	    		frame.right.innerHTML = '';
	    		render_left_col(frame, frame_data, emotion, bodypart);
			    render_right_col(frame, frame_data, emotion, bodypart);
	    	}
	    	frame.right.appendChild(body_link);
	    }
    } else {	// body part is selected
		let question = document.createElement('h4');
		$(question).text(frame_data.question);
	    frame.right.appendChild(question);

	    for (let choice of qualifiers) {
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
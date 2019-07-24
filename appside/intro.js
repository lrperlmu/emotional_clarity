"use strict";

let headers = ['When to do this activity', 'How this activity works', 'Instructions'];
let content = ['Try this activity when you are experiencing a negative emotion and are not certain about which emotion it is.',
'Research shows that different people tend to have similar body feelings associated with the same emotion. By knowing your body feelings, I can suggest which emotions you might be feeling.',
'Think about how your body is currently feeling. In the left silhouette, color in the body parts where you are feeling increased activity. In the right silhouette, color in body parts where you are feeling decreased activity.']

$(document).ready(function() {
    main();
});

function main() {
    let sample_app = SAMPLE_APP;
    let frame = sample_app.intro[0];
    render_intro_frame(frame);
}

/**

 * Render a frame for the introduction.
 *
 * @param frame -- Object containing the frame's data. Expected fields:
 *      frame.title (string)
 *      frame.text (string) -- content of each page on introduction
 *      frame.graphic (string) -- URL link to graphic
 * Behavior undefined if frame doe snot have these properties.
 *
 * @require -- DOM must have a div whose ID is 'frame'
 *
 * @effects -- Does not preserve former content of <div id="frame">.
 *      Renders the data from the argument into that div.
 *
 **/
 function render_intro_frame(frame_data) {


    // make a new empty div with id frame, not yet in the dom
    let frame = document.createElement('div');
    $(frame).attr('id', 'frame');


    // insert a h2 node for the title
    let title = document.createElement('h2');
    $(title).text(frame_data.title);
    frame.appendChild(title);


    // insert a h5 node for the header1
    let header = document.createElement('h5');
    $(header).text(headers[0]);
    frame.appendChild(header);


    // insert a p node for the content of header1
    let content = document.createElement('p');
    $(content).text(frame_data.text);
    frame.appendChild(content);

    // insert graphic
    if (frame_data.graphic != '') {
        let graphic = document.createElement('img');
        $(graphic).setAttribute("src", frame_data.graphic);
        $(graphic).setAttribute("width", "304");
        $(graphic).setAttribute("height", "228");
        frame.appendChild(graphic);

    }

    let old_frame = $('#frame')[0];
    old_frame.replaceWith(frame);

 }

/**
// Title
let title = $( '#title')[0];
title.innerHTML = '';
title.appendChild(document.createTextNode(name));

// Accordion
for (let i = 0; i < headers.length; i++) {
        let header = document.createElement('h3');
        header.appendChild(document.createTextNode(headers[i]));
        acc.appendChild(header);

        // create dom elements for statements inside header
        let body = document.createElement('div');
        body.appendChild(document.createTextNode(content[i]));
        acc.appendChild(body);
    }

$( '#accordion' ).accordion({
	collapsible: true,
});

*/

function start() {	// filler method for now
	$( '#text' )[0].innerHTML = 'Start button clicked';
}

function exit() {	// filler method for now
	$( '#text' )[0].innerHTML = 'Exit button clicked';
}

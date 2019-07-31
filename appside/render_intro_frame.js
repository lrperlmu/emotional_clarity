'use strict';
// let headers = ['When to do this activity', 'How this activity works', 'Instructions'];

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
 
 * @effects -- Does not preserve former content of <div id='frame'>.
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
    $(header).text('When to do this activity');
    frame.appendChild(header);

    // insert a p node for the content of header1
    let content = document.createElement('p');
    $(content).text(frame_data.text);
    frame.appendChild(content);

    // insert graphic
    if (frame_data.graphic.length > 0) {
        var graphic = document.createElement('img');
        graphic.setAttribute('src', frame_data.graphic);
        graphic.setAttribute('height', '228');
        frame.appendChild(graphic);
    }
    
    let old_frame = $('#frame')[0];
    old_frame.replaceWith(frame);

 }
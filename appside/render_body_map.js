'use strict';

$(document).ready(function() {
    main();
});

function main() {
    let sample_app = SAMPLE_APP;
    let frame = sample_app.body[1]; // template: bodymap_statements

    render_bodymap_frame(frame);
}

/**

 * Render a frame for the body maps template.
 *
 * @param frame -- Object containing the frame's data. Expected fields:
 *      frame.title (string)
 *      frame.graphic (string) -- link of URL to body map outline (png)
 *      frame.question (string) -- text before checkboxes
 *      frame.statements (list of string) -- checkbox statements
 * Behavior undefined if frame doe snot have these properties.
 *
 * @require -- DOM must have a div whose ID is 'frame'
 *
 * @effects -- Does not preserve former content of <div id='frame'>.
 *      Renders the data from the argument into that div,
        including graphic for body map.
 *
 **/

function render_bodymap_frame(frame_data) {

    // make a new empty div with id frame, not yet in the dom
    let frame = document.createElement('div');
    $(frame).attr('id', 'frame');

    let title = document.createElement('h2');
    $(title).text(frame_data.title);
    frame.appendChild(title);

    let left = document.createElement('div');
    left.style.backgroundColor = 'lightpink';
    left.style.width = '150px';
    left.style.left = '0px';
    left.style.height = '100%';
    left.style.position = 'absolute';

    let right = document.createElement('div');
    right.style.backgroundColor = 'lightblue';
    right.style.left = '150px';
    right.style.height = '100%';
    right.style.position = 'absolute';

    // body maps graphic column
    const graphic = document.createElement('img');
    graphic.setAttribute('src', frame_data.graphic);
    graphic.setAttribute('width', '150px');
    left.appendChild(graphic);

    // statement column
    $(right).attr('text-align', 'left');

    let question = document.createElement('h4');
    $(question).text(frame_data.question);
    right.appendChild(question);

    // checkboxes
    let i = 0;
    for (let stmt of frame_data.statements) {
        let name = 'label' + i;
        i++;

        let check = document.createElement('input');
        $(check).attr('type', 'checkbox');
        $(check).attr('id', name);
        right.appendChild(check);

        let label = document.createElement('label');
        $(label).attr('for', name);
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
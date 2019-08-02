'use strict';
let emotions = ['anger', 'disgust', 'envy', 'fear', 'happiness', 'love', 'sadness', 'shame'];


$(document).ready(function() {
    main();
});

function main() {
    let sample_app = SAMPLE_APP;
    let frame = sample_app.body[2]; // template: bodymap_statements

    let end = $('#end');

        for (let emotion of emotions) {
            // create a link for that emotion
            let emotion_link = $('<a>', {
                'href': '#' + emotion,
                'class': 'emotion_link',
                'text': emotion,
                'click': function() {
                    render_bodymap_color(frame, emotion);
                },
            });

            end.append(emotion_link);
            end.append(document.createTextNode('\xa0\xa0\xa0'));
        }

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

    let left = document.createElement('div');
    left.style.backgroundColor = 'lightblue';
    left.style.width = '300px';
    left.style.left = '0px';
    left.style.height = '100%';
    left.style.position = 'absolute';

    let right = document.createElement('div');
    right.style.backgroundColor = 'lightblue';
    right.style.left = '300px';
    right.style.height = '100%';
    right.style.position = 'absolute';

    const bodymap = document.createElement('img');
    bodymap.setAttribute('src', 'bodymaps/' + emotion + '.png');
    bodymap.setAttribute('width', '120px');
    left.appendChild(bodymap);

    const scale = document.createElement('img');
    scale.setAttribute('src', 'bodymaps/scaleL.png');
    scale.setAttribute('width', '140px');
    scale.style.left = '150px';
    left.appendChild(scale);

    let question = document.createElement('h4');
    $(question).text(frame_data.question);
    right.appendChild(question);

    let rate = document.createElement('input');
    $(rate).attr('type', 'range');
    $(rate).attr('min', '1');
    $(rate).attr('max', '100');
    $(rate).attr('value', '50');
    rate.style.width = '250px';

    rate.oninput = function() {
        if (rate.value > 66) {
            text.innerHTML = "Very much";
        } else if (rate.value < 33) {
            text.innerHTML = "Not so much";
        } else {
            text.innerHTML = "Neutral";
        }
    }

    let text = document.createElement('p');
    $(text).text("Neutral");

    right.appendChild(rate);
    right.appendChild(text);
    right.append(document.createElement('br'));
    right.append(document.createElement('br'));


    let checkbox = document.createElement('input');
    $(checkbox).attr('type', 'checkbox');
    $(checkbox).attr('id', 'idk');
    right.appendChild(checkbox);

    let label = document.createElement('label');
    $(label).attr('for', 'idk');
    $(label).text('I don\'t know');
    right.appendChild(label);

    frame.appendChild(left);
    frame.appendChild(right);

    let old_frame = $('#frame')[0];
    old_frame.replaceWith(frame);
}

function bodypart(body_part) {

}
/*

Using: https://www.image-map.net/

Head:
    <area target="" alt="" title="" href="" coords="137,95,152,67,150,32,133,7,126,6,107,6,100,10,89,25,85,33,83,61,87,71,97,94" shape="poly">

Neck:
    <area target="" alt="" title="" href="" coords="161,115,139,100,137,94,97,93,99,101,76,115" shape="poly">

Chest:
    <area target="" alt="" title="" href="" coords="167,237,172,215,171,119,158,115,75,113,63,120,63,215,67,236" shape="poly">

Arms:
    <area target="" alt="" title="" href="" coords="65,119,50,130,42,148,39,163,36,203,25,252,26,286,29,301,31,311,30,344,27,357,35,370,42,376,58,373,60,365,58,356,58,341,52,324,52,305,56,284,57,264,56,242,64,216" shape="poly">
    <area target="" alt="" title="" href="" coords="173,365,178,359,177,342,183,326,179,281,179,265,179,242,170,215,170,118,184,128,193,148,197,174,199,204,210,250,208,287,208,297,203,310,205,342,208,350,207,358,196,373,189,375,179,373" shape="poly">

Belly:
    <area target="" alt="" title="" href="" coords="68,234,167,235,172,288,173,307,173,324,172,363,61,364,61,326,63,290" shape="poly">

Legs:
    <area target="" alt="" title="" href="" coords="62,364,173,364,165,412,162,427,161,442,158,478,160,490,159,512,158,532,151,551,147,570,143,593,146,602,145,613,154,630,149,640,127,641,118,633,109,642,86,640,80,632,89,612,89,603,92,592,83,548,76,530,76,492,76,478,74,422,69,409" shape="poly">

*/
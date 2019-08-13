'use strict';

$(document).ready(function() {
    main();
});

function main() {
    render_bodymap_color_forward();
}

/**
 *
 * Render a frame for the body map color template.
 *
 * @require -- DOM must have a div whose ID is 'frame'
 *
 * @effects -- Does not preserve former content of <div id='frame'>.
 *      Renders two graphics that allow users to draw.
 *
 **/

function render_bodymap_color_forward() {

    let frame = document.createElement('div');
    $(frame).attr('id', 'frame');

    let title = document.createElement('h2');
    $(title).text('Body Map Color -- Forward (scroll to bottom)');
    frame.appendChild(title);

    frame.left = document.createElement('div');
    frame.left.style.width = '300px';
    frame.left.style.left = '0px';
    frame.left.style.height = '100%';
    frame.left.style.position = 'absolute';

    frame.right = document.createElement('div');
    frame.right.style.width = '300px';
    frame.right.style.left = '300px';
    frame.right.style.height = '100%';
    frame.right.style.position = 'absolute';

    let textL = document.createElement('h4');
    $(textL).text('Draw on this body where bodily sensations are increased.');
    frame.left.appendChild(textL);

    let textR = document.createElement('h4');
    $(textR).text('Draw on this body where bodily sensations are decreased.');
    frame.right.appendChild(textR);

    // graphic for increasing
    const img_inc = document.createElement('img');
    img_inc.src = 'bodymaps/neutral.png';
    img_inc.style.width = '175px';
    img_inc.style.height = '597px';
    img_inc.style.top = '70px';
    img_inc.style.left = '40px';
    img_inc.style.position = 'absolute';
    img_inc.style.zIndex = '1';     // behind canvas

    // graphic for decreasing
    const img_dec = document.createElement('img');
    img_dec.src = 'bodymaps/neutral.png';
    img_dec.style.width = '175px';
    img_dec.style.height = '597px';
    img_dec.style.top = '70px';
    img_dec.style.left = '40px';
    img_dec.style.position = 'absolute';
    img_dec.style.zIndex = '1';     // behind canvas

    // canvas board for increasing
    var draw_inc = document.createElement('canvas');
    draw_inc.style.width = img_inc.style.width;
    draw_inc.style.height = img_inc.style.height;
    draw_inc.style.top = '70px';
    draw_inc.style.left = '40px';
    draw_inc.style.position = 'absolute';
    draw_inc.style.zIndex = '2';
    draw_inc.setAttribute('id', 'canvasI');
    var contextI = draw_inc.getContext('2d');

    // canvas board for decreasing
    var draw_dec = document.createElement('canvas');
    draw_dec.style.width = img_dec.style.width;
    draw_dec.style.height = img_dec.style.height;
    draw_dec.style.top = '70px';
    draw_dec.style.left = '40px';
    draw_dec.style.position = 'absolute';
    draw_dec.style.zIndex = '2';
    draw_dec.setAttribute('id', 'canvasD');
    var contextD = draw_dec.getContext('2d');
    
    // when drawing event listener
    draw_inc.onclick = function (e) {
        draw(img_inc, (e.clientX - 40) * 1.7, (e.clientY - 70) / 4, contextI, 'red');
    }
    draw_dec.onclick = function (e) {
        draw(img_dec, (e.clientX - 340) * 1.7, (e.clientY - 70) / 4, contextD, 'blue');
    }
    frame.left.appendChild(img_inc);
    frame.left.appendChild(draw_inc);

    frame.right.appendChild(img_dec);
    frame.right.appendChild(draw_dec);

    frame.appendChild(frame.left);
    frame.appendChild(frame.right);

    let old_frame = $('#frame')[0];
    old_frame.replaceWith(frame);
}

/**
 * Draws circle over clicked area on canvas
 * 
 * @param img -- graphic must be 175x597
 * @param x -- integer of x coordinate of clicked point
 * @param y -- integer of y coordinate of clicked point
 * @param draw -- canvas.getContext; method draws on this
 * @param color -- canvas uses this String as the drawing color
 *
 * @require -- screen must be scrolled to bottom to yield correct results
 *
 * @effects -- draws circle at specified area on specified canvas
**/

function draw(img, x, y, draw, color) {
    draw.beginPath();
    draw.fillStyle = color;
    draw.ellipse(x, y, 13, 2, 0, 0, 2 * Math.PI);
    // used ellipse over circle to offset y
    draw.fill();
    console.log('x: ' + x + ', y: ' + y);
}




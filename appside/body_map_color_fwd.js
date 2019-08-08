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
	$(title).text('Body Map Color -- Forward');
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

    // drawing board for increasing
	var draw_inc = document.createElement('canvas');
    draw_inc.style.width = '100%';
    draw_inc.style.height = '100%';
    draw_inc.setAttribute('id', 'canvasI');
    var contextI = draw_inc.getContext('2d');
    frame.left.appendChild(draw_inc);

    // drawing board for decreasing
    var draw_dec = document.createElement('canvas');
    draw_dec.style.width = '100%';
    draw_dec.style.height = '100%';
    draw_dec.setAttribute('id', 'canvasD');
    var contextD = draw_dec.getContext('2d');
    frame.right.appendChild(draw_dec);

    // graphic for increasing
    const img_inc = document.createElement('img');
    img_inc.setAttribute('src', 'bodymaps/neutral.png');
    img_inc.setAttribute('width', '175px');
    img_inc.style.top = '50px';
    img_inc.style.left = '40px';
    img_inc.style.zIndex = '0';		// behind drawing
    img_inc.style.position = 'absolute';
    img_inc.onclick = function(e) {
    	draw(e.clientX, (e.clientY - 140) / 4.2, contextI, 'red');
    }
    frame.left.appendChild(img_inc);

    // graphic for decreasing
    const img_dec = document.createElement('img');
    img_dec.setAttribute('src', 'bodymaps/neutral.png');
    img_dec.setAttribute('width', '175px');
    img_dec.style.left = '40px';
    img_dec.style.top = '50px';
    img_dec.style.zIndex = '0';		// behind drawing
    img_dec.style.position = 'absolute';
    img_dec.onclick = function (e) {
    	draw(e.clientX - 300, (e.clientY - 140) / 4.2, contextD, 'blue');
    }
    frame.right.appendChild(img_dec);

    frame.appendChild(frame.left);
    frame.appendChild(frame.right);

    let old_frame = $('#frame')[0];
    old_frame.replaceWith(frame);
}


function draw(x, y, draw, color) {
	draw.beginPath();
	draw.fillStyle = color;
	draw.rect(x, y, 10, 2);
	draw.fill();
	console.log('x: ' + x + ', y: ' + y);
}




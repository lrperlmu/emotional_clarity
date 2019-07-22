let name = 'Prototype 1';
let headers = ['When to do this activity', 'How this activity works', 'Instructions'];
let content = ['Try this activity when you are experiencing a negative emotion and are not certain about which emotion it is.',
'Research shows that different people tend to have similar body feelings associated with the same emotion. By knowing your body feelings, I can suggest which emotions you might be feeling.',
'Think about how your body is currently feeling. In the left silhouette, color in the body parts where you are feeling increased activity. In the right silhouette, color in body parts where you are feeling decreased activity.']
let acc = $( '#accordion' )[0];
acc.innerHTML = '';

//Title
let title = $( '#title')[0];
title.innerHTML = '';
title.appendChild(document.createTextNode(name));

//Accordion
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

function start() {
	$( '#text' )[0].innerHTML = 'Start button clicked';
}

function exit() {
	$( '#text' )[0].innerHTML = 'Exit button clicked';
}
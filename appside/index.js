"use strict";


let data = KNOWLEDGEBASE_DATA;
console.log(data);

let emotions = ['Anger', 'Disgust', 'Envy', 'Fear', 'Guilt', 'Jealousy', 'Sadness', 'Shame']
let selected_emotion = 'Anger';

$(document).ready( function() {
    // bread crumbs link to other emotions
    let crumbs = $('#crumbs')[0];

    for (let emotion of emotions) {
        // create a link for that emotion
        let emotion_link = document.createElement('a');
        $(emotion_link).attr('href', '#' + emotion);
        emotion_link.appendChild(document.createTextNode(emotion));
        $(emotion_link).attr('class', 'emotion_link');

        // when selected
        emotion_link.addEventListener('click', function() { 
            click_emotion(emotion);
        });

        crumbs.appendChild(emotion_link);
        crumbs.appendChild(document.createTextNode('\xa0\xa0\xa0'));
    }

    click_emotion(selected_emotion);
});

function click_emotion(selected_emotion) {

    // un-bold all the others, and make this one bold
    $('.emotion_link').css('font-weight', 'normal');
    $('a[href^="#' + selected_emotion + '"]').css('font-weight', 'bold');

    let emotion_data = [];
    for (let item of data) {
        if (item.Emotion === selected_emotion) {
            emotion_data.push(item);
        }
    }

    let title = $('#title')[0];
    title.innerHTML = '';
    title.appendChild(document.createTextNode(selected_emotion));

    // get the category names
    let categories = [];
    for (let item of emotion_data) {
        let item_cat = item.Category;
        if (!categories.includes(item_cat)) {
            categories.push(item_cat);
        }
    }

    // create the accordion dom element
    let acc = $('#stmt-accordion')[0];
    let new_acc = document.createElement('div');
    $(new_acc).attr('id', 'stmt-accordion');
    acc.replaceWith(new_acc);
    acc = new_acc;

    // clear existing elements
    acc.innerHTML = '';

    // create dom elements for the headers and statements
    for (let cat of categories) {
        let cat_header = document.createElement('h3');
        cat_header.appendChild(document.createTextNode(cat));
        acc.appendChild(cat_header);

        // create dom elements (unordered list) for the statements in this header
        let cat_body = document.createElement('div');
        acc.appendChild(cat_body);
        let cat_list = document.createElement('ul');
        cat_body.appendChild(cat_list);
        $(cat_body).attr('class', 'cat_body');
        
        // populate with statements
        for (let item of emotion_data) {
            if (item.Category === cat) {
                let statement = document.createElement('li');
                statement.appendChild(document.createTextNode(item.Statement));
                cat_list.appendChild(statement);
            }
        }
    }

    $('#stmt-accordion').accordion();

}





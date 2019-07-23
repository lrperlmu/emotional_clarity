"use strict";

let data = KNOWLEDGEBASE_DATA;
let emotions = ['Anger', 'Disgust', 'Envy', 'Fear', 'Guilt', 'Jealousy', 'Sadness', 'Shame'];
let selected_emotion = 'Anger';
let sample_app = SAMPLE_APP;

$(document).ready( function() {

    test_sample_app();

    // bread crumbs link to other emotions
    let $emotion_links = $('#emotion-links');

    for (let emotion of emotions) {
        // create a link for that emotion
        let emotion_link = $('<a>', {
            'href': '#' + emotion,
            'class': 'emotion_link',
            'text': emotion,
            'click': function() {
                click_emotion(emotion);
            },
        });

        $emotion_links.append(emotion_link);
        $emotion_links.append(document.createTextNode('\xa0\xa0\xa0'));
    }

    // see if an emotion was selected in the anchor, otherwise use default
    let $anchor = $(location).attr('hash');
    console.log('anchor "' + $anchor + '"');
    if ($anchor.length > 0) {
        let anchor_text = $anchor.substring(1, $anchor.length);
        if (emotions.includes(anchor_text)) {
            selected_emotion = anchor_text;
        }
    }
    click_emotion(selected_emotion);
});

function test_sample_app() {
    console.log(SAMPLE_APP);
}

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

    let $title = $('#title')[0];
    $title.innerHTML = '';
    $title.appendChild(document.createTextNode(selected_emotion));

    // get the category names
    let categories = [];
    for (let item of emotion_data) {
        let item_cat = item.Category;
        if (!categories.includes(item_cat)) {
            categories.push(item_cat);
        }
    }

    // create the accordion dom element
    let acc = document.createElement('div');
    $(acc).attr('id', 'stmt-accordion');

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
    let old_acc = $('#stmt-accordion')[0];
    old_acc.replaceWith(acc);

    $('#stmt-accordion').accordion();

}


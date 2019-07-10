"use strict";

let data = KNOWLEDGEBASE_DATA;
console.log(data);

// display the anger data sheet
// first, filter data to get only anger bullets

let anger_data = [];
for (let item of data) {
    if (item.Emotion === 'Anger') {
        anger_data.push(item);
    }
}

console.log(anger_data);

// get the category names
let categories = [];
for (let item of anger_data) {
    let item_cat = item.Category;
    if (!categories.includes(item_cat)) {
        categories.push(item_cat);
    }
}

let acc = document.createElement('div');
let acc_id = document.createAttribute('id');
acc_id.value = 'stmt-accordion';
acc.setAttributeNode(acc_id);
document.body.appendChild(acc);

// create dom elements for the headers
for (let cat of categories) {
    let cat_header = document.createElement('h3');
    cat_header.appendChild(document.createTextNode(cat));
    acc.appendChild(cat_header);

    // create dom elements (unordered list) for the statements in this header
    let cat_body = document.createElement('div');
    acc.appendChild(cat_body);
    let cat_list = document.createElement('ul');
    cat_body.appendChild(cat_list);
    let cat_body_class = document.createAttribute('class');
    cat_body_class.value = 'cat_body';
    cat_body.setAttributeNode(cat_body_class);
    
    
    for (let item of anger_data) {
        if (item.Category === cat) {
            let statement = document.createElement('li');
            statement.appendChild(document.createTextNode(item.Statement));
            cat_list.appendChild(statement);
        }
    }

}


$('#stmt-accordion').accordion();

// create an accordion for the dom elements we've just created

// Display it in the dom with headers for categories and list items under them for statements







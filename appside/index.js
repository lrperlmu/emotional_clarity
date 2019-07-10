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

// Display it in the dom with headers for categories and list items under them for statements






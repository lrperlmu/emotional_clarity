"use strict";

/**
 * user_data.js
 * @author Leah Perlmutter
 */

/**
 * Consistent way to store user input across the entire application.
 * Each instance represents one question and the user's response.
 * Each instance has fields:
 *    question - text of the question (mandatory)
 *    response - user's response or default value (mandatory)
 *    emotion - emotion associated with this question (optional)
 *    name - a string that enables disambiguation if the same question is asked twice.
 *        Allows all UserData objects to be stored in the same collection and the 
 *        application can still know which question is asked when.
 * All fields are immutable except response.
 * (i.e. client should never change them after construction)
 * 
 */
class UserData {
    /**
     * Construct a new UserData object
     * @param question (string) - text of the question
     * @param response (string) - user's response
     * @param emotion (array of string) - emotions associated with this question
     * @param name (string) - to disambiguate if same question is asked twice
     */
    constructor(question, response, emotions, name) {
        this.question = question;
        this.response = response;
        this.emotions = emotions;
        this.name = name;
    }

    /**
     * Set response to the given value
     * @param response (string)
     */
    update_response(response) {
        this.response = response;
    }
}

// desired properties:
// quick lookup by question

class UserDataSet {
    constructor() {
        this.data = [];
    }

    /**
     * Add a new item to the data set
     * @param item - a UserData
     */
    add(item) {
        this.data.push(item);
    }

    /**
     * Lookup item by question and name
     * @param question (string)
     * @param name (string)
     */
    // TODO: check whether the inefficiency of this causes noticeable slowdowns
    // if so, change underlying implementation to something more indexed.
    lookup(question, name) {
        for(let item of this.data) {
            if(item.question === question && item.name === name) {
                return item;
            } 
        }
        console.error('failed lookup', question, name);
    }

    to_array() {
        let arr = [];
        for(let item of this.data) {
            let value = {};
            value.emotions = item.emotions;
            value.response = item.response;
            value.name = item.name;
            let entry = [item.question, value];
            arr.push(entry);
        }
        return arr;
    }

    [Symbol.iterator]() {
        return this.data.values();
    }
}

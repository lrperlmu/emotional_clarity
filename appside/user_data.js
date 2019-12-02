"use strict";

/**
 * user_data.js
 * @author Leah Perlmutter
 */

/**
 * UserData class stores responses from the user for specific questions
 * Always stores question and answer. May store name and/or emotion, depending on
 *   use case.
 */
class UserData {

    /**
     * Construct UserData object from question and response
     * @param question - a string
     * @param response - a string
     */
    constructor(question, response) {
        this.question = question;
        this.reponse = response;
    }

    /**
     * Set name of this.
     * 
     * Name is intended to indicate the question set that this UserData corresponds to.
     * For example, pre-app-selfreport
     * 
     * @param name - string
     */
    set_name(name) {
        this.name = name;
        return this;
    }

    /**
     * Set emotion of this
     * @param emotion - string
     */
    set_emotion(emotion) {
        this.emotion = emotion;
        return this;
    }

}




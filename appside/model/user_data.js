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
 * (i.e. client should never change them after construction),
 * 
 */
class UserData {
    /**
     * Construct a new UserData object
     * @param question (string) - text of the question
     * @param response (string) - user's response
     * @param emotion (string) - emotion associated with this question
     * @param name (string) - to disambiguate if same question is asked twice
     */
    constructor(question, response, emotion, name) {
        this.question = question;
        this.emotion = emotion;
        this.response = response;
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

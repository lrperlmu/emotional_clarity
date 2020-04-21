"use strict";

/**
 * For logging data to firebase
 */
class Logger {
    /**
     * Initialize the logger and open a connection to the cloud database
     * 
     * @requires - no other logger has been constructed (singleton)
     */
    constructor() {
        // Unique but non-secret identifiers.
        // For more info and to configure security, see:
        //     https://firebase.google.com/docs/web/setup
        //     https://firebase.google.com/docs/projects/learn-more
        //     https://firebase.google.com/docs/database/security/quickstart
        var firebaseConfig = {
            apiKey: "AIzaSyBJB60vHefTp2wAH749dLLWFEW7vM3MtPE",
            authDomain: "emotional-clarity.firebaseapp.com",
            databaseURL: "https://emotional-clarity.firebaseio.com",
            projectId: "emotional-clarity",
            storageBucket: "emotional-clarity.appspot.com",
            messagingSenderId: "650523646400",
            appId: "1:650523646400:web:829a780d6fcc9351"
        };

        // Initialize Firebase
        try {
            let init = firebase.initializeApp(firebaseConfig);
        } catch (err) {
            console.error('Cannot initialize logger: firebase connection failed');
            throw err;
        }

        this.signIn = new Promise(function(resolve, reject) {
            reject(new Error('Not signed in'));
        });
        this.signIn.catch(error => {});
    }

    /**
     * Sign in using the given email address, if the current url is a valid
     *     email sign-in link and the given email address matches it.
     *
     * @effects - might sign in to firebase
     * @modifies - this.signIn by setting it to a new promise
     * @return promise that resolves when signed in, rejects when sign-in fails
     */
    signInUser(email) {
        let auth = firebase.auth();
        this.signIn = auth.signInWithEmailLink(email, window.location.href);

        this.signIn.catch(error => {
            console.log('failed sign in', error);
        });

        return this.signIn;
    }

    /**
     * Sign in anonymously.
     *
     * @effects - sign in to firebase
     * @modifies - this.signIn by setting it to a new promise
     * @return promise that resolves when signed in, rejects when sign-in fails
     */
    signInAnonymously() {
        this.signIn = firebase.auth().signInAnonymously();
        return this.signIn;
    }

    /**
     * Stores responses into the database. Overwrites any values previously logged
     * using this method in the current session. Keys and values of the input map will
     * be cleaned of illegal characters and stored as strings.
     *
     * Data is stored in app-responses subtree, under current uid
     *
     * @param uds (UserDataSet) - the data to write into firebase
     */
    logUds(uds) {
        // this should only happen if the user hacked sign-in validation
        this.signIn.catch(error => {
            alert(LOGGER_NOT_SIGNED_IN);
        });
        this.signIn.then(credential => {
            for(let ud of uds) {
                // clean the strings.
                let name = this.encodeString(ud.name);
                let question = this.encodeString(ud.question);
                let response = this.encodeString(ud.response.toString());

                // pack them into an object as required by firebase
                let update_data = {};
                update_data[question] = response;

                // store them one by one so as not to overwrite existing content.
                firebase.database()
                    .ref(`app-responses/${credential.user.uid}/${name}`)
                    .update(update_data);
            }
        });
    }

    /**
     * Log a timestamp to the database. Overwrites any timestamp previously logged
     * in the current session with the current name.
     * 
     * Data is stored in events subtree, under current uid, as {event_name: timestamp}
     *
     * @param event_name - string saying the name of the event
     */
    logTimestamp(event_name) {
        this.signIn.then(credential => {
            let ref = firebase.database().ref(`events/${credential.user.uid}`);
            let data = {};
            data[event_name] = '' + new Date();
            ref.update(data);
        });
    }

    /**
     * Log the given user's competion code. Overwrites the last one logged for this user.
     * 
     * Data is stored in completion_codes subtree, as {uid: completion_code}
     *
     * @param code - the code to log
     */
    logCompletionCode(code) {
        this.signIn.then(credential => {
            let ref = firebase.database().ref(`completion_codes`);
            let data = {};
            data[credential.user.uid] = code;
            ref.update(data);
        });
    }

    /**
     * Generate a new participant id
     *
     * @param handle_outcome - function(error, written, data_snapshot)
     *        that will be passed in to transaction as the onComplete callback
     *        (see firebase transaction docs)
     * @return promise that will reject with an error or
     *  resolve with a transaction result `tr` with these properties:
     *      tr.committed - boolean true if committed, false otherwise
     *      tr.snapshot - data snapshot at end of transaction
     *   (note: ^ this return value is not well documented in the firebase docs
     *    I've inferred these properties experimentally)
     */
    incrementPid() {
        let increment_counter = count => {
            // increment or initialize the count, and re-store
            let ret = (count || 0) + 1;
            return ret;
        };

        let transaction = credential => {
            return firebase.database().ref('pid/counter').transaction(
                increment_counter,
            );
        };

        return this.signIn.then(transaction);
    }

    // return promise that contains the data snapshot
    // Using this with incrementPid is subject to race conditions.
    // Instead, use the snapshot in the return value from incrementPid
    getPid() {
        let promise = firebase.database().ref('pid/counter').once('value');
        return promise;
    }

    /**
     * Record the current user's user id and pid
     * Data is stored in pid subtree, as {uid: pid}
     * @param pid - participant id to record
     */
    logUserPid(pid) {
        this.signIn.then(credential => {
            let ref = firebase.database().ref('pid');
            let data = {};
            data[credential.user.uid] = pid;
            ref.update(data);
        });
    }

    /**
     * Transform a string so it's suitable for storing in firebase
     * @param str (string)
     */
    encodeString(str) {
        // replace each illegal char with its URI encoding
        // '%' is also replaced since it's the escape character for the encodings
        return str.replace(/\%/g, '%25')
            .replace(/\./g, '%2E')
            .replace(/\$/g, '%24')
            .replace(/\[/g, '%5B')
            .replace(/\]/g, '%5D')
            .replace(/\#/g, '%23')
            .replace(/\//g, '%2F');
    }
}

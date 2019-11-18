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

        let auth = firebase.auth();
        // returns a Promise that will store the user credentials when resolved
        this.signIn = auth.signInAnonymously();
    }

    /**
     * Log a timestamp to the database. Overwrites any timestamp previously logged
     * in the current session with the current name.
     * 
     * @param event_name - string saying the name of the event
     */
    // in the events subtree, under the current uid, log {event_name: timestamp}
    logTimestamp(event_name) {
        this.signIn.then(credential => {
            let ref = firebase.database().ref(`events/${credential.user.uid}`);
            let data = {};
            data[event_name] = '' + new Date();
            ref.update(data);
        });
    }
}



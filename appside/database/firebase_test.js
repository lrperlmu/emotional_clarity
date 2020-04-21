"use strict";

// Sandbox for making the firebase code work.
$(document).ready(function() {

    initialize();
    sendSignInEmail();

});


// send sign in email
function sendSignInEmail() {

    // If using localhost, make sure there is a local server running
    // Can do this with `$ python -m SimpleHTTPServer 1337`
    let actionCodeSettings = {
        url: 'http://localhost:1337/appside/demo.html',
        //url: 'https://lrperlmu.github.io/emotional_clarity/appside/demo.html',
        handleCodeInApp: true,
    }

    let auth = firebase.auth();
    let promise = auth.sendSignInLinkToEmail('leahp62@gmail.com', actionCodeSettings);

    promise.catch(err => {console.log(err)});
    promise.then(nothing => {console.log('complete')});
}


function sign_in() {
    let auth = firebase.auth();
    let signIn = auth.signInWithEmailAndPassword('leahp62@gmail.com', '123456');

    signIn.catch(err => {console.log(err)});
    signIn.then(credential => {console.log('uid', credential.user.uid)});
}


// this sends a generic email
//    can customize email template in firebase console
// clicking the link in the email leads to a very minimal web page
//    with a text box for the new password
function reset_pw() {
    let auth = firebase.auth();
    let promise = auth.sendPasswordResetEmail('leahp62@gmail.com');

    promise.catch(err => {console.log(err)});
    promise.then(nothing => {console.log('complete')});
}


function create_user() {
    // create account with email and pw
    let auth = firebase.auth();
    let createUser = auth.createUserWithEmailAndPassword('leahp62@gmail.com', '123456');

    createUser.catch(err => {
        console.log(err);
    });

    createUser.then(credential => {
        console.log(credential);
    });
}


// open connection to the specified firebase instance
function initialize() {
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
        console.error('firebase connection failed');
        throw err;
    }
}


/**
 * Increment and read the pid value
 * Exmaple code of how to use it irl
 */
function test_atomic_new_pid() {
    let logger = new Logger();

    let pid_promise = logger.incrementPid();
    pid_promise.then(result => {
        console.log('written', result.committed);
        console.log('snapshot value', result.snapshot.val());
    });
    pid_promise.catch(error => {
        console.error('failed', error);
    });
}


/**
 * Read, increment atomically, then read again.
 * Example code of how NOT to use it irl.
 * Note: This usage is subject to RACE CONDITIONS, e.g.:
 *    client 1: increment
 *    client 2: increment
 *    client 1: read
 *    client 2: read
 * @throws error if difference between pre and post values is not 1
 */
function test_new_pid() {
    let logger = new Logger();

    let read_promise = logger.getPid();
    read_promise.then(snapshot => {
        console.log('read value', snapshot.val());
    });

    let pid_promise = read_promise
        .then(logger.incrementPid.bind(logger))
        .then(logger.getPid);
    pid_promise.then(snapshot => {
        console.log('incremented value', snapshot.val());
    });

    Promise.all([read_promise, pid_promise]).then(values => {
        let [old, cur] = values;
        let difference = cur.val() - old.val();
        if(difference !== 1) {
            // may throw due to race conditions
            throw Error('should increment by 1');
        }
    });
}

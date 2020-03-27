"use strict";

// Sandbox for making the firebase code work.
$(document).ready(function() {

    initialize();

    let actionCodeSettings = {
        url: 'https://lrperlmu.github.io/emotional_clarity/appside/demo.html',
        //'file:///home/leah/work/emotional_clarity/appside/demo.html',
        handleCodeInApp: true,
    }

    let auth = firebase.auth();
    let promise = auth.sendSignInLinkToEmail('leahp62@gmail.com', actionCodeSettings);

    promise.catch(err => {console.log(err)});
    promise.then(nothing => {console.log('complete')});

});

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

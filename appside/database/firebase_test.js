"use strict";

$(document).ready(function() {
    let logger = new Logger();
    logger.logTimestamp('logger1_my_event');

    let responses = {
        'hello': 'kitty',
        'fluffer': 'nuffin',
    }

    console.log(responses)
    
    // let map2 = new Map();
    // map2.set('foo', 'bar');
    // map2.set('buzz', 'lightyear');
    // console.log(map2);

    logger.logResponses(responses);

});


/**
== What to log ==
pre- and post- measure outcome
post-survey
final answers of DBT activity
start and end times
suggestion: Firebase w/anonymous login
**/

/**
== Data structure of Firebase data store ==
{
    events: {
        uid: {
            pre-measure-start: time,
            pre-selfreport-start: time,
            mood-induction-start: time,
            app-start: time,
            post-measure-start: time,
            post-survey-start: time,
            end: time,
        },
        ...
    }, // times

    measures: {
        uid: {
            pre-measure: { // momentary DERS
                question: answer,
                ...,
            },
            pre-selfreport { // what are your emotions and how certain?
                emotions: answer,
                certainty: number,
            }
            mood-induction { // response to the writing exercise
                brief: string,
                full: string,
            },
            post-measure: { // momentary DERS
                question: answer,
                ...,
            },
            post-selfreport {  // what are your emotions and how certain?
                emotions: answer,
                certainty: number,
            },
            post-survey { // how well did the app work
                question: answer,
                ...,
            },
        },
        ...,
    } // measures

    app_responses: {
        uid: { // responses to checkboxes
            question: boolean,
            ...,
        },
        ...,
    } // app_responses
}

**/


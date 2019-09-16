"use strict";

let knowledgebase = KNOWLEDGEBASE_DATA;

// TODO: file with all the model configs (one for each app)
// TODO: dispatcher that takes in a slug, chooses the right config,
//       and uses the config to determine what kind of model to instantiate

// TODO: capitalization of object property names and map keys (should be lowercase I think)
// TODO: check all for loops for correct use of "of" vs "in"
// TODO: decide which features should be in Model superclass
// TODO: consider making knowledgebase not a global variable?

// TODO: doc comments (class and method)

// TODO: move does-it-run test to a different file
$(document).ready(function() {

    let model = new DbtWorksheetModelFwd(knowledgebase, FWD_PROMPTING_CONFIG);

    // * has_next should be true
    // * has_prev should be false
    console.log('has_next', model.has_next_frame(), 'has_prev', model.has_prev_frame());

    // * intro frame should match format of sample_app
    let frame = model.get_frame('next');
    console.log('initial frame', frame);

    // * has_prev should be false
    console.log('has_prev', model.has_prev_frame());

    // * body frame should  match format of sample_app
    frame = model.next_frame();
    console.log('body frame', frame);

    // * has_prev should be true
    console.log('has_prev', model.has_prev_frame());

    // submit some answers to the model
    let user_input = new Map();
    for(let pair of frame.statements) {
        let stmt = pair[0];
        user_input.set(stmt, true);
    }
    model.update(user_input);

    // go through all the body frames
    // * body frames should match format of sample_app
    // * summary frame should match format of sample_app
    // * summary should reflect answers submitted to model
    // * has_next should be true except for last frame
    // * has_prev should be true for all
    let i = 1;
    while(frame.template === 'statements') {
        i += 1;
        frame = model.next_frame();
        console.log(`frame ${i}`, frame);
        console.log('has_next', model.has_next_frame(), 'has_prev', model.has_prev_frame());

        if(i == 4) {
            let user_input2 = new Map();
            for(let pair of frame.statements) {
                let stmt = pair[0];
                user_input2.set(stmt, true);
            }
            model.update(user_input2);
        }

        if(frame.title == SUMMARY_TITLE) {
            console.log('summary contains');
            for(let entry of frame.matched_emotions) {
                console.log(entry);
            }
        }
    }

    // go back and re-fill the initial frame
    // * should display previously input answers
    while(i > 1) {
        frame = model.back();
        i -= 1;
    }
    console.log('first body frame', frame);
    let user_input3 = new Map();
    for(let pair of frame.statements) {
        let stmt = pair[0];
        user_input3.set(stmt, false);
    }
    model.update(user_input3);

    // go forward to the summary again
    // * should be different from previous summary
    while(frame.template === 'statements') {
        frame = model.next_frame();
    }
    console.log('updated summary', frame);
    console.log('summary contains');
    for(let entry of frame.matched_emotions) {
        console.log(entry);
    }
});

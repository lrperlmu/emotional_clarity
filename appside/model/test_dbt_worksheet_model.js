"use strict";

let knowledgebase = KNOWLEDGEBASE_DATA;

$(document).ready(function() {
    let test_methods = {
        'doesitrun' : does_it_run_test,
        'intro': visual_test_intro,
        'body': visual_test_body,
        'summary': visual_test_summary,
        'noerror': all_wkshts_noerror,
    }
    let page_types = Object.keys(test_methods);
    let page_to_show = page_types[0];

    // see if a frame type was written in the query string, otherwise use default
    let query_string = location.search;
    if (query_string.length > 0) {
        let query = query_string.substring(1, query_string.length);
        if (page_types.includes(query)) {
            page_to_show = query;
        }
    }

    let test_fcn = test_methods[page_to_show];
    test_fcn();
});


/*
 * Flip through all the frames of each config. Manually check to make sure there's no error
 */
function all_wkshts_noerror() {
    let configs = [
        FWD_PROMPTING_CONFIG,
        FWD_INTERP_CONFIG,
        FWD_BIO_CONFIG,
        FWD_ACT_CONFIG,
        FWD_AFTER_CONFIG,
    ];
    for(let config of configs) {
        console.log('section', config.section);
        wksht_noerror(config);
        console.log('ok\n\n');
    }
}

/*
 * Helper method for all_wkshts_noerror
 * @param config -- which config to run
 */
function wksht_noerror(config) {
    let model = new DbtWorksheetModelFwd(knowledgebase, config);
    let frame = model.get_frame('next');
    while(model.has_next_frame()) {
        model.get_frame('next');
    }
}


/*
 * Integration test that invokes IntroFrame to render the intro frame of this app.
 * Manually verified.
 */
function visual_test_intro() {
    let model = new DbtWorksheetModelFwd(knowledgebase, FWD_PROMPTING_CONFIG);
    let frame = model.get_frame('next');
    let view = new IntroFrame(frame);
    view.render();
}


/*
 * Integration test that invokes StatementsBodyFrame to render a body frame of this app.
 * Manually verified.
 */
function visual_test_body() {
    let model = new DbtWorksheetModelFwd(knowledgebase, FWD_PROMPTING_CONFIG);
    model.get_frame('next');
    let frame = model.get_frame('next');
    let view = new StatementsBodyFrame(frame);
    view.render();
}


/*
 * Integration test that invokes SuffaryFrameCount to render a summary frame generated
 * by this app.
 * Manually verified.
 */
function visual_test_summary() {
    let model = new DbtWorksheetModelFwd(knowledgebase, FWD_AFTER_CONFIG);
    let frame = model.get_frame('next');

    frame = model.get_frame('next');
    // submit some answers to the model
    let user_input = new Map();
    for(let pair of frame.statements) {
        let stmt = pair[0];
        user_input.set(stmt, true);
    }
    model.update(user_input);

    while(frame.template === 'statements') {
        frame = model.get_frame('next');
    }
    let view = new SummaryFrameCount(frame);
    view.render();
}


/*
 * A messy icky monolithic non-automated test where you have to read the output and
 * manually verify all of the comments marked with "*"
 * TODO: refactor into multiple tests that each test one thing and automatically
 *       verify it (if deemed worthwhile)
 */
function does_it_run_test() {

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
}

"use strict";

// Most of these tests are "manually verified"
// That means you have to either read the test output and verify that it looks right
//   OR click around in the app and verify that behavior is as intended.

// This testbench saves you from having to start the app at the beginning and
//   click all the way through to the part you want to test

let knowledgebase = KNOWLEDGEBASE_DATA;

$(document).ready(function() {
    let test_methods = {
        // automated -- throws an error if there is a problem
        'noerror': all_wkshts_noerror,

        // unit tests
        'shuffle': test_shuffle,
        'page_counts': test_compute_page_counts,

        // integ tests
        'intro': visual_test_intro,
        'self_report': visual_test_self_report,
        'pre_measurement': visual_test_pre_measurement,
        'body': visual_test_body,
        'post_measurement': visual_test_post_measurement,
        'end': visual_test_end,
        'end2': visual_test_end2,

        // integ tests with nav
        'consent': visual_test_consent_disclosure,
        'phq': visual_test_phq,
        'induction': visual_test_induction,
        'summary': visual_test_summary,
        'postq': postq,
    }
    let page_types = Object.keys(test_methods);
    let page_to_show = page_types[0];
    let variant = undefined;

    let query_string = new URLSearchParams(location.search);

    if(query_string.has('test')) {
        page_to_show = query_string.get('test');
    }
    // variant slug options: prompting, interp, bio, act, after, auto
    if(query_string.has('variant')) {
        let slug = query_string.get('variant');
        // slug 'auto' sets this to undefined, intentionally
        variant = VARIANT_LOOKUP.get(slug);

        let variant_names = Array.from(VARIANT_LOOKUP.keys());
        variant_names.push('auto');
        if(!variant_names.includes(slug)) {
            console.error('Valid variant names are: ' + variant_names);
            throw Error('Unknown variant requested: ' + variant);
        }
    }

    let test_names = Object.keys(test_methods);
    if(test_names.includes(page_to_show)) {
        let test_fcn = test_methods[page_to_show];
        test_fcn(variant);
    } else {
        console.error('Valid test names are: ' + test_names);
        throw Error('Unknown test requested: ' + page_to_show);
    }
});


/*
 * Manual check: Make sure that 6 different lists are output
 */
function test_shuffle() {
    for(let key of [0, 1, 2, 3, 4, 5]) {
        let src = [0, 1, 2];
        let out = DbtWorksheetModelFwd.shuffle3(key, src);
        console.log(out);
    }
}


/*
 * Check that it returns true
 */
function test_compute_page_counts() {
    let pass = true;
    for(let N=5; N<50; N++) {
        for(let p=2; p<14; p++) {
            let a, b, c, d, e;
            [a, b, c, d, e] = DbtWorksheetModelFwd.compute_page_counts(N, p);
            let ok = N === (d * b + e * c);
            console.log('' + N + '=' + d + '*' + b + '+' + e + '*' + c, ok);
            if(!ok) pass = false;
        }
    }
    console.log('pass', pass);
    return pass;
}


/*
 * Flip through all the frames of each config. Manually check console to make sure there's no error
 * @param variant - placeholder arg for consistency w/other tests. ignored
 */
function all_wkshts_noerror(variant) {
    let configs = [
        FWD_PROMPTING_CONFIG,
        FWD_INTERP_CONFIG,
        FWD_BIO_CONFIG,
        FWD_ACT_CONFIG,
        FWD_AFTER_CONFIG,
    ];
    let logger = new Logger();
    for(let config of configs) {
        console.log('section', config.section);
        wksht_noerror(config, logger);
        console.log('ok\n\n');
    }
}


/*
 * Helper method for all_wkshts_noerror
 * @param config -- which config to run
 * @param logger -- logger
 */
function wksht_noerror(config, logger) {
    let model = new DbtWorksheetModelFwd(knowledgebase, config, logger);
    model.initialize.then(() => {
        let frame = model.get_frame('next');
        while(model.has_next_frame()) {
            model.get_frame('next');
        }
    });
}


////////////////////  INTEGRATION TESTS  ////////////////////
// These tests build and run a model, using some automation to flip
// directly to the frame we want to test


/*
 * Integration test that constructs an EndFrame to render the end frame of this app.
 * This end frame is used when the participant completes the study.
 * Manually verified.
 * @param variant - the variant to test
 */
function visual_test_end(variant) {
    let config = new DbtWorksheetModelConfig(DIRECTION_FWD, variant);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, config, logger);
    model.initialize.then(() => {
        let frame = model.get_frame('next');
        while(frame.template !== END_FRAME_TEMPLATE) {
            frame = model.get_frame('next');
        }
        frame.render();
    });
}


/*
 * Integration test that constructs an EndFrame to render the end frame of this app.
 * This end frame is used when the participant fails phq and the app skips right to the end.
 * Manually verified.
 * @param variant - the variant to test
 */
function visual_test_end2(variant) {
    let config = new DbtWorksheetModelConfig(DIRECTION_FWD, variant);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, config, logger);
    model.initialize.then(() => {
        let frame = model.get_frame('next');
        while(frame.template !== END_FRAME_TEMPLATE) {
            frame = model.get_frame('next');
        }
        frame.set_passed_phq(false);
        frame.render();
    });
}


/*
 * Integration test that invokes IntroFrame to render the intro frame of this app.
 * Manually verified.
 * @param variant - the variant to test
 */
function visual_test_intro(variant) {
    let config = new DbtWorksheetModelConfig(DIRECTION_FWD, variant);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, config, logger);
    model.initialize.then(() => {
        let frame = model.get_frame('next');
        while(frame.template !== INTRO_FRAME_TEMPLATE) {
            frame = model.get_frame('next');
        }
        frame.render();
    });
}


/*
 * Integration test that invokes LikertFrame to render the pre measurement frame of this app.
 * Manually verified.
 */
function visual_test_pre_measurement() {
    FWD_PROMPTING_CONFIG.set_pre_post_measurement(true);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, FWD_PROMPTING_CONFIG, logger);
    model.initialize.then(() => {
        let frame = model.get_frame('next');
        while(frame.template !== LIKERT_FRAME_TEMPLATE
              && frame.response_name !== RESPONSE_PRE) {
            frame = model.get_frame('next');
        }
        frame.render();
    });
}


/*
 * Integration test that invokes LikertFrame to render the post measurement frame of this app.
 * Manually verified.
 */
function visual_test_post_measurement() {
    FWD_PROMPTING_CONFIG.set_pre_post_measurement(true);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, FWD_PROMPTING_CONFIG, logger);
    model.initialize.then(() => {
        let frame = model.get_frame('next');
        while(frame.template !== LIKERT_FRAME_TEMPLATE 
              && frame.response_name !== RESPONSE_POST) {
            frame = model.get_frame('next');
        }
        frame.render();
    });
}


/*
 * Integration test that invokes SelfReportFrame to render the self report frame of this app.
 * Manually verified.
 */
function visual_test_self_report() {
    FWD_PROMPTING_CONFIG.set_self_report(true);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, FWD_PROMPTING_CONFIG, logger);
    model.initialize.then(() => {
        let frame = model.get_frame('next');
        while(frame.template !== SELF_REPORT_FRAME_TEMPLATE) {
            frame = model.get_frame('next');
        }

        frame.render();
    });
}


////////////////////  INTEGRATION TESTS WITH NAV  ////////////////////
// These tests build and run a model, using some automation to flip
//   directly to the frame we want to test.
// Additionally, we use a nav object to render the frame, so navigation
//   actions (next, back) are available within the test.


/*
 * Integration test that invokes ConsentDisclosureFrame to render the consent disclosure frame of this app.
 * Manually verified.
 */
function visual_test_consent_disclosure(variant) {
    let config = new DbtWorksheetModelConfig(DIRECTION_FWD, variant);
    config.set_study(true);
    config.set_consent_disclosure(true);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, config, logger);
    model.initialize.then(() => {
        let frame = model.get_frame('next');
        while(frame.template !== CONSENT_FRAME_TEMPLATE) {
            frame = model.get_frame('next');
        }
        model.get_frame('back');
        let nav = new Nav(model, logger);
    });
}


/*
 * Integration test for phq screening
 * Manually verified.
 */
function visual_test_phq(variant) {
    let config = new DbtWorksheetModelConfig(DIRECTION_FWD, variant);
    config.set_consent_disclosure(true);
    config.set_study(true);
    config.set_feedback(true);
    config.set_mood_induction(true);
    config.set_self_report(true);
    config.set_pre_post_measurement(true);

    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, config, logger);
    model.initialize.then(() => {
        let frame = model.get_frame('next');
        while(frame.template !== PHQ_FRAME_TEMPLATE) {
            frame = model.get_frame('next');
        }
        model.get_frame('back');
        let nav = new Nav(model, logger);
    });
}


/*
 * Integration test that invokes StatementsBodyFrame to render a body frame of this app.
 * Manually verified.
 * @param variant - the variant to test
 */
function visual_test_body(variant) {
    let config = new DbtWorksheetModelConfig(DIRECTION_FWD, variant);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, config, logger);
    model.initialize.then(() => {
        let frame = model.get_frame('next');
        while(frame.template !== STATEMENTS_FRAME_TEMPLATE) {
            frame = model.get_frame('next');
        }
        model.get_frame('back');
        let nav = new Nav(model, logger);
    });
}


/*
 * Integration test that invokes SummaryFrameCount to render a summary frame generated
 * by this app.
 * Manually verified.
 * @param variant - the variant to test
 */
function visual_test_summary(variant) {
    let config = new DbtWorksheetModelConfig(DIRECTION_FWD, variant);
    config.set_self_report(true);
    config.set_pre_post_measurement(true);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, config, logger);
    model.initialize.then(() => {
        let frame = model.get_frame('next');

        while(frame.template !== 'statements') {
            frame = model.get_frame('next');
        }
        // submit some answers to the model
        let user_input = new Map();

        for(let pair of frame.items) {
            let stmt = pair[0];
            let value = {};
            value.response = true;
            value.name = frame.response_name;
            user_input.set(stmt, value);
        }
        model.update(user_input);

        while(frame.template === 'statements') {
            frame = model.get_frame('next');
        }

        model.get_frame('back');
        let nav = new Nav(model, logger);
    });
}


/*
 * Integration test to make sure the induction frame advances by itself.
 * Timeout set to 2 seconds for this test only.
 * Introduces a dependency on nav for this test module.
 * Manually verified.
 * @param variant - the variant to test
 */
function visual_test_induction(variant) {
    let config = new DbtWorksheetModelConfig(DIRECTION_FWD, variant);
    config.set_study(true);
    config.set_mood_induction(true);
    config.set_self_report(true);
    config.set_pre_post_measurement(true);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, config, logger);
    model.initialize.then(() => {

        let frame = model.get_frame('next');
        while(frame.template !== LONG_ANSWER_TEMPLATE) {
            frame = model.get_frame('next');
        }
        frame.time_limit = 2;
        model.back();

        // advance model frame, render nav and frame
        let nav = new Nav(model, logger);
    });
}


function postq(variant) {
    let config = new DbtWorksheetModelConfig(DIRECTION_FWD, variant);
    config.set_feedback(true);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, config, logger);
    model.initialize.then(() => {

        let frame = model.get_frame('next');
        while(frame.template !== FEEDBACK_FRAME_TEMPLATE) {
            frame = model.get_frame('next');
        }
        model.back();

        let nav = new Nav(model, logger);
    });
}

"use strict";

let knowledgebase = KNOWLEDGEBASE_DATA;

$(document).ready(function() {
    let test_methods = {
        'intro': visual_test_intro,
        'body': visual_test_body,
        'summary': visual_test_summary,
        'pre_measurement': visual_test_pre_measurement,
        'post_measurement': visual_test_post_measurement,
        'self_report': visual_test_self_report,
        'consent_disclosure': visual_test_consent_disclosure,
        'end': visual_test_end,
        'noerror': all_wkshts_noerror,

        'shuffle': test_shuffle,

        'induction': visual_test_induction,
        'postq': postq,
    }
    let page_types = Object.keys(test_methods);
    let page_to_show = page_types[0];
    let variant = SECTION_PROMPTING;

    let query_string = new URLSearchParams(location.search);

    if(query_string.has('test')) {
        page_to_show = query_string.get('test');
    }
    if(query_string.has('variant')) {
        let slug = query_string.get('variant');
        let variants = new Map([
            ['prompting', SECTION_PROMPTING],
            ['interp', SECTION_INTERP],
            ['bio', SECTION_BIO],
            ['act', SECTION_ACT],
            ['after', SECTION_AFTER],
        ]);
        variant = variants.get(slug);

        let variant_names = Array.from(variants.keys());
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
 * Integration test that constructs an EndFrame to render the end frame of this app.
 * Manually verified.
 * @param variant - the variant to test
 */
function visual_test_end(variant) {
    let config = new DbtWorksheetModelConfig(DIRECTION_FWD, variant);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, config, logger);
    let frame = model.get_frame('next');
    while(frame.template !== END_FRAME_TEMPLATE) {
        frame = model.get_frame('next');
    }
    frame.render();
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
    let frame = model.get_frame('next');
    while(frame.template !== INTRO_FRAME_TEMPLATE) {
        frame = model.get_frame('next');
    }
    frame.render();
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
    let frame = model.get_frame('next');
    while(frame.template !== STATEMENTS_FRAME_TEMPLATE) {
        frame = model.get_frame('next');
    }
    frame.render();
}


/*
 * Integration test that invokes SummaryFrameCount to render a summary frame generated
 * by this app.
 * Manually verified.
 * @param variant - the variant to test
 */
function visual_test_summary(variant) {
    let config = new DbtWorksheetModelConfig(DIRECTION_FWD, variant);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, FWD_AFTER_CONFIG, logger);
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
    frame.render();
}


/*
 * Integration test that invokes LikertFrame to render the pre measurement frame of this app.
 * Manually verified.
 */
function visual_test_pre_measurement() {
    FWD_PROMPTING_CONFIG.set_pre_post_measurement(true);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, FWD_PROMPTING_CONFIG, logger);
    let frame = model.get_frame('next');
    while(frame.template !== LIKERT_FRAME_TEMPLATE
          && frame.response_name !== RESPONSE_PRE) {
        frame = model.get_frame('next');
    }
    frame.render();
}


/*
 * Integration test that invokes LikertFrame to render the post measurement frame of this app.
 * Manually verified.
 */
function visual_test_post_measurement() {
    FWD_PROMPTING_CONFIG.set_pre_post_measurement(true);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, FWD_PROMPTING_CONFIG, logger);
    let frame = model.get_frame('next');
    while(frame.template !== LIKERT_FRAME_TEMPLATE 
          && frame.response_name !== RESPONSE_POST) {
        frame = model.get_frame('next');
    }
    frame.render();
}


/*
 * Integration test that invokes SelfReportFrame to render the self report frame of this app.
 * Manually verified.
 */
function visual_test_self_report() {
    FWD_PROMPTING_CONFIG.set_self_report(true);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, FWD_PROMPTING_CONFIG, logger);
    let frame = model.get_frame('next');
    while(frame.template !== SELF_REPORT_FRAME_TEMPLATE) {
        frame = model.get_frame('next');
    }

    frame.render();
}


/*
 * Integration test that invokes ConsentDisclosureFrame to render the consent disclosure frame of this app.
 * Manually verified.
 */
function visual_test_consent_disclosure() {
    FWD_PROMPTING_CONFIG.set_consent_disclosure(true);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, FWD_PROMPTING_CONFIG, logger);
    let frame = model.get_frame('next');
    while(frame.template !== CONSENT_FRAME_TEMPLATE) {
        frame = model.get_frame('next');
    }
    frame.render();
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
    config.set_mood_induction(true);
    config.set_self_report(true);
    config.set_pre_post_measurement(true);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, config, logger);

    let frame = model.get_frame('next');
    while(frame.template !== LONG_ANSWER_TEMPLATE) {
        frame = model.get_frame('next');
    }
    frame.time_limit = 2;
    model.back();

    // advance model frame, render nav and frame
    let nav = new Nav(model, logger);
}


function postq(variant) {
    let config = new DbtWorksheetModelConfig(DIRECTION_FWD, variant);
    config.set_feedback(true);
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, config, logger);

    let frame = model.get_frame('next');
    while(frame.template !== FEEDBACK_FRAME_TEMPLATE) {
        frame = model.get_frame('next');
    }
    model.get_frame('next');
    model.get_frame('next');
    //model.back();

    let nav = new Nav(model, logger);

}

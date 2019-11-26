"use strict";

let knowledgebase = KNOWLEDGEBASE_DATA;

$(document).ready(function() {
    let test_methods = {
        'intro': visual_test_intro,
        'body': visual_test_body,
        'summary': visual_test_summary,
        'pre_measurement': visual_test_pre_measurement,
        'self_report': visual_test_self_report,
        'consent_disclosure': visual_test_consent_disclosure,
        'noerror': all_wkshts_noerror,
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
    }

    let test_fcn = test_methods[page_to_show];
    test_fcn(variant);
});


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
 * Integration test that invokes IntroFrame to render the intro frame of this app.
 * Manually verified.
 * @param variant - the variant to test
 */
function visual_test_intro(variant) {
    let config = new DbtWorksheetModelConfig(DIRECTION_FWD, variant);
    let model = new DbtWorksheetModelFwd(knowledgebase, config);
    let frame = model.get_frame('next');
    while(frame.template !== INTRO_FRAME_TEMPLATE) {
        frame = model.get_frame('next');
    }
    let view = new IntroFrame(frame);
    view.render();
}


/*
 * Integration test that invokes StatementsBodyFrame to render a body frame of this app.
 * Manually verified.
 * @param variant - the variant to test
 */
function visual_test_body(variant) {
    let config = new DbtWorksheetModelConfig(DIRECTION_FWD, variant);
    let model = new DbtWorksheetModelFwd(knowledgebase, config);
    let frame = model.get_frame('next');
    while(frame.template !== STATEMENTS_FRAME_TEMPLATE) {
        frame = model.get_frame('next');
    }
    let view = new StatementsBodyFrame(frame);
    view.render();
}


/*
 * Integration test that invokes SuffaryFrameCount to render a summary frame generated
 * by this app.
 * Manually verified.
 * @param variant - the variant to test
 */
function visual_test_summary(variant) {
    let config = new DbtWorksheetModelConfig(DIRECTION_FWD, variant);
    let model = new DbtWorksheetModelFwd(knowledgebase, FWD_AFTER_CONFIG);
    let frame = model.get_frame('next');

    while(frame.template !== 'statements') {
        frame = model.get_frame('next');
    }
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
 * Integration test that invokes LikertFrame to render the pre and post measurement frame of this app.
 * Manually verified.
 */
function visual_test_pre_measurement() {
    FWD_PROMPTING_CONFIG.set_pre_post_measurement(true);
    let model = new DbtWorksheetModelFwd(knowledgebase, FWD_PROMPTING_CONFIG);
    let frame = model.get_frame('next');
    while(frame.template !== LIKERT_FRAME_TEMPLATE) {
        frame = model.get_frame('next');
    }
    let view = new LikertFrame(frame);
    view.render();
}

/*
 * Integration test that invokes SelfReportFrame to render the self report frame of this app.
 * Manually verified.
 */
function visual_test_self_report() {
    FWD_PROMPTING_CONFIG.set_self_report(true);
    let model = new DbtWorksheetModelFwd(knowledgebase, FWD_PROMPTING_CONFIG);
    let frame = model.get_frame('next');
    while(frame.template !== SELF_REPORT_FRAME_TEMPLATE) {
        frame = model.get_frame('next');
    }

    let view = new SelfReportFrame(frame);
    view.render();
}

/*
 * Integration test that invokes ConsentDisclosureFrame to render the consent disclosure frame of this app.
 * Manually verified.
 */
function visual_test_consent_disclosure() {
    FWD_PROMPTING_CONFIG.set_consent_disclosure(true);
    let model = new DbtWorksheetModelFwd(knowledgebase, FWD_PROMPTING_CONFIG);
    let frame = model.get_frame('next');
    while(frame.template !== CONSENT_DISCLOSURE_FRAME_TEMPLATE) {
        frame = model.get_frame('next');
    }
    let view = new ConsentDisclosureFrame(frame);
    view.render();
}
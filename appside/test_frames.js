"use strict";

/**
 * Supports manual testing of each frame type, excluding navigation panel.
 * Use the query string to specify which frame type to render.
 */
$(document).ready(function() {
    // Add new test methods here!
    // query_string : method to call
    let test_methods = {
        'statements': statements_frame_main,
        'words': words_frame_main,
        'summary_count': summary_count_frame_main,
        'summary_qual': summary_qualifier_frame_main,
        'selection': selection_frame_main,
        'bodymap': bodymap_main,
        'intro': intro_main,
        'bodymap_color': bodymap_color_main,
        'bodymap_color_fwd': bodymap_color_fwd_main,
    };

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
  Each method below manually obtains some data representing the given frame type
  and constructs a frame renderer from that data.

  In the full app, the Navigation module will construct frame renderers. This
  lets us test frame rendering without depending on the Navigation module.
*/

function summary_qualifier_frame_main() {
    // get the sample app data
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.summary_qualifier;

    let frame = new SummaryFrameQualifier(frame_data);
    frame.render();
}

function summary_count_frame_main() {
    // get the sample app data
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.summary_count;

    let frame = new SummaryFrameCount(frame_data);
    frame.render();
}

function words_frame_main() {
    // get the sample app data
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.body[3];

    let frame = new WordsBodyFrame(frame_data);
    frame.render()
}

function statements_frame_main() {
    // get the sample app data
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.body[0];

    let frame = new StatementsBodyFrame(frame_data);
    frame.render();
}

function selection_frame_main() {
    let frame = new EmotionSelectionFrame();
    frame.render();
}

function bodymap_main() {
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.body[1];

    let frame = new BodyMapFrame(frame_data);
    frame.render();
}

function intro_main() {
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.intro[0];

    let frame = new IntroFrame(frame_data);
    frame.render();
}

function bodymap_color_main() {
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.body[2];

    let frame = new BodyMapColorFrame(frame_data);
    frame.render();
}

function bodymap_color_fwd_main() {
    let frame = new BodyMapColorFwdFrame();
    frame.render();
}
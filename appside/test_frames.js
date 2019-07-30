"use strict";

// test method for rendering any of several kinds of frame, specified in query string.
$(document).ready(function() {
    let test_methods = {
        'statements': statements_frame_main,
        'words': words_frame_main,
        'summary_count': summary_count_frame_main,
        'summary_qual': summary_qualifier_frame_main,
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



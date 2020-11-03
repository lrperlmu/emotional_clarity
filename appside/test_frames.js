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
        'intro': intro_main,
        'intro_nographic': intro_nographic_main,
        'bodymap_color_fwd': bodymap_color_fwd_main,
        'bodymap_color': bodymap_color_main,    // requires 2 parameters [emotion, bodypart]
        'bodymap': bodymap_main,
        'short_answer': short_answer_main,
        'long_answer': long_answer_main,
        'likert': likert_main,
        'self_report': self_report_main,
        'consent_disclosure': consent_disclosure_main,
        'end': end_main,
        'postq1': postq1_main,
    };

    let page_types = Object.keys(test_methods);
    let page_to_show = page_types[0];
    // let page_to_show = 'postq1';

    // see if a frame type was written in the query string, otherwise use default
    // query format: ?frame=TEST_METHODS
    let query_string = new URLSearchParams(location.search);

    if (query_string.has('frame')) {
        page_to_show = query_string.get('frame');
    }

    let test_names = Object.keys(test_methods);
    if(test_names.includes(page_to_show)) {
        let test_fcn = test_methods[page_to_show];
        test_fcn();
    } else {
        console.error('Valid test names are: ' + test_names);
        throw Error('Unknown test requested: ' + page_to_show);
    }

});


class MockLogger {
    logResponses(data, pid) {
        console.log('mock log response', data, pid);
    }
    logTimestamp(event_name, pid) {
        console.log('mock log timestamp', event_name, pid);
    }
    logCompletionCode(code, pid) {
        console.log('mock log completion code', code, pid);
    }
}

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

    let frame = new SummaryFrameQualifier(frame_data, new MockLogger());
    frame.render();
}

function summary_count_frame_main() {
    // get the sample app data
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.summary_count;

    let frame = new SummaryFrameCount(frame_data, new MockLogger());
    frame.render();
}

function words_frame_main() {
    // get the sample app data
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.body[3];

    let frame = new WordsBodyFrame(frame_data, new MockLogger());
    frame.render()
}

function statements_frame_main() {
    // get the sample app data
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.body[0];

    let frame = new StatementsBodyFrame(frame_data, new MockLogger());
    frame.render();
}

function selection_frame_main() {
    let frame = new EmotionSelectionFrame(new MockLogger());
    frame.render();
}

function bodymap_main() {
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.body[1];

    var query = new URLSearchParams(location.search);
    if (query.has('bodypart')) {
        if (BODY_PART.includes(query.get('bodypart'))) {
            frame_data.bodypart = query.get('bodypart');
        }
    }
    let frame = new BodyMapFrame(frame_data, new MockLogger());
    frame.render();
}

function intro_main() {
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.intro[0];

    let frame = new IntroFrame(frame_data, new MockLogger());
    frame.render();
}

function intro_nographic_main() {
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.intro[1];

    let frame = new IntroFrame(frame_data, new MockLogger());
    frame.render();
}

function bodymap_color_main() {
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.body[2];
    frame_data.emotion = null;      // by default
    frame_data.bodypart = null;     // by default

    // query format: ?frame=bodymap_color&emotion=EMOTION&bodypart=BODYPART
    var query = new URLSearchParams(location.search);
    if (query.has('emotion') && query.has('bodypart')) {
        if (EMOTION_TYPE.includes(query.get('emotion')) && BODY_PART.includes(query.get('bodypart'))) {
            frame_data.emotion = query.get('emotion');
            frame_data.bodypart = query.get('bodypart');
        }
    }
    let frame = new BodyMapColorFrame(frame_data, new MockLogger());
    frame.render();
}

function bodymap_color_fwd_main() {
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.body[4];

    let frame = new BodyMapColorFwdFrame(frame_data, new MockLogger());
    frame.render();
}

function short_answer_main() {
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.short_answer;

    let frame = new ShortAnswerFrame(frame_data, new MockLogger());
    frame.render();
}

function long_answer_main() {
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.long_answer;

    let frame = new TimedLongAnswerFrame(frame_data, new MockLogger());
    frame.render();
}

function likert_main() {
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.likert;

    let frame = new LikertFrame(frame_data, new MockLogger());
    frame.render();
}

function self_report_main() {
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.self_report;

    let frame = new SelfReportFrame(frame_data, new MockLogger());
    frame.render();
}

function consent_disclosure_main() {
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.consent_disclosure;

    let frame = new ConsentDisclosureFrame(frame_data, new MockLogger());
    frame.render();
}

function end_main() {
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.end;

    let frame = new EndFrame(frame_data, new MockLogger());
    frame.render();
}

function postq1_main() {
    let sample_app = SAMPLE_APP;
    let frame_data = sample_app.postq1;

    let frame = new FormFrame(frame_data, new MockLogger());
    frame.responses[0] = 'Yes';
    frame.render();

}

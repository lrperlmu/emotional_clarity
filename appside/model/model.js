"use strict";

let model_data = DBT_WORKSHEET_FWD_PROMPTING_EVENTS;
let knowledgebase = KNOWLEDGEBASE_DATA;

// TODO: capitalization of object property names and map keys (should be lowercase I think)
// TODO: check all for loops for correct use of "of" vs "in"
// TODO: decide which features should be in Model superclass
// TODO: implement back()
// TODO: back() and next_frame() both invoked by catch-all method get_frame(slug)
//       slug can be 'back', 'next', or something unique
// TODO: file with all the model configs (one for each app)
// TODO: dispatcher that takes in a slug, chooses the right config,
//       and uses the config to determine what kind of model to instantiate

// TODO: move does-it-run test to a different file
$(document).ready(function() {

    let model = new DbtWorksheetModelFwd(model_data, knowledgebase);

    let frame = model.next_frame();
    console.log('initial frame');
    console.log(frame);

    frame = model.next_frame();
    console.log('body frame');
    console.log(frame);

    let user_input = new Map();
    for(let stmt of frame.statements) {
        user_input.set(stmt, true);
    }
    model.update(user_input);

    let i = 2;
    while(frame.template === 'statements') {
        i += 1;
        frame = model.next_frame();
        console.log(`frame ${i}`);
        console.log(frame);

        if(i == 5) {
            user_input = new Map();
            for(let stmt of frame.statements) {
                user_input.set(stmt, true);
            }
            model.update(user_input);
        }
    }
});



/**
 * Abstract supertype for all variants of model
 */
class Model {

    /**
     * Construct model
     */
    constructor() {
        if (new.target == Model) {
            throw new TypeError('cannot construct Model directly (use child)');
        }
        Model.emotion_selection_frame = {
            'template': 'emotion_selection',
        }
    }

    /**
     * Pass user input into the model
     * @param input - Map of data to be absorbed by the model
     */
    update(input) {
    }

    /**
     * Get next frame from the model
     * @return an object containing data for the next frame, based on
     *     the model's internal structure, and input passed in so far
     */
    next_frame() {
        let ret = {};
        return ret;
    }
}

class DbtWorksheetModelFwd extends Model {

    /**
     * Construct model from data
     * @param model_data is a js object with the spec for this model
     */
    constructor(model_data, knowledgebase) {
        super();

        this.model_data = model_data;

        // emotion : list of matching responses
        this.summary = new Map();

        // create the body frames

        // get all the statements for this category
        let category = model_data.meta.subsection;
        let category_statements = knowledgebase.filter(
            entry => entry['Category'] === category
        );

        // divide them into pages
        // TODO do we care to prevent one-statement pages?
        let num_stmts = category_statements.length;
        let statements_per_page = 12; // TODO make this config somewhere
        //category_statements = _.shuffle(category_statements);

        // construct user data
        // TODO consider making a FormEntry type instead of having these be structs
        this.user_data = new Map();
        for(let stmt of category_statements) {
            let form_entry = {};
            form_entry.emotion = stmt.Emotion;
            // does not differentiate between default and user-supplied response of false
            form_entry.response = false;
            this.user_data.set(stmt.Statement, form_entry);
        }

        let pages = [];
        while(category_statements.length > 0) {
            pages.push(category_statements.splice(0, statements_per_page));
        }

        // make a frame for each page
        let body_frames = [];
        for(let page of pages) {
            let page_statements = [];
            for(let stmt of page) {
                page_statements.push(stmt.Statement);
            }

            let frame = {};
            frame.template = 'statements';
            // TODO get this string from somewhere
            frame.question = 'Check the box for each thing you have experienced recently.';
            frame.statements = page_statements;
            body_frames.push(frame);
        }

        // make a list of all the frames
        // todo make this more concise
        this.frames = [];
        for(let frame of model_data.intro) {
            this.frames.push(frame);
        }
        for(let frame of body_frames) {
            this.frames.push(frame);
        }
        for(let frame of model_data.summary) {
            this.frames.push(frame);
        }
        // index into frames
        this.frame_idx = -1;
    }

    /**
     * Get next frame from the model
     * @return an object containing data for the next frame. based on
     *     the model's internal structure, and input passed in so far
     */
    next_frame() {
        this.frame_idx += 1;
        return this.frames[this.frame_idx];
    }

    /**
     * Pass user input into the model
     * @param input - Map of data to be absorbed by the model
     *            where keys are statements (strings) and values are true/false
     */
    update(input) {
        for(let pair of input) {
            let key = pair[0];
            let response = pair[1];
            this.user_data.get(key).response = response;
        }
        this.compute_summary();
    }

    /**
     * Transfer data from user_data to the summary frame
     */
    compute_summary() {
        // filter user data for "true" responses
        let entries = Array.from(this.user_data.entries());
        let true_responses = entries.filter(
            entry => entry[1].response === true
        );

        // store true responses in this.summary (for internal manipulation)
        for(let response of true_responses) {
            let res_emotion = response[1].emotion;
            let res_stmt = response[0];
            if(!(this.summary.has(res_emotion))) {
                this.summary.set(res_emotion, []);
            }
            this.summary.get(res_emotion).push(res_stmt);
        }

        // spit summary out into the frame (for sending to the user)
        let matched_emotions = this.model_data.summary[0].matched_emotions;
        matched_emotions.length = 0;
        for(let item of this.summary) {
            let summary_obj = {};
            summary_obj.emotion = item[0];
            summary_obj.responses = item[1];
            matched_emotions.push(summary_obj);
        }
    }
}




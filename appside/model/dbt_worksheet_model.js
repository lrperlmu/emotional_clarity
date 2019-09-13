"use strict";


class DbtWorksheetModelFwd extends Model {

    /**
     * Construct model from data
     * @param model_data is a js object with the spec for this model
     */
    constructor(model_data, knowledgebase) {
        super();

        this.model_data = model_data;

        // get all the statements for this category
        let category = model_data.meta.subsection;
        let category_statements = knowledgebase.filter(
            entry => entry['Category'] === category
        );

        let body_frames = this.build_body_frames(category_statements);

        // construct user data
        // {statement: {emotion: ..., response: ...}}
        // TODO consider making a FormEntry type instead of having these be structs
        this.user_data = new Map();
        for(let stmt of category_statements) {
            let form_entry = {};
            form_entry.emotion = stmt.Emotion;
            // does not differentiate between default and user-supplied response of false
            form_entry.response = false;
            this.user_data.set(stmt.Statement, form_entry);
        }

        // make a list of references to all the frames, so we can index into it
        console.log('model data', model_data);
        console.log('model data intro', model_data.intro);
        console.log('model data intro 0 title', model_data.intro[0].title);

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

        console.log('frames', this.frames);
        console.log('frames 0', this.frames[0]);
    }

    /**
     * Build body frames for a DBT worksheet model.
     *
     * @param category_statements - list of statements that we will make into frames
     * @return a list of body frames
     */
    build_body_frames(category_statements) {
        // create the body frames

        // copy-in the argument
        let statements = category_statements.concat();

        // divide them into pages
        // TODO do we care to prevent one-statement pages?
        let num_stmts = statements.length;
        let statements_per_page = 12; // TODO make this config somewhere
        //statements = _.shuffle(statements);

        let pages = [];
        while(statements.length > 0) {
            pages.push(statements.splice(0, statements_per_page));
        }

        // make a frame for each page
        let body_frames = [];
        for(let page of pages) {
            let page_statements = [];
            for(let stmt of page) {
                page_statements.push([stmt.Statement, false, stmt.Emotion]);
            }

            let frame = {};
            frame.template = 'statements';
            // TODO get this string from somewhere
            frame.question = 'Check the box for each thing you have experienced recently.';
            frame.statements = [];
            for(let statement of page_statements) {
                frame.statements.push(statement);
            }
            body_frames.push(frame);
        }
        return body_frames;
    }

    /**
     * Indicate whether it's safe to call next_frame
     * @return true if next frame exists, false if not
     */
    has_next_frame() {
        if(this.frame_idx >= this.frames.length-1) return false;
        else return true;
    }

    /**
     * Get next frame from the model.
     * It is the caller's responsibility to make sure that the next frame exists before calling.
     * Behavior undefined for nonexistent frames.
     * @return an object containing data for the next frame. based on
     *     the model's internal structure, and input passed in so far
     */
    next_frame() {
        this.frame_idx += 1;
        let frame = this.frames[this.frame_idx];
        this.fill_in_user_data(frame);
        return frame;
    }

    /**
     * Indicate whether it's safe to call next_frame
     * @return true if next frame exists, false if not
     */
    has_prev_frame() {
        if(this.frame_idx < 1) return false;
        else return true;
    }

    /**
     * Get previous frame from the model.
     * It is the caller's responsibility to make sure that the previous frame exists before calling.
     * Behavior undefined for nonexistent frames.
     * @return an object containing data for the frame. based on
     *     the model's internal structure, and input passed in so far
     */
    back() {
        this.frame_idx -= 1;
        let frame = this.frames[this.frame_idx];
        this.fill_in_user_data(frame);
        return frame;
    }

    /**
     * Get a frame based on the given slug.
     * @param slug - a string that indicates which frame to get
     */
    get_frame(slug) {
        let frames = new Map([
            ['next', this.next_frame.bind(this)],
            ['back', this.back.bind(this)],
        ]);
        return frames.get(slug)();
    }

    /**
     * Update the given frame to reflect user data we have so far in the model.
     * @param frame - object with properties:
     *     * frame.statements - list of [string, boolean] pairs
     */
    fill_in_user_data(frame) {
        if(!frame.hasOwnProperty('statements')) return;

        let statements = frame.statements;
        for(let tuple of statements) {
            let text = tuple[0];

            let known_answer = this.user_data.get(text).response;
            tuple[1] = known_answer;
        }
    }

    /**
     * Pass user input into the model
     * @param input - Map of data to be absorbed by the model
     *            where keys are statements (strings) and values are true/false
     */
    update(input) {
        for(let pair of input.entries()) {
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
        // entries takes the form [statement, {emotion: string, response: boolean}, ...]
        let entries = Array.from(this.user_data.entries());

        // filter user data for "true" responses
        let true_responses = entries.filter(
            entry => entry[1].response === true
        );

        // sort true responses by emotion, into an intermediate representation
        // {emotion : list of matching statements}
        let summary = new Map();
        for(let response of true_responses) {
            let res_emotion = response[1].emotion;
            let res_stmt = response[0];
            if(!(summary.has(res_emotion))) {
                summary.set(res_emotion, []);
            }
            summary.get(res_emotion).push(res_stmt);
        }

        // spit summary out into the frame (for sending to the user)
        let matched_emotions = this.model_data.summary[0].matched_emotions;
        matched_emotions.length = 0;
        for(let item of summary.entries()) {
            console.log('item', item);
            let summary_obj = {};
            summary_obj.emotion = item[0];
            summary_obj.responses = item[1];
            matched_emotions.push(summary_obj);
        }
    }
}

/**
 * Configuration for DBT worksheet models
 */
// TODO: This should provide all the information needed to construct frames
//       in the form of minimal_model.js or sample_app.js.
// In the end, none of the frame structs should be hard-coded.

class DbtWorksheetModelConfig {

    constructor(category, direction, section) {
        this.category = category;
        this.direction = direction;
        this.section = section;
        this.info_sheet_links = false;
        this.offer_ideas = false;
    }

    info_sheet_links(value) {
        this.info_sheet_links = value;
        return this;
    }

    offer_ideas(value) {
        this.offer_ideas = value;
        return this;
    }
}

"use strict";

let model_data = DBT_WORKSHEET_FWD_PROMPTING_EVENTS;
let knowledgebase = KNOWLEDGEBASE_DATA;

// TODO: back() and next_frame() both invoked by catch-all method get_frame(slug)
//       slug can be 'back', 'next', or something unique

// TODO: file with all the model configs (one for each app)
// TODO: dispatcher that takes in a slug, chooses the right config,
//       and uses the config to determine what kind of model to instantiate

// TODO: capitalization of object property names and map keys (should be lowercase I think)
// TODO: check all for loops for correct use of "of" vs "in"
// TODO: decide which features should be in Model superclass
// TODO: consider making knowledgebase not a global variable?

// TODO: move does-it-run test to a different file
$(document).ready(function() {

    let model = new DbtWorksheetModelFwd(model_data, knowledgebase);

    console.log('has_prev', model.has_prev_frame());

    let frame = model.get_frame('next');
    console.log('initial frame', frame);

    console.log('has_prev', model.has_prev_frame());

    frame = model.next_frame();
    console.log('body frame', frame);

    let user_input = new Map();
    for(let pair of frame.statements) {
        let stmt = pair[0];
        user_input.set(stmt, true);
    }
    model.update(user_input);

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
    }

    // go back and re-fill the initial frame
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
    
    while(frame.template === 'statements') {
        frame = model.next_frame();
    }
    console.log('updated summary', frame);
    
    
    
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

        console.log('knowledgebase', knowledgebase);


        this.model_data = model_data;

        // {emotion : list of matching responses}
        // starts empty and gets updated every time the user submits responses
        this.summary = new Map();

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
                page_statements.push(stmt.Statement);
            }

            let frame = {};
            frame.template = 'statements';
            // TODO get this string from somewhere
            frame.question = 'Check the box for each thing you have experienced recently.';
            frame.statements = [];
            for(let statement of page_statements) {
                frame.statements.push([statement, false]);
            }
            body_frames.push(frame);
        }
        console.log('body_frames', body_frames);
        return body_frames;
    }

    /**
     * Indicate whether it's safe to call next_frame
     * @return true if next frame exists, false if not
     */
    has_next_frame() {
        if(this.frame_idx === this.frames.length-1) return false;
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
        let frame =  this.frames[this.frame_idx];
        this.fill_in_user_data(frame);
        return frame;
    }

    /**
     * Indicate whether it's safe to call next_frame
     * @return true if next frame exists, false if not
     */
    has_prev_frame() {
        if(this.frame_idx === -1) return false;
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
        frames.get(slug)();
    }

    /**
     * Update the given frame to reflect user data we have so far in the model.
     * @param frame - object with properties:
     *     * frame.statements - list of [string, boolean] pairs
     */
    fill_in_user_data(frame) {
        //console.log('frame', frame);

        if(!frame.hasOwnProperty('statements')) return;

        let statements = frame.statements;
        for(let pair of statements) {
            let text = pair[0];
            
            let known_answer = this.user_data.get(text);
            pair[1] = known_answer;
        }
    }

    /**
     * Pass user input into the model
     * @param input - Map of data to be absorbed by the model
     *            where keys are statements (strings) and values are true/false
     */
    update(input) {
        console.log('\n\n\n');
        console.log('input', input);
        console.log('user data before update', this.user_data);
        for(let pair of input.entries()) {
            let key = pair[0];
            let response = pair[1];

            console.log('key', key, 'response', response);
            console.log('this.user_data.get(key).response', this.user_data.get(key).response);

            // console.log('key', key);
            // console.log('this.user_data.get(key)', this.user_data.get(key));
            this.user_data.get(key).response = response;

            console.log('this.user_data.get(key).response', this.user_data.get(key).response);
            // let tmp = this.user_data.get('Having an important goal blocked.');
            // console.log('having a goal blocked', tmp);

        }

        // why are the updates not showing up when this is printed to the console?!!???
        // let tmp = this.user_data.get('Having an important goal blocked.');
        // console.log('having a goal blocked', tmp);
        console.log('user data after update', this.user_data);

        this.compute_summary();

        //console.log('user data after compute summary', this.user_data);
        console.log('\n\n\n');
    }

    /**
     * Transfer data from user_data to the summary frame
     */
    compute_summary() {
        // filter user data for "true" responses

        // console.log('this.summary before', this.summary);
        // console.log('user data before compute summary', this.user_data);

        // {statement: {emotion: ..., response: ...}}
        let entries = Array.from(this.user_data.entries());

        //console.log('entries', entries);

        let true_responses = entries.filter(
            entry => entry[1].response === true
        );
        console.log('true_responses', true_responses);
        console.log(true_responses[0][1].response);

        // store true responses in this.summary (for internal manipulation)
        for(let response of true_responses) {
            let res_emotion = response[1].emotion;
            let res_stmt = response[0];
            if(!(this.summary.has(res_emotion))) {
                this.summary.set(res_emotion, []);
            }
            this.summary.get(res_emotion).push(res_stmt);
        }

        //console.log('this.summary after', this.summary);

        // spit summary out into the frame (for sending to the user)
        let matched_emotions = this.model_data.summary[0].matched_emotions;
        matched_emotions.length = 0;
        for(let item in this.summary.entries()) {
            console.log('item', item);
            let summary_obj = {};
            summary_obj.emotion = item[0];
            summary_obj.responses = item[1];
            matched_emotions.push(summary_obj);
        }
    }
}




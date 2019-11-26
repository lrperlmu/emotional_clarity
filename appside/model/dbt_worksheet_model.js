"use strict";

/**
 * Forward DBT Worksheet Model
 * Handles the logic and frame-construction of any DBT worksheet model app.
 */
class DbtWorksheetModelFwd extends Model {

    /**
     * Construct model from data
     * @param knowledgebase - js object containing the DBT worksheet data
     * @param config - DbtWorksheetModelConfig object with specifics for the model
     */
    constructor(knowledgebase, config) {
        super();

        this.config = config;

        // get all the statements for this section
        let section = config.section;
        let section_statements = knowledgebase.filter(
            entry => entry[KB_KEY_SECTION] === section
        );

        this.summary_frame = this.initialize_summary_frame();
        let body_frames = this.build_body_frames(section_statements);

        // construct user data
        // {statement: {emotion: ..., response: ...}}
        this.user_data = new Map();
        for(let stmt of section_statements) {
            let form_entry = {};
            form_entry.emotion = stmt.Emotion;
            // does not differentiate between default and user-supplied response of false
            form_entry.response = false;
            this.user_data.set(stmt.Statement, form_entry);
        }

        // make a list of references to all the frames, so we can index into it
        this.frames = [];
        if (this.config.pre_post_measurement === true) {
            this.frames.push(this.build_pre_post_measurement_frame());
        }
        for(let frame of this.build_intro_frames()) {
            this.frames.push(frame);
        }
        for(let frame of body_frames) {
            this.frames.push(frame);
        }
        this.frames.push(this.summary_frame);
        // index into frames

        if (this.config.pre_post_measurement === true) {
            this.frames.push(this.build_pre_post_measurement_frame());
        }
        this.frame_idx = -1;

        // function mapping for get_frame. It's initialized here so that child classes
        //    can optionally add entries
        this.nav_functions = new Map([
            ['next', this.next_frame.bind(this)],
            ['back', this.back.bind(this)],
        ]);
    }

    /**
     * Build likert frames for a DBT worksheet model as pre or post measurement frame.
     */
    build_pre_post_measurement_frame() {
        let pre_post = {};

        pre_post.template = LIKERT_FRAME_TEMPLATE;
        pre_post.instructions = LIKERT_INSTRUCTIONS;
        pre_post.qualifiers = SDERS_QUALIFIERS;
        
        let questions = [];
        questions.push([SDERS_QUESTIONS[0], 5]);
        questions.push([SDERS_QUESTIONS[1], undefined]);

        pre_post.questions = questions;
        return pre_post;
    }


    /**
     * Build intro frames for a DBT worksheet model.
     *
     * @return a list of intro frames
     */
    build_intro_frames() {
        // only one intro frame so far, but we'll likely add more
        let intro_frame = {};
        intro_frame.title = INTRO_TITLE[this.config.section];
        intro_frame.text = INTRO_TEXT;
        intro_frame.template = INTRO_FRAME_TEMPLATE;
        return [intro_frame];
    }

    /**
     * Build body frames for a DBT worksheet model.
     *
     * @param section_statements - list of statements that we will make into frames
     * @return a list of body frames
     */
    build_body_frames(section_statements) {
        // copy-in the argument
        let statements = section_statements.concat();

        // divide them into pages
        let num_stmts = statements.length;
        let statements_per_page = BODY_STATEMENTS_PER_PAGE;
        //statements = _.shuffle(statements);

        let pages = [];
        while(statements.length > 0) {
            pages.push(statements.splice(0, statements_per_page));
        }

        // prevent the last page from having only one statement, if possible
        if(statements_per_page >= 3 && pages.length > 1) {
            if(pages[pages.length-1].length == 1) {
                let penultimate_page = pages[pages.length-2];
                let ultimate_page = pages[pages.length-1];
                let removed = penultimate_page.splice(penultimate_page.length-1, 1);
                pages[pages.length-1] = ultimate_page.concat(removed);
            }
        }

        // make a frame for each page
        let body_frames = [];
        for(let page of pages) {
            let page_statements = [];
            for(let stmt of page) {
                page_statements.push([stmt.Statement, false, stmt.Emotion]);
            }

            let frame = {};
            frame.title = BODY_TITLE;
            frame.template = STATEMENTS_FRAME_TEMPLATE;
            frame.question = BODY_QUESTION[this.config.section];
            frame.statements = [];
            for(let statement of page_statements) {
                frame.statements.push(statement);
            }
            body_frames.push(frame);
        }
        return body_frames;
    }

    /**
     * Build summary frame for a DBT worksheet model.
     *
     * @return the summary frame
     */
    initialize_summary_frame() {
        let summary_frame = {};
        summary_frame.template = SUMMARY_TEMPLATE_COUNT;
        summary_frame.title = SUMMARY_TITLE;
        summary_frame.description = SUMMARY_TEXT;
        summary_frame.matched_emotions = [];
        summary_frame.follow_text = SUMMARY_FOLLOW_TEXT;
        summary_frame.info_sheet_links = this.config.info_sheet_links;
        summary_frame.offer_ideas = this.config.offer_ideas;
        return summary_frame;
    }

    /**
     * Indicate whether it's safe to call next_frame() or get_frame('next') on this
     * [For use by NAV.]
     *
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
     * Indicate whether it's safe to call back() or get_frame('back') on this
     * [For use by NAV.]
     *
     * @return true if previous frame exists, false if not
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
     * Get a frame based on the given slug. [For use by NAV.]
     *
     * Convenience method to provide a generic way of
     * calling back() or next_frame(). Caller is responsible to make sure the requested frame
     * exists, behavior undefined for nonexistent frames.
     * Child classes can add other get_frame methods.
     *
     * @param slug - a string that indicates which frame to get.
     *               'back' :  back()
     *               'next' : next_frame()
     * @return an object containing data for the requested frame.
     */
    get_frame(slug) {
        return this.nav_functions.get(slug)();
    }

    /**
     * Update the given frame to reflect user data we have so far in the model.
     * @param frame - object with properties:
     *     * frame.statements - list of [string, boolean] pairs
     * @modifies frame
     * @effects - possibly updates boolean values within arrays of the frame passed in
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
     * Pass user input into the model. [For use by NAV.]
     *
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
        let matched_emotions = this.summary_frame.matched_emotions;
        matched_emotions.length = 0;
        for(let item of summary.entries()) {
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
class DbtWorksheetModelConfig {

    /**
     * Construct config.
     * @param direction - (string) one of the directions specified in constants.js
     * @param section - (string) one of the sections specified in constants.js
     */
    constructor(direction, section) {
        this.category = CATEGORY_DBT_WORKSHEET;
        this.direction = direction;
        this.section = section;
        this.info_sheet_links = false;
        this.offer_ideas = false;
        this.pre_post_measurement = false;
    }

    /**
     * Setter for this.info_sheet_links, tells the model whether to offer links to more
     * information about various emotions in the summary.
     * @param value - boolean to set it to
     * @return this
     */
    set_info_sheet_links(value) {
        this.info_sheet_links = value;
        return this;
    }

    /**
     * Setter for this.offer_ideas, tells the model whether to offer ideas for dealing with
     * various emotions in the summary.
     * @param value - boolean to set it to
     * @return this
     */
    set_offer_ideas(value) {
        this.offer_ideas = value;
        return this;
    }

    /**
     * Setter for this.measurements, tells the model whether to offer pre/post measurements
     * at beginning and end of activity.
     * @param value - boolean to set it to
     * @return this
     */
    set_pre_post_measurement(value) {
        this.pre_post_measurement = value;
        return this;
    }
}


// One config instance for each type of DBT worksheet model
var FWD_PROMPTING_CONFIG = new DbtWorksheetModelConfig(DIRECTION_FWD, SECTION_PROMPTING);
var FWD_INTERP_CONFIG = new DbtWorksheetModelConfig(DIRECTION_FWD, SECTION_INTERP);
var FWD_BIO_CONFIG = new DbtWorksheetModelConfig(DIRECTION_FWD, SECTION_BIO);
var FWD_ACT_CONFIG = new DbtWorksheetModelConfig(DIRECTION_FWD, SECTION_ACT);
var FWD_AFTER_CONFIG = new DbtWorksheetModelConfig(DIRECTION_FWD, SECTION_AFTER);


/*
Example frames -- visual aid for the developer to see what kind of frames
a DBT worksheet model generates.

An intro frame might look something like this:
{
    'title': 'Prompting Events fwd (variant 1af)', // specific magic string
    'text': 'Please answer some questions. Tap NEXT to begin', // generic magic string
}

A body frame might look something like this:
{
    'template': 'statements',
    'title': 'Questions',
    'question': 'Check the box for each thing you have experienced recently.',
    'statements': [
        [
            'Observing or hearing about a person acting with extreme hypocrisy/fawning.',
            false,
            'Disgust',
        ],
        [
            'You are not part of the "in" crowd.',
            false,
            'Envy',
        ],
        [
            'Having an important goal blocked.',
            false,
            'Anger',
        ]
    ]
}

A summary frame might look something like this:
{
    'template': 'count',
    'title': 'Summary',
    'description': 'Your input for this activity suggests:',
    'matched_emotions': [
        {
            'emotion': 'Disgust',
            'responses': [
                'Observing or hearing about a person acting with extreme hypocrisy/fawning.'
            ],
        },
        {
            'emotion': 'Anger',
            'responses': [
                'Having an important goal blocked',
            ],
        }
    ],
    'follow_text': 'Thank you for doing this activity',
    'info_sheet_links': true,
    'offer_ideas': true,
}

*/

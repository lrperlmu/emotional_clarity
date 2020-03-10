"use strict";

/**
 * dbt_worksheet_model.js
 * @author Leah Perlmutter
 */

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
    constructor(knowledgebase, config, logger) {
        super(logger);

        this.config = config;

        // get all the statements for this section
        let section = config.section;
        let section_statements = knowledgebase.filter(
            entry => entry[KB_KEY_SECTION] === section
        );

        // find identical statements with different emotions and merge
        // first, sort by statement
        section_statements.sort((a, b) => a.Statement.localeCompare(b.Statement));

        // then, merge identical
        let merged_section_statements = [];
        let item = section_statements[0];
        for(let i = 1; i <= section_statements.length; i++) {
            // peek at the next item
            let next;
            if(i < section_statements.length) {
                next = section_statements[i];
            }
            if(i === section_statements.length || next.Statement !== item.Statement) {
                // item is the last of a run, make a new entry in the merged list
                let item_to_push = Object.assign(item);
                item_to_push.Emotions = item_to_push.Emotion.split(', ');
                delete item_to_push.Emotion;
                merged_section_statements.push(item_to_push);
            } else {
                // merge this entry into the next entry
                next.Emotion = item.Emotion.concat(', ',next.Emotion);
            }
            item = next;
        }

        // finally, re-sort by emotion
        merged_section_statements.sort(
            (a, b) => a.Emotions[0].localeCompare(b.Emotions[0]));

        this.summary_frame = this.initialize_summary_frame();
        let body_frames = this.build_body_frames(merged_section_statements);

        this.uds = new UserDataSet();
        for (let stmt of merged_section_statements) {
            let ud = new UserData(stmt.Statement, false, stmt.Emotions, RESPONSE_GENERIC);
            this.uds.add(ud);
        }

        let consent_questions = [];
        for (let question of CONSENT_DISCLOSURE_QUESTIONS) {
            consent_questions.push([question, false]);
        }

        let likert_questions = [];
        likert_questions.push([SDERS_QUESTIONS[0], undefined]);
        likert_questions.push([SDERS_QUESTIONS[1], undefined]);

        let self_report_questions = [];
        self_report_questions.push([SELF_REPORT_Q1, '']);
        self_report_questions.push([SELF_REPORT_Q2, '']);

        // make a list of references to all the frames, so we can index into it
        // add userdataset items where applicable
        this.frames = [];
        if(this.config.consent_disclosure) {
            this.frames.push(this.build_consent_disclosure_frame(consent_questions));

            for(let item of consent_questions) {
                let ud = new UserData(item[0], item[1], [], RESPONSE_GENERIC);
                this.uds.add(ud);
            }
            this.frames.push(new BlockerFrame());
        }
        if(this.config.mood_induction) {
            for(let frame of this.build_mood_induction_frames()) {
                this.frames.push(frame);
            }
            this.frames.push(new BlockerFrame());
        }
        if(this.config.self_report) {
            this.frames.push(this.build_self_report_frame(self_report_questions, RESPONSE_PRE));

            for(let item of self_report_questions) {
                let ud = new UserData(item[0], item[1], [], RESPONSE_PRE);
                this.uds.add(ud);
            }
        }
        if(this.config.pre_post_measurement) {
            this.frames.push(this.build_likert_frame(likert_questions, RESPONSE_PRE));

            for(let item of likert_questions) {
                let ud = new UserData(item[0], item[1], [], RESPONSE_PRE);
                this.uds.add(ud);
            }
        }
        this.frames.push(new BlockerFrame());
        for(let frame of this.build_intro_frames()) {
            this.frames.push(frame);
        }
        for(let frame of body_frames) {
            this.frames.push(frame);
        }
        this.frames.push(this.summary_frame);
        this.frames.push(new BlockerFrame());
        if (this.config.self_report === true) {
            this.frames.push(this.build_self_report_frame(self_report_questions, RESPONSE_POST));

            for(let item of self_report_questions) {
                let ud = new UserData(item[0], item[1], [], RESPONSE_POST);
                this.uds.add(ud);
            }
        }
        if (this.config.pre_post_measurement === true) {
            this.frames.push(this.build_likert_frame(likert_questions, RESPONSE_POST));

            for(let item of likert_questions) {
                let ud = new UserData(item[0], item[1], [], RESPONSE_POST);
                this.uds.add(ud);
            }
        }
        this.frames.push(new BlockerFrame());
        this.frames.push(this.build_end_frame());
        // index into frames
        this.frame_idx = -1;

        // function mapping for get_frame. It's initialized here so that child classes
        //    can optionally add entries
        this.nav_functions = new Map([
            ['next', this.next_frame.bind(this)],
            ['back', this.back.bind(this)],
        ]);
    }

    /**
     * Build mood_induction frames for a DBT worksheet model.
     * @effects - adds some new uds
     * @modifies - this.uds
     * @return list of Frames
     */
    build_mood_induction_frames() {
        let short_answer_frame = {};
        short_answer_frame.template = SHORT_ANSWER_TEMPLATE;
        short_answer_frame.response_name = RESPONSE_INDUCTION;
        short_answer_frame.title = INDUCTION_TITLE;
        short_answer_frame.prompt = INDUCTION_THINKING_PROMPT;
        short_answer_frame.truncated_prompt = short_answer_frame.prompt.substring(0, 100);
        short_answer_frame.instruction = INDUCTION_NOTE;
        short_answer_frame.char_limit = INDUCTION_CHAR_LIMIT;
        let frame1 = new ShortAnswerFrame(short_answer_frame, this.logger);

        let ud1 = new UserData(
            short_answer_frame.truncated_prompt, "", [], short_answer_frame.response_name);
        this.uds.add(ud1);

        let long_answer_frame = {};
        long_answer_frame.template = LONG_ANSWER_TEMPLATE;
        long_answer_frame.response_name = RESPONSE_INDUCTION;
        long_answer_frame.title = INDUCTION_TITLE;
        long_answer_frame.prompt = INDUCTION_WRITING_PROMPT;
        long_answer_frame.truncated_prompt = long_answer_frame.prompt.substring(0, 100);
        long_answer_frame.time_limit = INDUCTION_TIME_LIMIT;
        let frame2 = new TimedLongAnswerFrame(long_answer_frame, this.logger);

        let ud2 = new UserData(
            long_answer_frame.truncated_prompt, "", [], long_answer_frame.response_name);
        this.uds.add(ud2);

        return [frame1, new BlockerFrame(), frame2];
    }

    /**
     * Build consent disclosure frames for a DBT worksheet model.
     * @param consent_questions - list of [question (string), response (bool)]
     * @return the Frame
     */
    build_consent_disclosure_frame(consent_questions) {
        let consent_frame = {};

        consent_frame.title = CONSENT_DISCLOSURE_TITLE;
        consent_frame.response_name = RESPONSE_GENERIC;
        consent_frame.template = CONSENT_FRAME_TEMPLATE;
        consent_frame.instructions = CONSENT_DISCLOSURE_INSTRUCTIONS;

        consent_frame.questions = consent_questions;
        return new ConsentDisclosureFrame(consent_frame, this.logger);
    }

    /**
     * Build self report frame for a DBT worksheet model.
     * @param self_report_questions - list of [question (string), response (bool or int)]
     * @param response_name - disambiguation name
     * @return the Frame
     */
    build_self_report_frame(self_report_questions, response_name) {
        let frame = {};

        frame.template = SELF_REPORT_FRAME_TEMPLATE;
        frame.response_name = response_name;
        frame.qualifiers = QUALIFIERS;

        frame.questions = self_report_questions;
        return new SelfReportFrame(frame, this.logger);
    }

    /**
     * Build likert frame for a DBT worksheet model as pre or post measurement frame.
     *
     * @param likert_questions - list of [text (string), default_response (int)]
     * @param response_name - disambiguation name
     * @return the Frame
     */
    build_likert_frame(likert_questions, response_name) {
        let frame = {};

        frame.template = LIKERT_FRAME_TEMPLATE;
        frame.response_name = response_name;
        frame.instructions = LIKERT_INSTRUCTIONS;
        frame.qualifiers = SDERS_QUALIFIERS;
        
        frame.questions = likert_questions;

        return new LikertFrame(frame, this.logger);
    }

    /**
     * Build intro frames for a DBT worksheet model.
     *
     * @return a list of IntroFrames
     */
    build_intro_frames() {
        // only one intro frame so far, but we'll likely add more
        let intro_frame = {};
        intro_frame.title = INTRO_TITLE[this.config.section];
        intro_frame.text = INTRO_TEXT(this.config.section);
        intro_frame.template = INTRO_FRAME_TEMPLATE;
        return [new IntroFrame(intro_frame, this.logger)];
    }

    /**
     * Build body frames for a DBT worksheet model.
     *
     * @param section_statements - list of statements that we will make into frames
     * @return a list of body Frames
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
                page_statements.push([stmt.Statement, false, stmt.Emotions]);
            }

            let frame = {};
            frame.title = BODY_TITLE;
            frame.response_name = RESPONSE_GENERIC;
            frame.template = STATEMENTS_FRAME_TEMPLATE;
            frame.question = BODY_QUESTION[this.config.section];
            frame.statements = [];
            for(let statement of page_statements) {
                frame.statements.push(statement);
            }
            body_frames.push(new StatementsBodyFrame(frame, this.logger));
        }
        return body_frames;
    }

    /**
     * Build end frame
     *
     * @return the end frame
     */
    build_end_frame() {
        let end_frame = {};
        end_frame.template = END_FRAME_TEMPLATE;
        end_frame.title = END_TITLE;
        end_frame.completion_code = this.generate_completion_code();
        end_frame.completion_text = END_CODE_TEXT
        end_frame.directions = END_DIRECTIONS;
        end_frame.contact = END_CONTACT;
        return new EndFrame(end_frame, this.logger);
    }

    /**
     * Build summary frame for a DBT worksheet model.
     *
     * @return the summary frame
     */
    initialize_summary_frame() {
        let summary_frame = {};
        summary_frame.template = SUMMARY_COUNT_FRAME_TEMPLATE;
        summary_frame.title = SUMMARY_TITLE;
        summary_frame.description = SUMMARY_TEXT;
        summary_frame.matched_emotions = [];
        summary_frame.follow_text = SUMMARY_FOLLOW_TEXT;
        summary_frame.info_sheet_links = this.config.info_sheet_links;
        summary_frame.offer_ideas = this.config.offer_ideas;
        return new SummaryFrameCount(summary_frame, this.logger);
    }

    /**
     * Create a unique completion code.
     *
     * @return the code
     */
    generate_completion_code() {
        return Math.round(Math.random() * 1e12);
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
     * If I go to the next frame, can I go back again to this frame?
     * [For use by NAV.]
     *
     * @return true if can go back after advancing
     */
    is_next_reversible() {
        if(this.frames.length > this.frame_idx+1 &&
            this.frames[this.frame_idx+1].is_blocker()) return false;
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
        while(this.frames[this.frame_idx].is_blocker()) this.frame_idx += 1;
        let frame = this.frames[this.frame_idx];
        frame.fill_in_data(this.uds);
        return frame;
    }

    /**
     * Indicate whether it's safe to call back() or get_frame('back') on this
     * [For use by NAV.]
     *
     * @return true if previous frame exists and is legal to navigate to, false if not
     */
    has_prev_frame() {
        if(this.frame_idx < 1) return false;
        else if(this.frames[this.frame_idx-1].is_blocker()) return false;
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
        frame.fill_in_data(this.uds);
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
     * Pass user input into the model. [For use by NAV.]
     *
     * Logging: record user responses in database
     * 
     * @param input - data to be absorbed by the model
     *    {statement (string): {'name':name (string), 'response':response (boolean or int)} }
     */
    update(input) {
        let updated_uds = new UserDataSet();
        for(let pair of input.entries()) {
            let question = pair[0];
            let name = pair[1].name;
            let response = pair[1].response;
            let ud = this.uds.lookup(question, name);
            ud.response = response;
            updated_uds.add(ud);
        }
        this.compute_summary();
        this.logger.logUds(updated_uds);
    }

    /**
     * Transfer data from this.uds to the summary frame
     */
    compute_summary() {
        // entries takes the form [ [statement, {emotion: string, response: boolean}], ...]
        let entries = this.uds.to_array();

        // filter user data for "true" responses
        let true_responses = entries.filter(
            entry => entry[1].response === true
        );

        // sort true responses by emotion, into an intermediate representation
        // {emotion : list of matching statements}
        let summary = new Map();
        for(let response of true_responses) {
            for(let res_emotion of response[1].emotions) {
                let res_stmt = response[0];
                if(!(summary.has(res_emotion))) {
                    summary.set(res_emotion, []);
                }
                summary.get(res_emotion).push(res_stmt);
            }
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
        this.summary_frame.matched_emotions.sort(function(entry_a, entry_b) {
            return entry_b.responses.length - entry_a.responses.length;
        });
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
        this.self_report = false;
        this.consent_disclosure = false;
        this.mood_induction = false;
    }

    /**
     * Setter for this.mood_induction, tells the model whether to include mood induction
     * @param value - boolean to set it to
     * @return this
     */
    set_mood_induction(value) {
        this.mood_induction = value;
        return this;
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
     * Setter for this.pre_post_measurement, tells the model whether to offer pre/post measurements
     * at beginning and end of activity.
     * @param value - boolean to set it to
     * @return this
     */
    set_pre_post_measurement(value) {
        this.pre_post_measurement = value;
        return this;
    }

    /**
     * Setter for this.self_report, tells the model whether to offer self report frame.
     * @param value - boolean to set it to
     * @return this
     */
    set_self_report(value) {
        this.self_report = value;
        return this;
    }

    /**
     * Setter for this.consent_disclosure, tells the model whether to offer consent disclosure frame.
     * @param value - boolean to set it to
     * @return this
     */
    set_consent_disclosure(value) {
        this.consent_disclosure = value;
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

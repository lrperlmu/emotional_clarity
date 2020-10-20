'use strict';

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
     * NOTE: construction is not finished when this constructor returns
     *     It is only done upon resolution of the promise this.initialize.
     *     Anything to be done after initialization must be wrapped in
     *     this.initialize.then(...);
     * @param knowledgebase - js object containing the DBT worksheet data
     * @param config - DbtWorksheetModelConfig object with specifics for the model
     */
    constructor(knowledgebase, config, logger) {
        super(logger);

        this.config = config;
        // full name of variant (not the slug)
        this.variant = config.section;
        // slug of variant
        this.variant_slug = VARIANT_SLUG_LOOKUP[this.variant];

        this.pid = null;
        this.initialize = this.async_init();

        this.initialize.then(() => {
            console.log('participant id', this.pid);
            logger.logUserPid(this.pid);

            console.log('variant', this.variant);
            this.variant_slug = VARIANT_SLUG_LOOKUP.get(this.variant);
            logger.logVariantEvent(this.pid, 'assign', this.variant_slug);
        });

        this.uds = new UserDataSet();
        this.summary_frame = this.initialize_summary_frame();
        this.frame_callbacks = new Map();

        // make a list of references to all the frames, so we can index into it
        // add userdataset items where applicable
        this.initialize.then(() => {
            this.frames = [];
            if(this.config.study) {
                this.frames.push(this.build_study_welcome_frame());
                this.frames.push(new BlockerFrame());
                this.frames.push(this.build_browser_check_frame());
                this.frames.push(new BlockerFrame());
            }
            if(this.config.consent_disclosure) {
                this.frames.push(this.build_consent_disclosure_frame());
                this.frames.push(new BlockerFrame());
            }
            this.frames.push(this.build_content_warning_frame());
            this.frames.push(new BlockerFrame());
            if(this.config.study) {
                for(let frame of this.build_phq_frames()) {
                    this.frames.push(frame);
                }
                this.frames.push(new BlockerFrame());
            }
            if(this.config.mood_induction) {
                for(let frame of this.build_mood_induction_frames()) {
                    this.frames.push(frame);
                }
                this.frames.push(new BlockerFrame());
            }

            // Pre measurement
            if(this.config.self_report) {
                this.frames.push(this.build_self_report_frame(RESPONSE_PRE));
            }
            if(this.config.pre_post_measurement) {
                this.frames.push(this.build_likert_frame(RESPONSE_PRE));
            }
            if(this.config.pre_post_measurement || this.config.self_report) {
                this.frames.push(new BlockerFrame());
            }

            // Transition to app
            if(this.config.study) {
                this.frames.push(this.build_pre_transition_frame());
                this.frames.push(new BlockerFrame());
            }

            // App frames
            for(let frame of this.build_intro_frames()) {
                this.frames.push(frame);
            }
            for(let frame of this.build_body_frames(knowledgebase)) {
                this.frames.push(frame);
            }
            this.frames.push(this.summary_frame);
            this.frames.push(new BlockerFrame());

            // Transition away from the app
            if(this.config.study) {
                this.frames.push(this.build_post_transition_frame());
            }

            // Post measurement
            if (this.config.self_report) {
                this.frames.push(this.build_self_report_frame(RESPONSE_POST));
            }
            if(this.config.pre_post_measurement) {
                this.frames.push(this.build_likert_frame(RESPONSE_POST));
            }
            if(this.config.mood_check) {
                for(let frame of this.build_mood_check_frames())
                    this.frames.push(frame);
            }
            if(this.config.pre_post_measurement || this.config.self_report || this.config.mood_check) {
                this.frames.push(new BlockerFrame());
            }


            if(this.config.feedback) {
                for(let frame of this.build_feedback_frames()) {
                    this.frames.push(frame);
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
        });
    }

    /**
     * Do asynchronous initialization stuff such as database reads.
     * Top level code can use then() to do things after this.
     * @return promise that resolves when initialization is done
     *    with unspecified resolve value
     */
    async_init() {
        let assign_pid_async = function(transaction_result) {
            return new Promise(function(resolve, reject) {
                this.pid = transaction_result.snapshot.val();
                resolve(this.pid);
            }.bind(this));
        }.bind(this);

        let assign_variant_async = function(variant) {
            return new Promise(function(resolve, reject) {
                // look up the variant for this slug
                this.variant = VARIANT_LOOKUP.get(variant);
                resolve(variant);
            }.bind(this));
        }.bind(this);

        let get_pid = this.logger.incrementPid();
        let assign_pid = get_pid.then(assign_pid_async);
        get_pid.catch(error => {
            console.error('failed to get participant id');
        });

        let ret = assign_pid;

        // assign app variant automatically if not specified in config
        if(this.variant === undefined) {
            let get_app_variant = assign_pid
                .then(this.logger.getAppVariant.bind(this.logger));
            ret = get_app_variant
                .then(assign_variant_async);
        }

        return ret;
    }

    /*
    // conceptual map of what async_init is doing:

    // param none
    // increment pid in database
    // return promise that resolves with transaction result containing pid
    this.logger.incrementPid()

        // param transaction result containing pid
        // this.pid = pid
        // return promise that resolves with pid
        .then(this.assign_pid_async)

        // param pid
        // assign variant in database
        // return promise that resolves with variant slug
        .then(this.logger.getAppVariant)
                                         
        // param variant
        // this.variant = full name of variant
        // return promise that resolves with variant slug
        .then(this.assign_variant_async);
    */

    /**
     * Register a callback to be called by the model when
     *   navigating forward after a frame with the given template name.
     * @param template_name - name of the frame's template
     * @callback - the method that should be called
     */
    register_frame_callback(template_name, callback) {
        this.frame_callbacks.set(template_name, callback);
    }

    /**
     * Build welcome frame
     * @return welcome frame
     */
    build_study_welcome_frame() {
        let frame = {};
        frame.template = SW_FRAME_TEMPLATE;
        frame.title = SW_TITLE;
        frame.instruction = SW_TEXT;
        frame.questions = [];
        frame.response_name = RESPONSE_GENERIC;
        let ret = new FormFrame(frame, this.logger);
        return ret;
    }

    build_content_warning_frame() {
        let frame = {};
        frame.template = CW_FRAME_TEMPLATE;
        frame.title = CW_TITLE;
        frame.instruction = CW_TEXT;
        frame.questions = [];
        frame.response_name = RESPONSE_GENERIC;
        let ret = new FormFrame(frame, this.logger);
        return ret;
    }

    /**
     * Read uds from this.uds and compute the phq-9 score
     */
    phq_compute() {
        // get the phq uds and tally the score
        let phq_uds = this.uds.get_all(RESPONSE_PHQ);
        let score = 0;
        for(let ud of phq_uds) {
            score += Number(ud.response);
        }

        if(score >= PHQ_LOWEST_FAIL) {
            let i;
            for(i=0; i<this.frames.length; i++){
                let frame = this.frames[i];
                // change phq result frame text
                if(frame.template === PHQR_FRAME_TEMPLATE) {
                    frame.instruction = PHQR_TEXT_NO;
                    break;
                }
            }
            // delete study and app frames, leaving only the end frame
            let start_deleting_idx = i + 2;
            for(; i<this.frames.length; i++) {
                let frame = this.frames[i];
                if(frame.template === END_FRAME_TEMPLATE) {
                    frame.set_passed_phq(false);
                    break;
                }
            }
            let num_to_delete = i - start_deleting_idx;
            this.frames.splice(start_deleting_idx, num_to_delete);
        } else {
            this.logger.logVariantEvent(this.pid, 'start', this.variant_slug);
        }
    }

    /**
     * Read uds from this.uds and compute the mood check score
     */
    mood_check_compute() {

        // get the phq uds and tally the score
        let mood_uds = this.uds.get_all(RESPONSE_MOOD);
        let score = 0;
        for(let ud of mood_uds) {
            score = Math.max(score, Number(ud.response));
        }

        if(score < MOOD_LOWEST_FAIL) {
            // Remove the positive induction frame
            let start_deleting_idx = null;
            for(let i=0; i<this.frames.length; i++) {
                let frame = this.frames[i];
                if(frame.template === POSITIVE_INDUCTION_TEMPLATE) {
                    start_deleting_idx = i;
                    break;
                }
            }
            let num_to_delete = 2; // Blocker frame and positive mood induction
            this.frames.splice(start_deleting_idx, num_to_delete);
        }
    }    

    /**
     * Build phq frames
     * @return the question frame and the results frame
     */
    build_phq_frames() {
        let ret = [];

        // the frame with the questions
        let q_frame = {};
        q_frame.template = PHQ_FRAME_TEMPLATE;
        q_frame.title = PHQ_TITLE;
        q_frame.instruction = PHQ_TEXT;
        q_frame.questions = PHQ_QUESTIONS;
        q_frame.qulifiers = PHQ_OPTIONS;
        q_frame.response_name = RESPONSE_PHQ;
        ret.push(new FormFrame(q_frame, this.logger));

        for(let question of q_frame.questions) {
            let text = question[0];
            let ud = new UserData(text, '', [], q_frame.response_name);
            this.uds.add(ud);
        }
        ret.push(new BlockerFrame());

        // the frame with the results
        let r_frame = {};
        r_frame.template = PHQR_FRAME_TEMPLATE;
        r_frame.title = PHQR_TITLE;
        // this field will be changed after the fact if participant fails the screen
        r_frame.instruction = PHQR_TEXT_YES;
        r_frame.questions = [];
        ret.push(new FormFrame(r_frame, this.logger));

        this.register_frame_callback(q_frame.template, this.phq_compute);

        return ret;
    }

    /**
     * Build browser check frame
     * @return browser check frame
     */
    build_browser_check_frame() {
        let frame = {};
        frame.template = BC_FRAME_TEMPLATE;
        frame.title = BC_TITLE;
        frame.instruction = BC_TEXT;
        frame.questions = [];
        frame.response_name = RESPONSE_GENERIC;
        let ret = new FormFrame(frame, this.logger);
        return ret;
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
        short_answer_frame.questions = [
            [INDUCTION_THINKING_PROMPT, 'shorttext', true, INDUCTION_NOTE],
        ];
        let frame1 = new FormFrame(short_answer_frame, this.logger);

        let ud1 = new UserData(
            INDUCTION_THINKING_PROMPT, '', [], short_answer_frame.response_name);
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
            long_answer_frame.truncated_prompt, '', [], long_answer_frame.response_name);
        this.uds.add(ud2);

        return [frame1, new BlockerFrame(), frame2];
    }

    /**
     * Build consent frame for a DBT worksheet model.
     * @return the Frame
     */
    build_consent_disclosure_frame() {
        let consent_questions = [];
        for (let question of CONSENT_DISCLOSURE_QUESTIONS) {
            consent_questions.push([question, false]);
        }

        let consent_frame = {};

        consent_frame.title = CONSENT_DISCLOSURE_TITLE;
        consent_frame.response_name = RESPONSE_GENERIC;
        consent_frame.template = CONSENT_FRAME_TEMPLATE;
        consent_frame.instructions = CONSENT_DISCLOSURE_INSTRUCTIONS;

        consent_frame.questions = consent_questions;

        for(let item of consent_questions) {
            let ud = new UserData(item[0], item[1], [], RESPONSE_GENERIC);
            this.uds.add(ud);
        }

        return new ConsentDisclosureFrame(consent_frame, this.logger);
    }

    /**
     * Build self report frame for a DBT worksheet model.
     * @param response_name - disambiguation name
     * @return the Frame
     */
    build_self_report_frame(response_name) {
        let self_report_questions = [];
        self_report_questions.push([SELF_REPORT_Q1, 'text', true]);
        self_report_questions.push([SELF_REPORT_Q2, 'likert', true]);

        let frame = {};

        frame.title = SELF_REPORT_TITLE;
        frame.template = SELF_REPORT_FRAME_TEMPLATE;
        frame.response_name = response_name;
        frame.qualifiers = SELF_REPORT_QUALIFIERS;
        frame.values = SELF_REPORT_VALUES;
        frame.questions = self_report_questions;

        for(let item of self_report_questions) {
            let ud = new UserData(item[0], '', [], response_name);
            this.uds.add(ud);
        }

        return new FormFrame(frame, this.logger);
    }

    /**
     * Build likert frame for a DBT worksheet model as pre or post measurement frame.
     *
     * @param response_name - disambiguation name
     * @return the Frame
     */
    build_likert_frame(response_name) {
        let likert_questions = [];

        // ordering based on even/odd pid
        if(this.pid % 2 === 0) {
            likert_questions.push([SDERS_QUESTIONS[0], 'likert', true]);
            likert_questions.push([SDERS_QUESTIONS[1], 'likert', true]);
        } else {
            likert_questions.push([SDERS_QUESTIONS[1], 'likert', true]);
            likert_questions.push([SDERS_QUESTIONS[0], 'likert', true]);
        }

        let frame = {};

        frame.title = LIKERT_FRAME_TITLE;
        frame.template = LIKERT_FRAME_TEMPLATE;
        frame.response_name = response_name;
        frame.instruction = LIKERT_INSTRUCTIONS;
        frame.qualifiers = SDERS_QUALIFIERS;
        frame.values = SDERS_VALUES;
        frame.questions = likert_questions;

        for(let item of likert_questions) {
            let ud = new UserData(item[0], '', [], response_name);
            this.uds.add(ud);
        }

        return new FormFrame(frame, this.logger);
    }

    /**
     * Build likert frame for post-activity mood check.
     *
     * @param response_name - disambiguation name
     * @return the Frame
     */
    build_mood_check_frames() {
        let mood_questions = [];
        mood_questions.push([MOOD_QUESTIONS[0], 'likert', true]);
        mood_questions.push([MOOD_QUESTIONS[1], 'likert', true]);
        mood_questions.push([MOOD_QUESTIONS[2], 'likert', true]);
        mood_questions.push([MOOD_QUESTIONS[3], 'likert', true]);

        let mood_check_frame = {};

        mood_check_frame.title = MOOD_FRAME_TITLE;
        mood_check_frame.template = MOOD_FRAME_TEMPLATE;
        mood_check_frame.response_name = RESPONSE_MOOD;
        mood_check_frame.instructions = MOOD_INSTRUCTIONS;
        mood_check_frame.qualifiers = MOOD_QUALIFIERS;
        mood_check_frame.values = MOOD_VALUES;
        mood_check_frame.questions = mood_questions;

        for(let item of mood_questions) {
            let ud = new UserData(item[0], '', [], RESPONSE_MOOD);
            this.uds.add(ud);
        }

        let positive_induction_frame = {};
        positive_induction_frame.template = POSITIVE_INDUCTION_TEMPLATE;
        positive_induction_frame.response_name = RESPONSE_INDUCTION;
        positive_induction_frame.title = POSITIVE_INDUCTION_TITLE;
        positive_induction_frame.prompt = POSITIVE_INDUCTION_WRITING_PROMPT;
        positive_induction_frame.truncated_prompt = positive_induction_frame.prompt.substring(0, 100);
        positive_induction_frame.time_limit = INDUCTION_TIME_LIMIT;

        let ud_mood = new UserData(
            positive_induction_frame.truncated_prompt, '', [], RESPONSE_INDUCTION);
        this.uds.add(ud_mood);

        this.register_frame_callback(MOOD_FRAME_TEMPLATE, this.mood_check_compute);

        return [new FormFrame(mood_check_frame, this.logger),
                new BlockerFrame(),
                new TimedLongAnswerFrame(positive_induction_frame, this.logger)];
    }


    /**
     * Build a frame to transition from study related questions to the app.
     *
     * @return a FormFrame
     */
    build_pre_transition_frame() {
        let frame = {};
        frame.template = TRANSITION_FRAME_TEMPLATE;
        frame.title = PRE_TRANSITION_TITLE;
        frame.instruction = PRE_TRANSITION_TEXT;
        frame.questions = [];
        frame.response_name = RESPONSE_GENERIC;
        let ret = new FormFrame(frame, this.logger);
        return ret;
    }

    /**
     * Build a frame to transition from the app back to study related questions .
     *
     * @return a FormFrame
     */
    build_post_transition_frame() {
        let frame = {};
        frame.template = TRANSITION_FRAME_TEMPLATE;
        frame.title = POST_TRANSITION_TITLE;
        frame.instruction = POST_TRANSITION_TEXT;
        frame.questions = [];
        frame.response_name = RESPONSE_GENERIC;
        let ret = new FormFrame(frame, this.logger);
        return ret;
    }

    /**
     * Build intro frames for a DBT worksheet model.
     *
     * @return a list of IntroFrames
     */
    build_intro_frames() {
        // only one intro frame so far, but we'll likely add more
        let intro_frame = {};
        intro_frame.title = INTRO_TITLE;
        intro_frame.instruction = INTRO_INSTRUCTION;
        intro_frame.text = INTRO_TEXT(this.variant);
        intro_frame.template = INTRO_FRAME_TEMPLATE;
        intro_frame.is_app = true;
        return [new IntroFrame(intro_frame, this.logger)];
    }

    /**
     * Distribute N items as evenly as possible over pages, with max p items per page.
     *
     * In specific, given a number of items, N, and max per page, p,
     * determine the number of items on each page so that each page has
     * no more than one more item than another page
     *
     * N = d * b + e * c
     * b = c + 1
     * maximize b, such that b <= p
     *
     * @param N (int) - number of items
     * @param p (int) - max number of items per page
     * @return a (int) - # pages
     * @return b (int) - larger # per page
     * @return c (int) - smaller # per page
     * @return d (int) - # pages with b per page
     * @return e (int) - # pages with c per page
     */
    // awkward to return 5 values, but I did it this way for ease of unit testing
    static compute_page_counts(N, p) {
        let a = Math.ceil(N/p);
        let b = Math.ceil(N/a);
        let c = b - 1;
        let d = N - a * c;
        let e = a - d;

        return [a, b, c, d, e];
    }

    /**
     * Build body frames for a DBT worksheet model.
     *
     * @param knowledgebase - all the statements
     * @return a list of body Frames
     */
    build_body_frames(knowledgebase) {
        //// Pre-process statements

        // get all the statements for this section
        let section = this.variant;
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

        //// Create frames

        // copy the list (we'll use 1st copy to create uds later, 2nd copy to create frames now)
        let statements = merged_section_statements.concat();

        statements = _.shuffle(statements);

        // divide them into pages...

        // first, determine number of statements on each page
        let a, b, c, d, e;
        [a, b, c, d, e] = DbtWorksheetModelFwd.compute_page_counts(
            statements.length, BODY_MAX_STATEMENTS_PER_PAGE);
        let pages = [];
        // make d many pages with b many statements each
        for(let idx = 0; idx < d; idx++) {
            pages.push(statements.splice(0, b));
        }
        // make e many pages with c many statements each
        for(let idx = 0; idx < e; idx++) {
            pages.push(statements.splice(0, c));
        }

        // make a frame for each page
        let body_frames = [];
        for(let idx of Array(pages.length).keys()) {
            let page = pages[idx];
            let page_statements = [];
            for(let stmt of page) {
                page_statements.push([stmt.Statement, false, stmt.Emotions]);
            }

            let frame = {};
            frame.title = BODY_TITLE + ' ' + (idx+1);
            frame.response_name = RESPONSE_GENERIC;
            frame.template = STATEMENTS_FRAME_TEMPLATE;
            frame.question = BODY_QUESTION[this.variant];

            frame.statements = [];
            frame.is_app = true;
            for(let statement of page_statements) {
                frame.statements.push(statement);
            }
            body_frames.push(new StatementsBodyFrame(frame, this.logger));
        }

        //// Create uds
        for (let stmt of merged_section_statements) {
            let ud = new UserData(stmt.Statement, false, stmt.Emotions, RESPONSE_GENERIC);
            this.uds.add(ud);
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
        end_frame.pid = this.pid;
        end_frame.variant_slug = this.variant_slug;
        return new EndFrame(end_frame, this.logger);
    }

    /**
     * Build feedback frames
     *
     * @return the list of frames
     */
    build_feedback_frames() {
        let ret = [];
        for(let idx of [1, 2, 3]) {
            let page_string = `page_${idx}`;
            let frame = {};
            frame.template = FEEDBACK_FRAME_TEMPLATE;
            frame.title = FEEDBACK_TITLE;
            frame.instruction = FEEDBACK_INSTRUCTIONS[page_string];
            frame.questions = FEEDBACK_QUESTIONS[page_string];
            frame.qualifiers = FEEDBACK_LIKERT_OPTIONS;
            frame.values = FEEDBACK_LIKERT_VALUES;
            frame.response_name = RESPONSE_FEEDBACK;
            ret.push(new FormFrame(frame, this.logger));

            for(let question of frame.questions) {
                let text = question[0];
                let ud = new UserData(text, '', [], RESPONSE_FEEDBACK);
                this.uds.add(ud);
            }
        }

        // For the last 3 frames, shuffle order
        let platforms = FEEDBACK_PLATFORMS.concat(); // shallow copy
        platforms = DbtWorksheetModelFwd.shuffle3(this.pid, platforms);
        let order_string = `${platforms[0]}, ${platforms[1]}, and ${platforms[2]}`;

        for(let platform of platforms) {
            let frame = {};
            frame.template = FEEDBACK_FRAME_TEMPLATE;
            frame.title = FEEDBACK_TITLE;
            frame.instruction = FEEDBACK_COMPARISON_INSTRUCTION.replace(
                FEEDBACK_PLACEHOLDER, order_string);
            frame.response_name = RESPONSE_GENERIC;

            let questions = [];
            for(let q of FEEDBACK_COMPARISON_SKELETON) {
                let question = q.concat(); // make a copy
                question = question.replace(FEEDBACK_PLACEHOLDER, platform.toUpperCase());
                questions.push([question, 'text']);
                this.uds.add(new UserData(question, '', [], RESPONSE_GENERIC));
            }
            frame.questions = questions;

            ret.push(new FormFrame(frame, this.logger));
        }

        let identity_frame = {};
        identity_frame.template = FEEDBACK_FRAME_TEMPLATE;
        identity_frame.title = IDENTITY_TITLE;
        identity_frame.instruction = IDENTITY_INSTRUCTION;
        identity_frame.questions = IDENTITY_QUESTIONS;
        identity_frame.response_name = RESPONSE_FEEDBACK;
        this.uds.add(new UserData(IDENTITY_QUESTIONS[0][0], '', [], RESPONSE_FEEDBACK));
        ret.push(new FormFrame(identity_frame, this.logger));

        return ret;
    }

    /**
     * Shuffle a list of 3 things. Keys that are different mod 6 will return different
     * orderings of the list.
     * @param key (int) - determines shuffled order
     * @param src (array) - things to shuffle
     * @return a new array that is a shuffled copy of src
     */
    static shuffle3(key, src) {
        let ret = [];

        let first = key % 3;
        ret.push(src[first]);
        src.splice(first, 1);

        let second = key % 2;
        ret.push(src[second]);
        src.splice(second, 1);

        ret.push(src[0]);
        return ret;
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
        summary_frame.instruction = SUMMARY_INSTRUCTION;
        summary_frame.description = SUMMARY_TEXT;
        summary_frame.matched_emotions = [];
        summary_frame.follow_text = SUMMARY_FOLLOW_TEXT;
        summary_frame.empty_msg = SUMMARY_EMPTY_MSG;
        summary_frame.info_sheet_links = this.config.info_sheet_links;
        summary_frame.offer_ideas = this.config.offer_ideas;
        summary_frame.is_app = true;
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
     * Execute callback registered to the current frame.
     * Get and return next frame from the model.
     * It is the caller's responsibility to make sure that the next frame exists before calling.
     * Behavior undefined for nonexistent frames.
     * @return an object containing data for the next frame. based on
     *     the model's internal structure, and input passed in so far
     */
    next_frame() {
        // execute current frame's callback, if applicable
        if(this.frame_idx >= 0) {
            let template = this.frames[this.frame_idx].template;
            let callback = this.frame_callbacks.get(template);
            if (callback !== undefined) {
                callback.bind(this)();
            }

            let event = 'forward ' + this.frame_idx + ' ' + template;
            this.logger.logTimestamp(event, this.pid)
        }

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
        let template = this.frames[this.frame_idx].template;
        let event = 'back ' + this.frame_idx + ' ' + template;
        this.logger.logTimestamp(event, this.pid)

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
        this.logger.logUds(updated_uds, this.pid);
    }

    /**
     * Transfer data from this.uds to the summary frame
     */
    compute_summary() {
        // entries takes the form [ [statement, {emotion: string, response: boolean}], ...]
        let entries = this.uds.to_array();

        // filter user data for 'true' responses
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
     * @param section - (optional string) one of the sections specified in constants.js
     *   Full section name, not the slug.
     *   If undefined, section will be auto selected.
     */
    constructor(direction, section) {
        this.category = CATEGORY_DBT_WORKSHEET;
        this.direction = direction;
        this.section = section;
        this.info_sheet_links = false;
        this.offer_ideas = false;
        this.pre_post_measurement = false;
        this.self_report = false;
        this.mood_check = false;
        this.consent_disclosure = false;
        this.mood_induction = false;
        this.feedback = false;
        this.study = false;
    }

    /**
     * Setter for this.study, tells the model whether we're doing the study.
     * This flag affects:
     *   - study welcome frame
     *   - browser check frame
     *   - phq frame
     *   - we could potentially bundle more of the config items under the study flag
     *     to reduce the number of config options
     * @param value - boolean to set it to
     * @return this
     */
    set_study(value) {
        this.study = value;
        return this;
    }

    /**
     * Setter for this.feedback, tells the model whether to include feedback
     * @param value - boolean to set it to
     * @return this
     */
    set_feedback(value) {
        this.feedback = value;
        return this;
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
     * Setter for this.mood_check, tells the model whether to offer mood check at the end.
     * @param value - boolean to set it to
     * @return this
     */
    set_mood_check(value) {
        this.mood_check = value;
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

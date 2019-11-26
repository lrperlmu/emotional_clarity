"use strict";

// Constants and magic strings

// Knowledgebase keys
var KB_KEY_SECTION = 'Category';

// category
var CATEGORY_DBT_WORKSHEET = 1;
var CATEGORY_BODY_MAP = 2;

// direction
var DIRECTION_FWD = 'f';
var DIRECTION_REVERSE = 'r';

// section names (direct strings from knowledgebase)
var SECTION_PROMPTING = 'Prompting events';
var SECTION_INTERP = 'Interpretations of events';
var SECTION_BIO = 'Biological changes and experiences';
var SECTION_ACT = 'Expressions and actions';
var SECTION_AFTER = 'Aftereffects';

// Summary template types
var SUMMARY_TEMPLATE_COUNT = 'count';
var SUMMARY_TEMPLATE_QUAL = 'qual';

// Body config (all DBT worksheet models)
var BODY_STATEMENTS_PER_PAGE = 12;
var STATEMENTS_FRAME_TEMPLATE = 'statements';

// Intro frame strings
var INTRO_FRAME_TEMPLATE = 'intro';
var INTRO_TITLE = {};
INTRO_TITLE[SECTION_PROMPTING] = 'Prompting Events fwd (variant 1af)';
INTRO_TITLE[SECTION_INTERP] = 'Interperetations of Events fwd (variant 1bf)';
INTRO_TITLE[SECTION_BIO] = 'Biological Changes and Experiences fwd (variant 1cf)';
INTRO_TITLE[SECTION_ACT] = 'Expressions and Actions fwd (variant 1df)';
INTRO_TITLE[SECTION_AFTER] = 'Aftereffects fwd (variant 1ef)';

var INTRO_TEXT = 'Please answer some questions. Tap NEXT to begin';

// Body frame strings (I think we will eventually want these to be different...?)
var BODY_TITLE = 'Questions';
var BODY_QUESTION = {}
BODY_QUESTION[SECTION_PROMPTING] = 'Check the box for each thing you have experienced recently.';
BODY_QUESTION[SECTION_INTERP] = 'Check the box for each thing you have experienced recently.';
BODY_QUESTION[SECTION_BIO] = 'Check the box for each thing you have experienced recently.';
BODY_QUESTION[SECTION_ACT] = 'Check the box for each thing you have experienced recently.';
BODY_QUESTION[SECTION_AFTER] = 'Check the box for each thing you have experienced recently.';

// Likert frame strings
var LIKERT_FRAME_TEMPLATE = 'likert';
var LIKERT_TITLE = 'Likert';
var LIKERT_INSTRUCTIONS = 'Please indicate how much each statement applies to you right now (1=strongly disagree; 5=strongly agree)';

// Self report strings
var SELF_REPORT_TITLE = 'Self Report';
var SELF_REPORT_FRAME_TEMPLATE = 'self_report';
var SELF_REPORT_Q1 = 'Which emotion(s) are you feeling right now after thinking about the Reference Event?';
var SELF_REPORT_Q2 = 'How certain are you about your answer to the previous question?';
var QUALIFIERS = ['Very uncertain', 'Somewhat uncertain', 'Neutral', 'Somewhat certain', 'Very certain'];

// Summary frame strings (all DBT worksheet models)
var SUMMARY_TITLE = 'Summary';
var SUMMARY_TEXT = 'Your input for this activity suggests:';
var SUMMARY_FOLLOW_TEXT = 'Thank you for doing this activity';
var SUMMARY_COUNT_FRAME_TEMPLATE = 'summary_count';


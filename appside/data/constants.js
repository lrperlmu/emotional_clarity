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
var BODY_FRAME_TEMPLATE = 'statements';
var EMOTION_TYPE = ['anger', 'disgust', 'envy', 'fear', 'guilt', 'happiness', 'love', 'sadness', 'shame'];
var BODY_PART = ['head', 'neck', 'arms', 'chest', 'belly', 'legs'];
var SVG_URL = 'http://www.w3.org/2000/svg';

// Intro frame strings
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

// Summary frame strings (all DBT worksheet models)
var SUMMARY_TITLE = 'Summary';
var SUMMARY_TEXT = 'Your input for this activity suggests:';
var SUMMARY_FOLLOW_TEXT = 'Thank you for doing this activity';


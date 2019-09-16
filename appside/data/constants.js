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

// Intro frame strings
var INTRO_TITLE = {};
INTRO_TITLE[SECTION_PROMPTING] = 'Prompting Events fwd (variant 1af)';

var INTRO_TEXT = 'Please answer some questions. Tap NEXT to begin';

// Body frame strings
var BODY_TITLE = 'Questions';
var BODY_QUESTION = {}
BODY_QUESTION[SECTION_PROMPTING] = 'Check the box for each thing you have experienced recently.';


// Summary frame strings (all DBT worksheet models)
var SUMMARY_TITLE = 'Summary';
var SUMMARY_TEXT = 'Your input for this activity suggests:';
var SUMMARY_FOLLOW_TEXT = 'Thank you for doing this activity';


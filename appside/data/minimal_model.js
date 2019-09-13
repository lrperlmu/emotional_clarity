
// TODO: Restructure this
// Make it into its own class DbtWorksheetModelConfig
//     * one instance of that class for each variant of DbtWorksheetModel. 
//     * config instance gets passed into DbtWorksheetModel constructor
//     * Magic strings go into Magic String file
//      - most of these strings should be the same across all DbtWorksheetModels, fwd and bkwd
// 
// ---> Identify which properties here are magic strings and which affect behavior
//
// Sample App is an example of the properties that frames need to have, but 
// does not imply that they should be instantiated as hard-coded objects.
// It's ok for them to be built by the model class from scratch.
//
// As such, it's not necessary for them to be totally spare, minimizing code.
// (i.e. ok to have form objects with blanks for user input (?))
//
// Possible methods for Model
//   build_intro_frames -- shared implementation for all (different magic strings)
//   build_body_frames -- different for each Model (configured by Category for dbt wkshts)
//   build_summary_frame -- one implementation for count, one for qual.
//
var DBT_WORKSHEET_FWD_PROMPTING_EVENTS = {
    'meta': {
        'category': '1 DBT worksheets', // ** indicates DbtWorksheetModel
        'direction': 'F', // ** determines frame inclusion
        'subsection': 'Prompting events', // ** indicates a certain set of statements from knowledgebase
    },
    'intro': [
       {
            'title': 'Prompting Events fwd (variant 1af)', // specific magic string
            'text': 'Please answer some questions. Tap NEXT to begin', // generic magic string
        },
    ],
    'body': [
    ],
    'summary': [
        {
            'template': 'count', // ** type of summary construction. coupled with DbtWorksheetModel
            'title': 'Summary', // generic magic string
            'description': 'Your input for this activity suggests:', // generic magic string
            'matched_emotions': [],
            'follow_text': 'Thank you for doing this activity', // generic magic string 
            'info_sheet_links': true, // ** independent option
            'offer_ideas': true, // ** independent option
        },
    ],
}


// Constants and magic strings

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

// Intro frame strings
var INTRO_TITLE = {
    SECTION_PROMPTING: 'Prompting Events fwd (variant 1af)',
}
var INTRO_TEXT = 'Please answer some questions. Tap NEXT to begin';

// Body frame strings
var BODY_QUESTION {
    SECTION_PROMPTING: 'Check the box for each thing you have experienced recently.',
}

// Summary frame strings (all DBT worksheet models)
var SUMMARY_TITLE = 'Summary';
var SUMMARY_TEXT = 'Your input for this activity suggests:';
var SUMMARY_FOLLOW_TEXT = 'Thank you for doing this activity';


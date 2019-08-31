
var MINIMAL_MODEL = {
    'meta': {
        'category': '1 DBT worksheets',
        'direction': 'R', // read this to know whether to show the emotion selection frame
        'subsection': 'None',
    },
    'intro': [
       {
            'title': 'Minimal Model',
            'text': 'Please answer some questions. Tap NEXT to begin',
            'graphic': 'https://cf.ltkcdn.net/dogs/images/std/238299-699x450-newborn-puppie.jpg',
        },
    ],
    'body': [
        {
            'template': 'statements',
            'question': 'Check the box for each emotion you feel now.',
            'statements': [], // model fills these in based on user input
        },
    ],
    'summary': [
        {
            'template': 'qualifier',
            'title': 'Summary',
            'description': 'Your input for this activity suggests:',
            'matched_emotions': [],
            'follow_text': 'Thank you for doing this activity',
            'info_sheet_links': true,
            'offer_ideas': true,
        },
    ],
}


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

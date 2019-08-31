
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


var DBT_WORKSHEET_FWD_PROMPTING_EVENTS = {
    'meta': {
        'category': '1 DBT worksheets',
        'direction': 'F', // read this to know whether to show the emotion selection frame
        'subsection': 'Prompting events',
    },
    'intro': [
       {
            'title': 'Prompting Events fwd (variant 1af)',
            'text': 'Please answer some questions. Tap NEXT to begin',
        },
    ],
    // TODO: fill these in automatically from knowledgebase.
    'body': [
    ],
    'summary': [
        {
            'template': 'count',
            'title': 'Summary',
            'description': 'Your input for this activity suggests:',
            'matched_emotions': [],
            'follow_text': 'Thank you for doing this activity',
            'info_sheet_links': true,
            'offer_ideas': true,
        },
    ],
}


var SAMPLE_APP = {
    'meta': {
        'category': '1 DBT worksheets',
        'direction': 'R',
        'subsection': 'Prompting Events',
    },
    'intro': {
        0: {
            'title': 'Spec Testing app!',
            'text': 'Look at this lovely app, it demonstrates all the stuff in our spec :)',
            'graphic': 'https://kittentoob.com/wp-content/uploads/2018/07/Purrito-750x392.jpg',
        },
        1: {
            'title': 'Spec Testing app!',
            'text': 'The introduction has two pages',
            'graphic': 'https://i2.wp.com/metro.co.uk/wp-content/uploads/2017/07/187144066.jpg',
        },
    },

    'body': {

        // use actual classes for this.
        // make sure this definition matches with the way classes actually serialize
        0: {
            // specify which template to use.
            // depending on what this is, there will be different parameters.
            'template': 'statements',
            'title': 'Kittens',
            'question': 'Which is the best part of a kitten?',
            'statements': [
                'its purr',
                'its floof',
                'its bark',
            ],
        },
        1: {
            'template': 'bodymap_statements',
            'title': 'Body map example slide',
            'question': 'What is your favorite body part?',
            'graphic': 'neutral.png',
            'statements': [
                'Head',
                'Shoulders',
                'Knees',
                'Toes',
            ],
        },
        2: {
            'template': 'bodymap_color',
            'title': 'Body map coloring activity',
            'question': 'How much does this apply to you?',
            // graphic is built in
        },
        3: {
            'template': 'words',
            'title': 'Word selection example',
            'question': 'Which words are palindromes?',
            'words': [
                'pop',
                'purr',
                'kittens',
                'puppies',
            ],

        },
       
    },

    'summary_count': {
        'title': 'Summarific summary <3',
        'description': 'This text appears at the top of the summary! I like hedgehogs because they are so so cute.',
        'graphic': 'https://www.washingtonpost.com/resizer/xEOALOr9qrImfg4OWCupZ1OS4kQ=/1396x0/arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/ZGD2JCRBUAI6TJ2ZFOCUDO56EA.jpg',
        'type': 'count', // or qualifier

        'matched_emotions': [
            {
                'emotion': 'anger',
                //'count': 5, (see responses.length)
                'responses': [
                    'Having an important goal blocked.',
                    'You or someone you care about being attacked or threatened by others.',
                    'Losing power, status, or respect.',
                    'Not having things turn out as expected.',
                    'Physical or emotional pain.',
                ],
            },
            {
                'emotion': 'sadness',
                //'count': 5, (see responses.length)
                'responses': [
                    'Losing something or someone irretrievably.',
                    'The death of someone you love.',
                    'Things not being what you expected or wanted.',
                    'Things being worse than you expected.',
                    'Being separated from someone you care for.'
                ],
            },
            {
                'emotion': 'guilt',
                //'count': 1, (see responses.length)
                'responses': [
                    'Not doing something you said that you would do.',
                ],
            },
        ],
        'follow_text': 'In conclusion, please come pet a cuddly hedgehog for numerous therapeautic benefits!',
        'info_sheet_links': false,
        'offer_ideas': false,

    },

    'summary_qualifier': {
        'title': 'A Quality Summary',
        'description': 'This text appears at the top of the summary! Your input for this activity suggests:',
        'type': 'qualifier',
        'matched_emotions': [
            {
                'emotion': 'jealousy',
                'qualifier': 'strong',
            },
            {
                'emotion': 'envy',
                'qualifier': 'moderate',
            },
            {
                'emotion': 'sadness',
                'qualifier': 'mild',
            },
        ],
        'follow_text': 'In conclusion, please come pet a cuddly hedgehog for numerous therapeautic benefits!',
        'info_sheet_links': true,
        'offer_ideas': true,

    }


};




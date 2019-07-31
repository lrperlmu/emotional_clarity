
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
        }
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
            'title': 'Bodymap coloring activity',
            'question': 'Color in the parts that you have exercised most recently',
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

    'summary': {
        'title': 'Summarific summary <3',
        'description': 'Dangit',
        'graphic': 'https://www.washingtonpost.com/resizer/xEOALOr9qrImfg4OWCupZ1OS4kQ=/1396x0/arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/ZGD2JCRBUAI6TJ2ZFOCUDO56EA.jpg',

        'matched_emotions': {
            'type': 'count', // or qualifier
            0: {
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
            1: {
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
            2: {
                'emotion': 'guilt',
                //'count': 1, (see responses.length)
                'responses': [
                    'Not doing something you said that you would do.',
                ],
            },
        },
        'info_sheet_links': false,
        'offer_ideas': false,

    },


};




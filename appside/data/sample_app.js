"use strict";

// Sample App is an example of the properties that frames need to have, but
// does not imply that they should be instantiated as hard-coded objects.
// They should be built by the model class from scratch, to resemble the
// frames below in format.

var SAMPLE_APP = {
    'meta': {
        'category': '1 DBT worksheets',
        'direction': 'R',
        'subsection': 'Prompting Events',
    },
    'intro': {
        0: {
            'template': 'intro',
            'title': 'Spec Testing app!',
            'text': 'Look at this lovely app, it demonstrates all the stuff in our spec :)',
            'graphic': 'https://kittentoob.com/wp-content/uploads/2018/07/Purrito-750x392.jpg',
        },
        1: {
            'template': 'intro',
            'title': 'Spec Testing app!',
            'text': 'The introduction has two pages',
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
            'question': 'What makes a kitten adorable?',
            'statements': [
                ['its purr', false, 'correct'],
                ['its floof', true, 'correct'],
                ['its bark', false, 'incorrect'],
            ],
        },
        1: {
            'template': 'bodymap_statements',
            'title': 'Body map example slide',
            'question': 'What is your favorite body part?',
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
            'question': 'Research shows this is how sensation levels change for {}. How similar is this to your current state?',
            'emotions': [
                'anger', 'disgust', 'envy', 'fear', 'happiness', 'love', 'sadness', 'shame',
            ],
            'bodyparts': [
                'head', 'neck', 'chest', 'arms', 'belly', 'legs',
            ],
            'qualifiers': [
                'Very much', 'Neutral', 'Not at all', 'I don\'t know',
            ],
            'emotion': 'neutral',
            'bodypart': '',
            // graphic is built in
        },
        3: {
            'template': 'words',
            'title': 'Word selection example',
            'question': 'Which words are palindromes?',
            'words': [
                ['pop', false, 'palindrome'],
                ['radar', true, 'palindrome'],
                ['kittens', false, 'not a palindrome'],
                ['puppies', false, 'not a palindrome'],
            ],
        },
        4: {
            'template': 'bodymap_color_fwd',
            'title': 'Body map color forward',
            'texts': [
                'Select the body parts where you feel increased sensation.',
                'Select the body parts where you feel decreased sensation.',
            ],
            'colors': [
                ['black', 'red', 'yellow'],
                ['black', 'blue', 'cyan'],
            ],
        }
    },

    'likert': {
        'template': 'likert',
        'title': 'Measurement form',       
        'instructions': 'Instructions for the user here!',
        'name': '',

        'questions': [          // provided in constructor
            ['Question 1', 2],    // question text, user response 1-5
            ['Question 2', undefined],    // default answer choice = undefined
        ],
    },

    'self_report': {
        'title': 'Self Report',
        'template': 'self_report',
        'questions': [
            ['Which emotion(s) are you feeling right now after thinking about the Reference Event?', ''],
            ['How certain are you about your answer to the previous question?', 'Disagree'],
        ],
        'qualifiers': [
            'Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree',
        ],
    },

    'consent': {
        'title': 'Consent Disclosure Form',
        'template': 'consent',
        'instructions': 'Please click on the following link to read the consent disclosure form.',
        'questions': [
            ['I have read the information above. I understand the risks of this study and wish to participate.', false],
            ['I am 18 or 19 years old.', false],
            ['I am not able to read, understand, and respond to a web questionnaire written in English.', true],
        ],
    },

    'summary_count': {
        'template': 'summary_count',
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
        'template': 'summary_qualifier',
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




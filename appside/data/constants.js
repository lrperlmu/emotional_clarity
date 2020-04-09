"use strict";

// Constants, magic strings, and macros

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

// generic value for frame name (when we don't need to distinguish)
var RESPONSE_GENERIC = 'response';
var RESPONSE_PRE = 'pre';
var RESPONSE_POST = 'post';
var RESPONSE_INDUCTION = 'induction';

// Body config (all DBT worksheet models)
var BODY_STATEMENTS_PER_PAGE = 12;
var STATEMENTS_FRAME_TEMPLATE = 'statements';
var EMOTION_TYPE = ['anger', 'disgust', 'envy', 'fear', 'guilt', 'happiness', 'love', 'sadness', 'shame'];
var BODY_PART = ['head', 'neck', 'arms', 'chest', 'belly', 'legs'];
var SVG_URL = 'http://www.w3.org/2000/svg';

// Intro frame strings
var the_title = 'Emotional Clarity App';
var INTRO_FRAME_TEMPLATE = 'intro';
var INTRO_TITLE = {};
INTRO_TITLE[SECTION_PROMPTING] = the_title;
INTRO_TITLE[SECTION_INTERP] = the_title;
INTRO_TITLE[SECTION_BIO] = the_title;
INTRO_TITLE[SECTION_ACT] = the_title;
INTRO_TITLE[SECTION_AFTER] = the_title;

var INTRO_TEXT_START = 'Consider the Reference Event that you just wrote about.';
var INTRO_MAIN_TEXT = {};
INTRO_MAIN_TEXT[SECTION_PROMPTING] = 'In the following exercise, you will answer some questions about components of the Reference Event.';
INTRO_MAIN_TEXT[SECTION_INTERP] = 'In the following exercise, you will answer some questions about your interpretations of the Reference Event or thoughts you are having right now as a result.';
INTRO_MAIN_TEXT[SECTION_BIO] = 'In the following exercise, you will answer some questions about biological changes and experiences you are having right now.';
INTRO_MAIN_TEXT[SECTION_ACT] = 'In the following exercise, you will answer some questions about your actions and expressions in response to the Reference Event.';
INTRO_MAIN_TEXT[SECTION_AFTER] = 'In the following exercise, you will answer some questions about things you are likely to do, feel, or experience in the near future, now that you have recalled the Reference Event.';
var INTRO_TEXT_INFO = 'This exercise may help you reflect on your emotions and gain emotional clarity.'
var INTRO_TEXT_END = 'Tap NEXT to begin.';

function INTRO_TEXT(section) {
    return [INTRO_TEXT_START, INTRO_MAIN_TEXT[section], INTRO_TEXT_INFO, INTRO_TEXT_END];
}

// Body frame strings
var BODY_TITLE = 'Questions';
var BODY_QUESTION = {}
BODY_QUESTION[SECTION_PROMPTING] = 'Which of these are components of the Reference Event?';
BODY_QUESTION[SECTION_INTERP] = 'Which of these describe your interpretations of the Reference Event or thoughts you are having right now as a result?';
BODY_QUESTION[SECTION_BIO] = 'What biological changes or experiences you are having right now?';
BODY_QUESTION[SECTION_ACT] = 'What are your actions and expressions right now in response to the Reference Event?';
BODY_QUESTION[SECTION_AFTER] = 'What are likely to do, feel, or experience in the near future, now that you have recalled the Reference Event?';

// Mood induction frame strings
var SHORT_ANSWER_TEMPLATE = 'short_answer';
var LONG_ANSWER_TEMPLATE = 'long_answer';
var INDUCTION_TITLE = 'Reference Event';
var INDUCTION_THINKING_PROMPT = 'Think of an event in your life when someone close to you made you extremely upset. If you can think of more than one upsetting conflict, event, or experience, pick the event that still makes you the most upset and continues to feel the most unresolved. Type a one-line description of the event.';
var INDUCTION_CHAR_LIMIT = 180;
var INDUCTION_NOTE = 'This event will be referred to as the "Reference Event"';
var INDUCTION_WRITING_PROMPT = 'For the next few minutes, try to re-experience the event as vividly as you can. Picture the event happening to you all over again. Picture in your "mind\'s eye" the surroundings as clearly as possible. See the people or objects; hear the sounds; experience the events happening to you. Think the thoughts that this event makes you think. Feel the same feelings that this event makes you feel. Let yourself react as if you were actually in the middle of it right now. While you re-experience the event, write about what is happening in the situation, how the other person or people involved behaved toward you, and what you are thinking. The screen will advance on its own when the time is up. Begin writing now.';
var INDUCTION_TIME_LIMIT = 130;


// Likert frame strings
var LIKERT_FRAME_TEMPLATE = 'likert';
var LIKERT_TITLE = 'Likert';
var LIKERT_INSTRUCTIONS = 'Please indicate how much each statement applies to you right now.';

// Pre-measurement strings
var SDERS_QUESTIONS = ['I am confused about how I feel.', 'I have no idea how I am feeling.'];
var SDERS_QUALIFIERS = ['not all all', 'somewhat', 'moderately', 'very much', 'completely'];

// Self report strings
var SELF_REPORT_FRAME_TEMPLATE = 'self_report';
var SELF_REPORT_Q1 = 'Which emotion(s) are you feeling right now after thinking about the Reference Event?';
var SELF_REPORT_Q2 = 'How certain are you about your answer to the previous question?';
var QUALIFIERS = ['Very uncertain', 'Somewhat uncertain', 'Neutral', 'Somewhat certain', 'Very certain'];

// Consent disclosure frame strings
var CONSENT_FRAME_TEMPLATE = 'consent';
var CONSENT_DISCLOSURE_TITLE = 'Consent';
var CONSENT_DISCLOSURE_QUESTIONS = ['I have read the information above. I understand the risks of this study and wish to participate.',
    'I am 18 or 19 years old.',
    'I am able to read, understand, and respond to a web questionnaire written in English.'];
var CONSENT_DISCLOSURE_INSTRUCTIONS = 'Please click on the following link to read the consent disclosure form.';

// Summary frame strings (all DBT worksheet models)
var SUMMARY_TITLE = 'Summary';
var SUMMARY_TEXT = '<p>This summary shows which emotions your responses are <i>commonly</i> associated with, but they are not the <i>only</i> emotions that may be associated with your responses.</p>Please reflect on this summary to see which emotion(s), if any, resonate most with your experience of the Reference Event.';
var SUMMARY_FOLLOW_TEXT = 'Thank you for doing this activity.';
var SUMMARY_COUNT_FRAME_TEMPLATE = 'summary_count';

// End frame strings
var END_FRAME_TEMPLATE = 'end';
var END_TITLE = 'End';
var END_CODE_TEXT = 'Your unique completion code is';
var END_DIRECTIONS = `<p>Make sure to record your code before leaving this page. To receive your $12 amazon gift code, please contact the research team by emailing Leah at <a href=mailto:leahperl@uw.edu>leahperl@uw.edu</a> using the subject line "Completed Emotional Clarity Study" and write your completion code in the body of the email.</p>`;
var END_CONTACT = `<p>This study has asked you to recall potentially distressing life events. If you feel distressed after completing this study, please consider utilizing the following resources:</p>
<ul>
<li>UW Counseling Center: 206-543-1240</li>
<li>National Suicide Prevention Lifeline: 1-800-273-8255</li>
</ul>
`;

// Feedback frames
var FEEDBACK_FRAME_TEMPLATE = 'feedback';
var FEEDBACK_TITLE = 'Feedback';
var FEEDBACK_YESNO_OPTIONS = ['Yes', 'No'];
var FEEDBACK_LIKERT_OPTIONS = [
    'Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree',
];
var FEEDBACK_QUESTIONS = {
    'page_1': [
        ['Did the app help you figure out your emotion(s)?', 'yesno'],
        ['Which specific parts of the app were most helpful and why?', 'text'],
    ],
    'page_2': [
        ['Which features did you like the most?', 'text'],
        ['Which features did you like the least?', 'text'],
        ['What would you add or change, and why?', 'text'],
    ],
    'page_3': [
        ['I would use this app in real life.', 'likert'],
        ['This app would be useful to me in the future.', 'likert'],
        ['In which future situations or moments would you want to use this app most?', 'text'],
    ],
};

var FEEDBACK_PLATFORMS = ['Phone', 'Computer', 'Robot'];
var FEEDBACK_COMPARISON_INSTRUCTION = 'Suppose this app is made available on three different platforms: {}.';
var FEEDBACK_PLACEHOLDER = '{}';
var FEEDBACK_COMPARISON_SKELETON = [
    'How likely are you to use it on {}, and why?',
    'In which situations would you prefer {} over the others?',
];

// start frame
var START_FRAME_TEMPLATE = 'start';
var START_TITLE = 'Emotional Clarity Study';
var START_INSTRUCTION = '';
var START_QUESTIONS = [
    ['Enter email address to begin', 'text'],
    [' ', 'entry_code_button'],
];
var START_BUTTON_TEXT = 'verify';

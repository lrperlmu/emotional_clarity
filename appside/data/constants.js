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

// variant id slugs
var VARIANT_PROMPTING = 'prompting';
var VARIANT_INTERP = 'interp';
var VARIANT_BIO = 'bio';
var VARIANT_ACT = 'act';
var VARIANT_AFTER = 'after';
var VARIANT_SLUGS = [VARIANT_PROMPTING, VARIANT_INTERP, VARIANT_BIO,
                     VARIANT_ACT, VARIANT_AFTER];

// slug: full name
// variant = VARIANT_LOOKUP.get(slug);
let VARIANT_LOOKUP = new Map([
    [VARIANT_PROMPTING, SECTION_PROMPTING],
    [VARIANT_INTERP, SECTION_INTERP],
    [VARIANT_BIO, SECTION_BIO],
    [VARIANT_ACT, SECTION_ACT],
    [VARIANT_AFTER, SECTION_AFTER],
]);

// generic value for frame name (when we don't need to distinguish)
var RESPONSE_GENERIC = 'response';
var RESPONSE_PHQ = 'phq';
var RESPONSE_PRE = 'pre';
var RESPONSE_POST = 'post';
var RESPONSE_INDUCTION = 'induction';
var RESPONSE_MOOD = 'mood';
var RESPONSE_FEEDBACK = 'feedback';

// Body config (all DBT worksheet models)
var BODY_MAX_STATEMENTS_PER_PAGE = 12;
var STATEMENTS_FRAME_TEMPLATE = 'statements';
var EMOTION_TYPE = ['anger', 'disgust', 'envy', 'fear', 'guilt', 'happiness', 'love', 'sadness', 'shame'];
var BODY_PART = ['head', 'neck', 'arms', 'chest', 'belly', 'legs'];
var SVG_URL = 'http://www.w3.org/2000/svg';

// Welcome frame (study)
var SW_FRAME_TEMPLATE = 'study-welcome';
var SW_TITLE = 'Welcome to the Emotional Clarity Study';
var SW_TEXT = 'Thank you for volunteering for this study.';

// Browser check frame
var BC_FRAME_TEMPLATE = 'browser-check';
var BC_TITLE = 'Please use a desktop browser';
var BC_TEXT = 'We didn\'t test this app on small screens or touch screens, you might not be able to complete the study on a mobile device. Please use google chrome browser on a laptop or desktop.';

// Transition frame
var TRANSITION_FRAME_TEMPLATE = 'transition';
var PRE_TRANSITION_TITLE = 'Prepare to use the app';
var PRE_TRANSITION_TEXT= 'Next you will use the Emotional Clarity App. Consider the Reference Event that you just wrote about and the emotions related to this event while you are using the app.';
var POST_TRANSITION_TITLE = 'Thanks for completing the exercise';
var POST_TRANSITION_TEXT = 'Next you will be asked to repeat to the rating scales you completed before using the Emotional Clarity App and answer a few questions about the exercise you just completed with the app.';

// Intro frame strings
var INTRO_FRAME_TEMPLATE = 'intro';
var INTRO_TITLE = 'Emotional Clarity App';
var INTRO_INSTRUCTION = 'Welcome!';
var INTRO_MAIN_TEXT = {};
var INTRO_TEXT_START = 'This app will guide you through an exercise that aims to help you reflect on your emotions and gain clarity about your current emotions.';
INTRO_MAIN_TEXT[SECTION_PROMPTING] = 'In this exercise, you will answer some questions about components of the events that triggered your emotions.';
INTRO_MAIN_TEXT[SECTION_INTERP] = 'In this  exercise, you will answer some questions about your interpretations of events or thoughts you are having right now as a result.';
INTRO_MAIN_TEXT[SECTION_BIO] = 'In this  exercise, you will answer some questions about biological changes and experiences that might be related to your emotions.';
INTRO_MAIN_TEXT[SECTION_ACT] = 'In this  exercise, you will answer some questions about your actions and expressions in response to events.';
INTRO_MAIN_TEXT[SECTION_AFTER] = 'In this  exercise, you will answer some questions about things you are likely to do, feel, or experience as a result of your emotions.';
var INTRO_TEXT_INFO = '';
var INTRO_TEXT_END = 'Tap NEXT to begin.';

function INTRO_TEXT(section) {
    return [INTRO_TEXT_START, INTRO_MAIN_TEXT[section]];
}

// phq frame strings
var PHQ_FRAME_TEMPLATE = 'phq';
var PHQ_TITLE = 'Screening questionnaire: PHQ-9';
var PHQ_TEXT = 'Over the last two weeks, how often have you been bothered by any of the following problems?';
var PHQ_QUESTIONS = [
    ['Little interest or pleasure in doing things?', 'phq', true],
    ['Feeling down, depressed, or hopeless?', 'phq', true],
    ['Trouble falling or staying asleep, or sleeping too much?', 'phq', true],
    ['Feeling tired or having little energy?', 'phq', true],
    ['Poor appetite or overeating?', 'phq', true],
    ['Feeling bad about yourself - or that you are a failure or have let yourself or your family down?', 'phq', true],
    ['Trouble concentrating on things, such as reading the newspaper or watching television?', 'phq', true],
    ['Moving or speaking so slowly that other people would have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?', 'phq', true],
    ['Thoughts that you would be better off dead, or of hurting yourself in some way?', 'phq', true],
];
var PHQ_OPTIONS = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];
var PHQ_OPTION_VALUES = [0, 1, 2, 3];

// phq result frame strings
var PHQR_FRAME_TEMPLATE = 'phq_result';
var PHQR_TITLE = 'Results of PHQ-9 Screening Questionnaire';
var PHQR_TEXT_NO = 'This study presents unnecessary risk to people experiencing moderate to severe depression because it asks participants to relive a negative emotional experience. Your PHQ-9 result indicates that you may be experiencing moderate to severe depression and should not participate in the study.';
var PHQR_TEXT_YES = 'Your PHQ-9 result indicates that you may continue with the study.';
var PHQ_LOWEST_FAIL = 10;

// Body frame strings
var BODY_TITLE = 'Question';
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
var INDUCTION_WRITING_PROMPT = 'For the next few minutes, try to re-experience the event as vividly as you can. Picture the event happening to you all over again. Picture in your "mind\'s eye" the surroundings as clearly as possible. See the people or objects; hear the sounds; experience the events happening to you. Think the thoughts that this event makes you think. Feel the same feelings that this event makes you feel. Let yourself react as if you were actually in the middle of it right now. While you re-experience the event, write about what is happening in the situation, how the other person or people involved behaved toward you, and what you are thinking. You can move on to the next screen when the time is up. Begin writing now.';
var INDUCTION_TIME_LIMIT = 3; // Reduce for testing/debugging

// Likert frame strings
var LIKERT_FRAME_TEMPLATE = 'likert';
var LIKERT_FRAME_TITLE = 'Self Assessment';
var LIKERT_TITLE = 'Likert';
var LIKERT_INSTRUCTIONS = 'Please indicate how much each statement applies to you right now.';

// Pre-measurement strings
var SDERS_QUESTIONS = ['I am confused about how I feel.', 'I have no idea how I am feeling.'];
var SDERS_QUALIFIERS = ['not all all', 'somewhat', 'moderately', 'very much', 'completely'];
var SDERS_VALUES = [0, 1, 2, 3, 4];

// Mood check frame strings
var MOOD_FRAME_TEMPLATE = 'mood_check';
var MOOD_FRAME_TITLE = 'Mood Assessment';
var MOOD_TITLE = 'Likert';
var MOOD_INSTRUCTIONS = 'Please answer the following questions about your current mood.';
var MOOD_LOWEST_FAIL = 3;

// Pre-measurement strings
var MOOD_QUESTIONS = ['How distressed are you right now?', 
    'How sad are you right now?',
    'How upset are you right now?',
    'How nervous are you right now?'];
var MOOD_QUALIFIERS = ['very slightly or not at all', 'a little', 'moderately', 'quite a bit', 'extremely'];
var MOOD_VALUES = [0,1,2,3,4];
var POSITIVE_INDUCTION_TEMPLATE = 'positive_induction';
var POSITIVE_INDUCTION_TITLE = 'Address your negative mood';
var POSITIVE_INDUCTION_WRITING_PROMPT = '<p>The results of your mood assessment suggest that you may still have lingering negative emotions from recalling a memory. We would like to have you review another memory, one that made you happy.</p>' + 
    '<p>Think of one event in your life when someone close to you made you feel <b>happy</b>. If you think of more than one event, try to pick one that continues to bring up some pleasant feelings right now. </p>' + 
    '<p>For the next few minutes, try to re-experience the event as vividly as you can. Picture the event happening to you all over again. Picture in your "mind\'s eye" the surroundings as clearly as possible. See the people or objects; hear the sounds; experience the events happening to you. Think the thoughts that this event makes you think. Feel the same feelings that this event makes you feel. Let yourself react as if you were actually in the middle of it right now. While you re-experience the event, write about what is happening in the situation, how the other person or people involved behaved toward you, and what you are thinking. You can move on to the next screen when the time is up. Begin writing now.</p>';


// Self report strings
var SELF_REPORT_FRAME_TEMPLATE = 'self_report';
var SELF_REPORT_TITLE = 'Identify your emotions';
var SELF_REPORT_Q1 = 'Which emotion(s) are you feeling right now in relation to the Reference Event?';
var SELF_REPORT_Q2 = 'How certain are you about your answer to the previous question?';
var SELF_REPORT_QUALIFIERS = ['very uncertain', 'somewhat uncertain', 'neutral', 'somewhat certain', 'very certain'];
var SELF_REPORT_VALUES = [0, 1, 2, 3, 4];

// Consent disclosure frame strings
var CONSENT_FRAME_TEMPLATE = 'consent';
var CONSENT_DISCLOSURE_TITLE = 'Consent';
var CONSENT_DISCLOSURE_QUESTIONS = ['I have electronically signed the consent form.',];
var CONSENT_DISCLOSURE_INSTRUCTIONS = 'After volunteering for the study, you should have received an email to record your electronic consent using DocuSign. If you have not had a chance to electronically sign the consent form, please email Leah Perlmutter <leahperl@uw.edu>.';


// Summary frame strings (all DBT worksheet models)
var SUMMARY_TITLE = 'Your Emotions';
var SUMMARY_INSTRUCTION = 'Based on your responses';
var SUMMARY_TEXT = '<p>Your responses are <i>commonly</i> associated with the following emotions, but they are not the <i>only</i> emotions that may be associated with your responses.';
var SUMMARY_FOLLOW_TEXT = 'Please reflect on this summary to see which emotion(s), if any, you might actually be experiencing.';
var SUMMARY_COUNT_FRAME_TEMPLATE = 'summary_count';

// End frame strings
var END_FRAME_TEMPLATE = 'end';
var END_TITLE = 'End';
var END_CODE_TEXT = 'Your unique completion code is';
var END_DIRECTIONS = `<p>Make sure to record your code before leaving this page. To receive your $12 amazon gift code, please contact the research team by emailing Leah at <a href=mailto:leahperl@uw.edu>leahperl@uw.edu</a> using the subject line "Completed Emotional Clarity Study" and write your completion code in the body of the email.</p>`;

var END_CONTACT = `<p>Please be aware that your responses will not be checked in real time. Here are some resources that can help if you're feeling distressed.</p>
<ul>
<li>People you know
  <ul>
    <li>Your treatment providers and other supportive people you know</li>
  </ul>
</li>
<li>Now Matters Now
  <ul>
    <li>Website with videos for managing the most painful moments of life, based on Dialectical Behavior Therapy (DBT)</li>
    <li><a href="https://www.nowmattersnow.org">nowmattersnow.org</a></li>
  </ul>
</li>
<li>King County Crisis Hotline
  <ul>
    <li> Provides immediate help to individuals, families, and friends of people in emotional crisis </li>
    <li>(206) 461-3222</li>
  </ul>
</li>
<li>UW Mental Health Resources (only available to UW students)
  <ul>
    <li>Two options for mental health care on campus</li>
    <li><a href=
https://wellbeing.uw.edu/topic/mental-health">wellbeing.uw.edu/topic/mental-health</a></li>
  </ul>
</li>
</ul>
<p>If you have questions or concerns about this research, please contact the research team by emailing Leah at <a href=mailto:leahperl@uw.edu>leahperl@uw.edu</a>.
`;

// Feedback frames
var FEEDBACK_FRAME_TEMPLATE = 'feedback';
var FEEDBACK_TITLE = 'Feedback';
var FEEDBACK_YESNO_OPTIONS = ['Yes', 'No'];
var FEEDBACK_YESNO_VALUES = [1, 0];
var FEEDBACK_LIKERT_OPTIONS = [
    'Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree',
];
var FEEDBACK_LIKERT_VALUES = [5, 4, 3, 2, 1];

var FEEDBACK_INSTRUCTIONS = {
    'page_1': 'Please indicate your agreement with the following statements.',
    'page_2': '',
    'page_3': 'Please indicate your agreement with the following statements.'
};

var FEEDBACK_QUESTIONS = {
    'page_1': [
        ['The app helped me better understand my emotion(s).', 'likert', true],
        ['The app made me realize I had certain emotions that I did not realize before.', 'likert', true],
        ['The app made me more certain about the emotions I thought I have.', 'likert', true],
        ['The app helped me understand why I had certain emotions.', 'likert', true],
        ['The app helped me understand the link between my emotions and my thoughts and actions.', 'likert', true],
        ['Which specific parts of the app were most helpful and why?', 'text', true],
    ],
    'page_2': [
        ['What did you like about the app?', 'text', true],
        ['What did you dislike about the app?', 'text', true],
        ['What would you add or change, and why?', 'text', true],
    ],
    'page_3': [
        ['I would use this app in real life.', 'likert', true],
        ['This app would be useful to me in the future.', 'likert', true],
        ['In which future situations would you want to use this app most?', 'text', true],
    ],
};

var FEEDBACK_PLATFORMS = ['Phone', 'Computer', 'Robot'];
var FEEDBACK_COMPARISON_INSTRUCTION = 'Suppose this app is made available on three different platforms: {}.';
var FEEDBACK_PLACEHOLDER = '{}';
var FEEDBACK_COMPARISON_SKELETON = [
    'How likely are you to use it on {}, and why?',
    'In which situations would you prefer {} over the others?',
];

var IDENTITY_TITLE = 'Opt In for Future Studies';
var IDENTITY_INSTRUCTION = 'If you would like to be informed about future studies related to this one, please share your contact information.';
var IDENTITY_QUESTIONS = [['Email address (optional):', 'shorttext']];


"use strict";

/**
 * Rendering (View) code for body frames
 * @author Leah Perlmutter
 */


/**
 * Supports manual testing of each frame type, excluding navigation panel.
 * Use the query string to specify which frame type to render.
 */
$(document).ready(function() {
    // Add new test methods here!
    // query_string : method to call
    let test_methods = {
        'statements': statements_frame_main,
        'words': words_frame_main,
    };
    let page_types = Object.keys(test_methods);
    let page_to_show = page_types[0];

    // see if a frame type was written in the query string, otherwise use default
    let query_string = location.search;
    if (query_string.length > 0) {
        let query = query_string.substring(1, query_string.length);
        if (page_types.includes(query)) {
            page_to_show = query;
        }
    }

    let test_fcn = test_methods[page_to_show];
    test_fcn();
});

/*
  Each test method below manually obtains some data representing the given frame type
  and constructs a frame renderer from that data.

  In the full app, the Navigation module will construct frame renderers. This
  lets us test frame rendering without depending on the Navigation module.
*/

function words_frame_main() {
    // get the sample app data
    let sample_app = SAMPLE_APP;
    let frame = sample_app.body[3];

    render_words_frame(frame);
}

function statements_frame_main() {
    // get the sample app data
    let sample_app = SAMPLE_APP;
    let frame = sample_app.body[0];

    render_statements_frame(frame);
}

/*
  End test methods
*/

/**
 * Render a frame whose template is 'words'. The words will be rendered as
 *   a list of checkboxes.
 * 
 * @param frame -- Object containing the frame's data. Expected fields:
 *    frame.template -- The exact string 'words'
 *    frame.title (string) -- The frame's title
 *    frame.question (string) -- Text to appear before the list of statements
 *    frame.words (list of string) -- Words that the user can check or uncheck
 *  Behavior undefined if frame does not have these properties.
 * 
 * @require -- DOM must have a div whose ID is 'frame'
 * 
 * @effects -- Does not preserve former content of <div id="frame">.
 *     Renders the data from the argument into that div.
 * 
 **/
function render_words_frame(frame) {
    // for now, just change words to statements and use the statement renderer
    // later, we might try using multiple columns.
    let st_frame = {
        'template': 'statements',
        'title': frame.title,
        'question': frame.question,
        'statements': frame.words,
    }
    render_statements_frame(st_frame);

}

/**
 * Render a frame whose template is 'statements'. The statements will be rendered as
 *   a list of checkboxes.
 * 
 * @param frame -- Object containing the frame's data. Expected fields:
 *    frame.template -- The exact string 'statements'
 *    frame.title (string) -- The frame's title
 *    frame.question (string) -- Text to appear before the list of statements
 *    frame.statements (list of string) -- Statements that the user can agree or disagree with
 *  Behavior undefined if frame does not have these properties.
 * 
 * @require -- DOM must have a div whose ID is 'frame'
 * 
 * @effects -- Does not preserve former content of <div id="frame">.
 *     Renders the data from the argument into that div.
 * 
 **/
function render_statements_frame(frame_data) {

    // make a new empty div with id frame, not yet in the dom
    let frame = document.createElement('div'); 
   $(frame).attr('id', 'frame');
    
    // insert a h2 node for the title
    let title = document.createElement('h2');
    $(title).text(frame_data.title);
    frame.appendChild(title);

    // insert a p node for the question
    let question = document.createElement('p');
    $(question).text(frame_data.question);
    frame.appendChild(question);
    
    // Insert a checkbox list for the statements
    let statements = document.createElement('div');
    let i = 0;
    for (let statement of frame_data.statements) {
        let name = 'stmt' + i;
        i += 1;

        // the actual checkbox
        let input = document.createElement('input');
        $(input).attr('type', 'checkbox');
        $(input).attr('name', name);
        statements.appendChild(input);

        // label that can also be clicked to select the checkbox
        let label = document.createElement('label');
        $(label).attr('for', name);
        $(label).text(statement);
        statements.appendChild(label);
        
        statements.appendChild(document.createElement('br'));
    }
    frame.appendChild(statements);

    let old_frame = $('#frame')[0];
    old_frame.replaceWith(frame);

}

/**
Example object to render

{
    'template': 'statements',
    'title': 'Kittens',
    'question': 'Which is the best part of a kitten?',
    'statements': [
        'its purr',
        'its floof',
        'its bark',
    ],
},

**/

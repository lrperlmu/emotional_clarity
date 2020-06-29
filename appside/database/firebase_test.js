"use strict";

// Sandbox for making the firebase code work.
$(document).ready(function() {
    let logger = new Logger();
    logger.logTimestamp('logger1_my_event');

    let responses = new Map([
        ['hello', 'kitty'],
        ['fluffer', 'nuffin'],
    ]);

    console.log(responses)
    logger.logResponses(responses);
});

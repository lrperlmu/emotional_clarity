"use strict";

// Sandbox for making the firebase code work.
$(document).ready(function() {
    let logger = new Logger();
    logger.logTimestamp('logger1_my_event');

    let ud1 = new UserData('How iz?', 'fineook', 'heppy', 'meow');
    let ud2 = new UserData('Who am?', 'meeee', 'zoomy', 'maow');

    let responses = new UserDataSet();
    responses.add(ud1);
    responses.add(ud2);

    console.log(responses)
    logger.logUds(responses);
});

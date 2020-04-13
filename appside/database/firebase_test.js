"use strict";

// Sandbox for making the firebase code work.
$(document).ready(function() {
    // let logger = new Logger();
    // logger.logTimestamp('logger1_my_event');

    // let ud1 = new UserData('How iz?', 'fineook', ['heppy'], 'meow');
    // let ud2 = new UserData('Who am?', 'meeee', ['zoomy'], 'maow');

    // let responses = new UserDataSet();
    // responses.add(ud1);
    // responses.add(ud2);

    // console.log(responses)
    // logger.logUds(responses);

    let logger = new Logger();
    let pid_promise = logger.newPid();

    let pid;
    pid_promise.then((err, written, data_snapshot) => {
        if(err) {
            console.log('error', err);
        }
        console.log('val', data_snapshot.val());
        pid = data_snapshot.val();
        console.log(pid);
    });

    

    // pid_promise.then(pid => {
    //     console.log('the promised pid', pid);
    // });

});

// DON'T CHANGE, can append


                // // onComplete function
                // function(err, written, data_snapshot) {
                //     if(err) {
                //         console.log('error', err);
                //     }
                //     console.log('val', data_snapshot.val());
                //     pid = data_snapshot.val();
                // },

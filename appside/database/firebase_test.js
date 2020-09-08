"use strict";

// Sandbox for making the firebase code work.
$(document).ready(function() {

});

/**
 * Do a couple things with uds
 */
function test_uds() {
    let pid = 9999;

    let logger = new Logger();
    logger.logTimestamp('logger1_my_event', pid);

    let ud1 = new UserData('How iz?', 'fineook', ['heppy'], 'meow');
    let ud2 = new UserData('Who am?', 'meeee', ['zoomy'], 'maow');

    let responses = new UserDataSet();
    responses.add(ud1);
    responses.add(ud2);

    console.log(responses, pid)
    logger.logUds(responses, pid);
}


/**
 * Increment and read the pid value
 * Example code of how to use it irl
 */
function test_atomic_new_pid() {
    let logger = new Logger();

    let pid_promise = logger.incrementPid();
    pid_promise.then(result => {
        console.log('written', result.committed);
        console.log('snapshot value', result.snapshot.val());
    });
    pid_promise.catch(error => {
        console.error('failed', error);
    });
}


/**
 * Read, increment atomically, then read again.
 * Example code of how NOT to use it irl.
 * Note: This usage is subject to RACE CONDITIONS, e.g.:
 *    client 1: increment
 *    client 2: increment
 *    client 1: read
 *    client 2: read
 * @throws error if difference between pre and post values is not 1
 */
function test_new_pid() {
    let logger = new Logger();

    let read_promise = logger.getPid();
    read_promise.then(snapshot => {
        console.log('read value', snapshot.val());
    });

    let pid_promise = read_promise
        .then(logger.incrementPid.bind(logger))
        .then(logger.getPid);
    pid_promise.then(snapshot => {
        console.log('incremented value', snapshot.val());
    });

    Promise.all([read_promise, pid_promise]).then(values => {
        let [old, cur] = values;
        let difference = cur.val() - old.val();
        if(difference !== 1) {
            // may throw due to race conditions
            throw Error('should increment by 1');
        }
    });
}

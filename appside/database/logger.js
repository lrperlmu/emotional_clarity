"use strict";

/**
 * For logging data to firebase
 */
class Logger {
    /**
     * Initialize the logger and open a connection to the cloud database
     * 
     * @requires - no other logger has been constructed (singleton)
     */
    constructor() {
        // Unique but non-secret identifiers.
        // For more info and to configure security, see:
        //     https://firebase.google.com/docs/web/setup
        //     https://firebase.google.com/docs/projects/learn-more
        //     https://firebase.google.com/docs/database/security/quickstart
        var firebaseConfig = {
            apiKey: "AIzaSyBJB60vHefTp2wAH749dLLWFEW7vM3MtPE",
            authDomain: "emotional-clarity.firebaseapp.com",
            databaseURL: "https://emotional-clarity.firebaseio.com",
            projectId: "emotional-clarity",
            storageBucket: "emotional-clarity.appspot.com",
            messagingSenderId: "650523646400",
            appId: "1:650523646400:web:829a780d6fcc9351"
        };

        // Initialize Firebase
        try {
            let init = firebase.initializeApp(firebaseConfig);
        } catch (err) {
            console.error('Cannot initialize logger: firebase connection failed');
            throw err;
        }

        let auth = firebase.auth();
        // returns a Promise that will store the user credentials when resolved
        this.signIn = auth.signInAnonymously();
    }

    /**
     * Stores responses into the database. Overwrites any values previously logged
     * using this method in the current session. Keys and values of the input map will
     * be cleaned of illegal characters and stored as strings.
     *
     * Data is stored in app-responses subtree, under current uid and pid,
     *   as {name/question: response}
     *
     * @param uds (UserDataSet) - the data to write into firebase
     * @param pid (int) - participant id
     */
    logUds(uds, pid) {
        this.signIn.then(credential => {
            for(let ud of uds) {
                // clean the strings.
                let name = this.encodeString(ud.name);
                let question = this.encodeString(ud.question);
                let response = this.encodeString(ud.response.toString());

                // pack them into an object as required by firebase
                let update_data = {};
                update_data[question] = response;

                // store them one by one so as not to overwrite existing content.
                firebase.database()
                    .ref(`app-responses/${credential.user.uid}/pid${pid}/${name}`)
                    .update(update_data);
            }
        });
    }

    /**
     * Log a timestamp to the database. Overwrites any timestamp previously logged
     * in the current session with the current name.
     * 
     * Data is stored in events subtree, under current uid and pid,
     *   as {event_name: timestamp}
     *
     * @param event_name - string saying the name of the event
     * @pid (int) - participant id
     */
    logTimestamp(event_name, pid) {
        this.signIn.then(credential => {
            let ref = firebase.database().ref(`events/${credential.user.uid}/pid${pid}`);
            let data = {};
            // using date as the key allows the same event to be logged more than once
            // e.g. when navigating back and forward over the same frame
            let key = '' + (new Date().toISOString().replace(/\./g, ':'));
            data[key] = event_name;
            ref.update(data);
        });
    }

    /**
     * Log the given user's competion code. Overwrites the last one logged for this user.
     * 
     * Data is stored in completion_codes subtree, under current uid, 
     *   as {pid: completion_code}
     *
     * @param code - the code to log
     * @param pid (int) - participant id
     */
    logCompletionCode(code, pid) {
        this.signIn.then(credential => {
            let ref = firebase.database().ref(`completion_codes/${credential.user.uid}`);
            let data = {};
            let key = `pid${pid}`;
            data[key] = code;
            ref.update(data);
        });
    }

    // return promise that contains the data snapshot
    // Using this with incrementPid is subject to race conditions.
    // Instead, use the snapshot in the return value from incrementPid
    getPid() {
        let promise = firebase.database().ref('pid/counter').once('value');
        return promise;
    }

    /**
     * Record the current user's user id and pid
     * Data is stored in pid subtree, as {uid/timestamp: pid}
     * @param pid - participant id to record
     */
    logUserPid(pid) {
        this.signIn.then(credential => {
            let ref = firebase.database().ref(`pid/${credential.user.uid}`);
            let data = {};
            let key = '' + (new Date().toISOString().replace(/\./g, ':'));
            data[key] = pid;
            ref.update(data);
        });
    }

    /**
     * Generate a new participant id
     *
     * @return promise that will reject with an error or
     *  resolve with a transaction result `tr` with these properties:
     *      tr.committed - boolean true if committed, false otherwise
     *      tr.snapshot - data snapshot at end of transaction
     *   (note: ^ this return value is not well documented in the firebase docs
     *    I've inferred these properties experimentally)
     */
    incrementPid() {
        let increment_counter = count => {
            // increment or initialize the count, and re-store
            let ret = (count || 0) + 1;
            return ret;
        };

        let transaction = function(credential) {
            return firebase.database().ref('pid/counter').transaction(
                increment_counter,
            );
        };

        return this.signIn.then(transaction);

        /*
        // conceptual map

        // return promise that resolves with credential
        signIn

        // param credential
        // atomically call increment_counter on ref(pid/counter)
        // return promise that resolves to transacion result containing pid
        .then(transaction)
        */
    }

    // determine which app variant this pid should have
    // assign variant so as to balance variants for this epoch
    getAppVariant(pid) {
        /*
          app-variant {
              counts: {
                  prompting: {
                      assign:, n1,
                      start: n2,
                      complete: n3,
                  },
                  interp: {...},
                  bio: {...},
                  ...,
              }
              uid: {
                  pid: {
                      assign-vid: timestamp,   // log in build frames
                      start-vid: timestamp,    // log after passing phq
                      complete-vid: timestamp, // log after receiving completion code
                  },
              uid: {...},

        */

        console.log('get app variant');
        console.log('this', this);

        let read_counts = function(credential) {
            return firebase.database()
                .ref('app-variant/counts')
                .once('value');
        };

        let compute_variant = function(counts) {
            return new Promise(function(resolve, reject) {
                console.log(counts);
                let tree = counts.val();
                console.log(tree);

                // here, actually decide which variant to use

                // placeholder resolve value
                resolve('variant foo');
            });
        };

        // return promise that resolves with credential
        return this.signIn

            // param credential
            // read the counts
            // return promise that resolves with counts tree in a DataSnapshot
            .then(read_counts)

            // param Data Snashot containing counts tree
            // decide which variant to use
            // return promise that resolves with that variant
            .then(compute_variant);
    }


        /*
        // placeholder implementation
        let determineVariant = function(resolve, reject) {
            // shortcut -- replace me
            // determine variant based on pid
            let variants = VARIANT_SLUGS;
            let idx = pid % variants.length;
            let variant = variants[idx];
            resolve(variant);
        }

        return new Promise(determineVariant);
        */


        /*
        let computeVariant = function(variantTable) {

            console.log(variantTable);

            // TODO:
            // count existing completed variants
            // use existing started variants as a tie breaker

            // shortcut -- replace me
            // determine variant based on pid
            let variants = VARIANT_SLUGS;
            let idx = pid % variants.length;
            let variant = variants[idx];
            return variant;
        };

        let extractVariant = function(transaction_result) {
            return new Promise(function(resolve, reject) {
                console.log(transaction_result.snapshot.val());

                // todo: return the current variant
                resolve('variantfoo');
            });
        };

        let transaction = function(credential) {

            // DEBUG starting here.
            // NOTE: need to aggregate the variants in a structure that
            //       is publicly read and writable like pid/counter
            let ref = firebase.database().ref('app-variant/counts');
            return ref.transaction(computeVariant);
        };


        let transaction_result = this.signIn.then(transaction);
        let variant = transaction_result.then(extractVariant);
        return variant;
        */
        /*
        // return promise that resolves with credential
        this.signIn
            // param credential
            // call computeVariant in a transaction
            // return promise that resolves in transaction result
            .then(transaction)

            // param transaction result
            // extract 
            .then(extract_variant);

        */

    logVariantEvent(pid, event, variant) {
        // log this event-variant privately under the given uid/pid
        this.signIn.then(credential => {
            let ref = firebase.database().ref(`app-variant/${credential.user.uid}/pid${pid}`);
            let data = {};
            let key = event + '-' + variant;
            data[key] = new Date().toISOString().replace(/\./g, ':');
            ref.update(data);
        });

        // Increment public counter for this variant/event
        let increment_counter = function(count) {
            let ret = (count || 0) + 1;
            return ret;
        };
        let transaction = function(credential) {
            return firebase.database()
                .ref(`app-variant/counts/${variant}/${event}`)
                .transaction(increment_counter);
        };
        this.signIn.then(transaction);
    }

    logAssignVariant(pid, variant) {
        this.logVariantEvent(pid, 'assign', variant);
    }

    logStartVariant(pid, variant) {
        this.logVariantEvent(pid, 'start', variant);
    }

    logCompleteVariant(pid, variant) {
        this.logVariantEvent(pid, 'complete', variant);
    }


    /**
     * Transform a string so it's suitable for storing in firebase
     * @param str (string)
     */
    encodeString(str) {
        // replace each illegal char with its URI encoding
        // '%' is also replaced since it's the escape character for the encodings
        return str.replace(/\%/g, '%25')
            .replace(/\./g, '%2E')
            .replace(/\$/g, '%24')
            .replace(/\[/g, '%5B')
            .replace(/\]/g, '%5D')
            .replace(/\#/g, '%23')
            .replace(/\//g, '%2F');
    }
}

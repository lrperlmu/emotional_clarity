"use strict";

$(document).ready(function() {
    let knowledgebase = KNOWLEDGEBASE_DATA;
    //let config = FWD_PROMPTING_CONFIG;
    //let config = new DbtWorksheetModelConfig(DIRECTION_FWD, SECTION_PROMPTING);
    //let config = new DbtWorksheetModelConfig(DIRECTION_FWD, SECTION_AFTER);
    let config = new DbtWorksheetModelConfig(DIRECTION_FWD, SECTION_BIO);
    config.set_study(false);
    config.set_consent_disclosure(false);
    config.set_mood_induction(false);
    config.set_self_report(false);
    config.set_pre_post_measurement(true);
    config.set_feedback(true);

    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, config, logger);
    model.initialize.then(() => {
        let nav = new Nav(model, logger);
        nav.render();
    });
});

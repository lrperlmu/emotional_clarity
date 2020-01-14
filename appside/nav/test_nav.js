"use strict";

$(document).ready(function() {
    let knowledgebase = KNOWLEDGEBASE_DATA;
    //let config = FWD_PROMPTING_CONFIG;
    let config = new DbtWorksheetModelConfig(DIRECTION_FWD, SECTION_PROMPTING);
    config.set_self_report(true);
    //config.set_pre_post_measurement(true);
    //config.set_consent_disclosure(true);

    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, config, logger);
    let nav = new Nav(model, logger);
    nav.render();
});

"use strict";

$(document).ready(function() {
    let knowledgebase = KNOWLEDGEBASE_DATA;
    let config = FWD_PROMPTING_CONFIG;
    let logger = new Logger();
    let model = new DbtWorksheetModelFwd(knowledgebase, config, logger);
    let nav = new Nav(model, logger);
    nav.render();
});

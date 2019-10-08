"use strict";

$(document).ready(function() {
    let knowledgebase = KNOWLEDGEBASE_DATA;
    let config = FWD_PROMPTING_CONFIG;
    let model = new DbtWorksheetModelFwd(knowledgebase, config);
    let nav = new Nav(model);
    nav.render();
});

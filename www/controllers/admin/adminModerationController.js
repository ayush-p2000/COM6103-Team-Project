/*
 * This controller should handle any operations relating to moderation of user content
 */

const {renderAdminLayoutPlaceholder} = require("../../util/layout/layoutUtils");

function getModerationDashboard(req, res, next) {
    //TODO: Add functionality for the moderation dashboard (out of scope)
    renderAdminLayoutPlaceholder(res, "moderation", {}, "Moderation Dashboard (out of scope)");
}

module.exports = {
    getModerationDashboard
}

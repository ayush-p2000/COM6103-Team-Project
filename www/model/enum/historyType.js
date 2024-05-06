const REVIEW_REQUESTED = 0;
const REVIEW_ACCEPTED = 1;
const REVIEW_REJECTED = 2;
const ITEM_HIDDEN = 3;
const ITEM_UNHIDDEN = 4;
const ITEM_APPROVED = 5;
const UNKNOWN_DEVICE = 6;

const historyType = {
    REVIEW_REQUESTED,
    REVIEW_ACCEPTED,
    REVIEW_REJECTED,
    ITEM_HIDDEN,
    ITEM_UNHIDDEN,
    ITEM_APPROVED,
    UNKNOWN_DEVICE,

    historyTypeToString: function (type) {
        switch (type) {
            case REVIEW_REQUESTED:
                return "Review Requested";
            case REVIEW_ACCEPTED:
                return "Review Accepted";
            case REVIEW_REJECTED:
                return "Review Rejected";
            case ITEM_HIDDEN:
                return "Item Hidden";
            case ITEM_UNHIDDEN:
                return "Item Unhidden";
            case ITEM_APPROVED:
                return "Item Approved";
            case UNKNOWN_DEVICE:
                return "Unknown Device";
            default:
                return "Unknown";
        }
    },

    historyTypeToColour: function (type, prefix = "") {
        if (typeof prefix !== 'string' || prefix.length === 0) {
            prefix = "";
        }
        switch (type) {
            case REVIEW_REQUESTED:
                return prefix + "warning";
            case REVIEW_ACCEPTED:
                return prefix + "success";
            case REVIEW_REJECTED:
                return prefix + "danger";
            case ITEM_HIDDEN:
                return prefix + "warning";
            case ITEM_UNHIDDEN:
                return prefix + "info";
            case ITEM_APPROVED:
                return prefix + "success";
            case UNKNOWN_DEVICE:
                return prefix + "secondary";
            default:
                return prefix + "secondary";
        }
    },

    getList: () => Object.values(historyType).filter(value => typeof value === 'number')
};

module.exports = historyType;
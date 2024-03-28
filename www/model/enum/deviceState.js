const DRAFT = 0;
const IN_REVIEW = 1;
const LISTED = 2;
const HAS_QUOTE = 3;
const SOLD = 4;
const RECYCLED = 5;
const AUCITON = 6;
const DATA_RECOVERY = 7;
const CLOSED = 8;
const HIDDEN = 9;
const REJECTED = 10;

const deviceState = {
    DRAFT,
    IN_REVIEW,
    LISTED,
    HAS_QUOTE,
    SOLD,
    RECYCLED,
    AUCITON,
    DATA_RECOVERY,
    CLOSED,
    HIDDEN,
    REJECTED,

    deviceStateToColour: function (deviceState, prefix = "") {
        switch (deviceState) {
            case DRAFT:
                return prefix + "secondary";
            case IN_REVIEW:
                return prefix + "secondary"
            case LISTED:
                return prefix + "primary";
            case HAS_QUOTE:
                return prefix + "success";
            case SOLD:
                return prefix + "secondary"
            case RECYCLED:
                return prefix + "success";
            case AUCITON:
                return prefix + "warning";
            case DATA_RECOVERY:
                return prefix + "info";
            case CLOSED:
                return prefix + "secondary";
            case HIDDEN:
                return prefix + "secondary";
            case REJECTED:
                return prefix + "danger";
            default:
                return prefix + "warning"; // Default color if state is not recognized
        }
    },

    deviceStateToString: function (deviceState) {
        switch (deviceState) {
            case DRAFT:
                return "Draft";
            case IN_REVIEW:
                return "In Review";
            case LISTED:
                return "Listed";
            case HAS_QUOTE:
                return "Has Quote";
            case SOLD:
                return "Sold";
            case RECYCLED:
                return "Recycled";
            case AUCITON:
                return "Auction";
            case DATA_RECOVERY:
                return "Data Recovery";
            case CLOSED:
                return "Closed";
            case HIDDEN:
                return "Hidden";
            case REJECTED:
                return "Rejected";
            default:
                return "Unknown";
        }
    },
};

module.exports = deviceState;
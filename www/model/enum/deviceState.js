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
    deviceStateToColour: function(deviceState) {
        switch (deviceState) {
            case LISTED:
                return "bg-success";
            default:
                return "bg-warning"; // Default color if state is not recognized
        }
    },

    deviceStateToString: function (deviceState) {
        switch (deviceState) {
            case DRAFT:
                return "DRAFT";
            case IN_REVIEW:
                return "IN_REVIEW";
            case LISTED:
                return "LISTED";
            case HAS_QUOTE:
                return "HAS_QUOTE";
            case SOLD:
                return "SOLD";
            case RECYCLED:
                return "RECYCLED";
            case AUCITON:
                return "AUCITON";
            case DATA_RECOVERY:
                return "DATA_RECOVERY";
            case CLOSED:
                return "CLOSED";
            case HIDDEN:
                return "HIDDEN";
            case REJECTED:
                return "REJECTED";
            default:
                return "UNKNOWN";
        }
    }
};

module.exports = deviceState;
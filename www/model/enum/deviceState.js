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
            case 2:
                return "bg-success";
            default:
                return "bg-warning"; // Default color if state is not recognized
        }
    },

    deviceStateToString: function (deviceState) {
        switch (deviceState) {
            case 0:
                return "DRAFT";
            case 1:
                return "IN_REVIEW";
            case 2:
                return "LISTED";
            case 3:
                return "HAS_QUOTE";
            case 4:
                return "SOLD";
            case 5:
                return "RECYCLED";
            case 6:
                return "AUCITON";
            case 7:
                return "DATA_RECOVERY";
            case 8:
                return "CLOSED";
            case 9:
                return "HIDDEN";
            case 10:
                return "REJECTED";
            default:
                return "UNKNOWN";
        }
    }
};

module.exports = deviceState;
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

    deviceStateToRGB: function (deviceState, border = false) {
        switch (deviceState) {
            case DRAFT:
                return border ? 'rgb(128, 128, 128)' : 'rgba(128, 128, 128, 0.2)';
            case IN_REVIEW:
                return border ? 'rgb(128, 128, 128)' : 'rgba(128, 128, 128, 0.2)';
            case LISTED:
                return border ? 'rgb(0, 0, 255)' : 'rgba(0, 0, 255, 0.2)';
            case HAS_QUOTE:
                return border ? 'rgb(0, 128, 0)' : 'rgba(0, 128, 0, 0.2)';
            case SOLD:
                return border ? 'rgb(128, 128, 128)' : 'rgba(128, 128, 128, 0.2)';
            case RECYCLED:
                return border ? 'rgb(0, 128, 0)' : 'rgba(0, 128, 0, 0.2)';
            case AUCITON:
                return border ? 'rgb(255, 165, 0)' : 'rgba(255, 165, 0, 0.2)';
            case DATA_RECOVERY:
                return border ? 'rgb(13,202,240)' : 'rgba(13,202,240, 0.2)';
            case CLOSED:
                return border ? 'rgb(128, 128, 128)' : 'rgba(128, 128, 128, 0.2)';
            case HIDDEN:
                return border ? 'rgb(128, 128, 128)' : 'rgba(128, 128, 128, 0.2)';
            case REJECTED:
                return border ? 'rgb(255, 99, 132)' : 'rgba(255, 99, 132, 0.2)';
            default:
                return border ? 'rgb(255, 165, 0)' : 'rgba(255, 165, 0, 0.2)';
        }
    },

    getList: () => Object.values(deviceState).filter(value => typeof value === 'number')
};

module.exports = deviceState;
const NEW = 0; //A new quote
const SAVED = 1; //A quote the user has saved
const REJECTED = 2; //A quote that has been rejected by the user
const ACCEPTED = 3; //A quote that has been accepted by the user (but not yet converted)
const CONVERTED = 4; //A quote that has been accepted by the user and converted into a transaction (QR code system)
const EXPIRED = 5; //A quote that has expired

const quoteState = {
    NEW,
    SAVED,
    REJECTED,
    ACCEPTED,
    CONVERTED,
    EXPIRED,


    stateToString: (state) => {
        switch (state) {
            case NEW:
                return "New";
            case SAVED:
                return "Saved";
            case REJECTED:
                return "Rejected";
            case ACCEPTED:
                return "Accepted";
            case CONVERTED:
                return "Converted";
            case EXPIRED:
                return "Expired";
            default:
                return "Invalid state";
        }
    },

    stateToColour: (state, prefix="") => {
        if (typeof prefix !== 'string' || prefix.length === 0) {
            prefix = "";
        }
        switch (state) {
            case NEW:
                return prefix + "primary";
            case SAVED:
                return prefix + "info";
            case REJECTED:
                return prefix + "danger";
            case ACCEPTED:
                return prefix + "warning";
            case CONVERTED:
                return prefix + "success";
            case EXPIRED:
                return prefix + "secondary";
            default:
                return prefix + "light";
        }
    },

    quoteStateToRGB: (state, border = false) => {
        switch (state) {
            case NEW:
                return border ? 'rgb(13, 110, 253)' : 'rgba(13, 110, 253, 0.2)';
            case SAVED:
                return border ? 'rgb(0, 191, 255)' : 'rgba(0, 191, 255, 0.2)';
            case REJECTED:
                return border ? 'rgb(255, 0, 0)' : 'rgba(255, 0, 0, 0.2)';
            case ACCEPTED:
                return border ? 'rgb(255, 165, 0)' : 'rgba(255, 165, 0, 0.2)';
            case CONVERTED:
                return border ? 'rgb(0, 128, 0)' : 'rgba(0, 128, 0, 0.2)';
            case EXPIRED:
                return border ? 'rgb(128, 128, 128)' : 'rgba(128, 128, 128, 0.2)';
            default:
                return border ? 'rgb(255, 165, 0)' : 'rgba(255, 165, 0, 0.2)';
        }
    },

    getList: () => Object.values(quoteState).filter(value => typeof value === 'number')
};


module.exports = {
    quoteState,
    NEW,
    SAVED,
    REJECTED,
    ACCEPTED,
    CONVERTED,
    EXPIRED,

}
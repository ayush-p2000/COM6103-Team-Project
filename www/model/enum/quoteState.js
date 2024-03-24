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
    EXPIRED
};

function stateToString(state) {
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
}

function stateToColour(state) {
    switch (state) {
        case NEW:
            return "primary";
        case SAVED:
            return "info";
        case REJECTED:
            return "danger";
        case ACCEPTED:
            return "warning";
        case CONVERTED:
            return "success";
        case EXPIRED:
            return "secondary";
        default:
            return "light";
    }
}

module.exports = {
    quoteState,
    stateToString,
    stateToColour,
    NEW,
    SAVED,
    REJECTED,
    ACCEPTED,
    CONVERTED,
    EXPIRED

}
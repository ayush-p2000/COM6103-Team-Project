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

module.exports = quoteState;
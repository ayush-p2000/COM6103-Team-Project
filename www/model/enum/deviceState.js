const DRAFT = 0;
const IN_REVIEW = 1;
const LISTED = 2;
const HAS_QUOTE = 3;
const SOLD = 4;
const RECYCLED = 5;
const AUCTION = 6;
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
    AUCTION,
    DATA_RECOVERY,
    CLOSED,
    HIDDEN,
    REJECTED,

    deviceStateToColour: function (deviceState, prefix = "") {
        if (typeof prefix !== 'string') {
            prefix = "";
        }

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
            case AUCTION:
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
            case AUCTION:
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
            case AUCTION:
                return border ? 'rgb(255, 165, 0)' : 'rgba(255, 165, 0, 0.2)';
            case DATA_RECOVERY:
                return border ? 'rgb(13, 202, 240)' : 'rgba(13, 202, 240, 0.2)';
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

    /**
     * Returns a text string that describes the next step in the device state machine.
     * This is used to give the user an indication of the next step in the process/what needs to be done.
     * @param state {number} - The current state of the device
     * @returns {string} - A string that describes the next step in the device state machine
     * @author Benjamin Lister
     */
    deviceStateToNextStepString: (state) => {
        switch(state) {
            case DRAFT:
                return 'Once you are happy with the details of the device, submit it for review';
            case IN_REVIEW:
                return 'Your device is currently being reviewed by an administrator';
            case LISTED:
                return 'Your device is now listed on the marketplace. You can now receive quotes';
            case HAS_QUOTE:
                return 'Your device has received a quote! This can be viewed on the device page';
            case SOLD:
                return 'Congratulations! You have sold your device to one of our buyers. No further action is required';
            case RECYCLED:
                return 'Your device has been recycled. No further action is required';
            case AUCTION:
                return 'You have chosen to auction your device. Please refer to the auction site for further details';
            case DATA_RECOVERY:
                return 'Your device is currently in the data recovery process. Please navigate to the data recovery page for further details';
            case CLOSED:
                return 'This listing has been closed. No further action is required';
            case HIDDEN:
                return 'This listing has been hidden from the marketplace. Please contact an administrator for further details';
            case REJECTED:
                return 'Your device has been rejected. Please contact an administrator if you believe this is in error';
            default:
                return 'Unknown';
        }
    },

    /**
     * Returns a text string that can be used as a button label that describes what will happen if the state is promoted.
     * @param state {number} - The current state of the device
     * @returns {string} - A string that can be used as a button label that describes what will happen if the state is promoted to the next step in the device lifecycle
     * @author Benjamin Lister
     */
    deviceStepToPromotionButtonString: (state) => {
        switch(state) {
            case DRAFT:
                return 'Submit for Review';
            case IN_REVIEW:
                return 'Approve Listing';
            case LISTED:
                return 'Close Listing';
            case HAS_QUOTE:
                return 'Close Listing';
            case SOLD:
                return 'No Further Steps';
            case RECYCLED:
                return 'No Further Steps';
            case AUCTION:
                return 'No Further Steps';
            case DATA_RECOVERY:
                return 'No Further Steps';
            case CLOSED:
                return 'No Further Steps';
            case HIDDEN:
                return 'No Further Steps';
            case REJECTED:
                return 'No Further Steps';
            default:
                return 'Unknown';
        }
    },

    /**
     * Returns a text string that can be used as a button label that describes what will happen if the state is demoted.
     * @param state {number} - The current state of the device
     * @returns {string} - A string that can be used as a button label that describes what will happen if the state is demoted to the previous step in the device lifecycle
     * @author Benjamin Lister
     */
    deviceStepToDemotionButtonString: (state) => {
        switch(state) {
            case DRAFT:
                return 'No Further Steps';
            case IN_REVIEW:
                return 'Reject Listing';
            case LISTED:
                return 'Reject Listing';
            case HAS_QUOTE:
                return 'Reject Listing';
            case SOLD:
                return 'No Further Steps';
            case RECYCLED:
                return 'No Further Steps';
            case AUCTION:
                return 'No Further Steps';
            case DATA_RECOVERY:
                return 'No Further Steps';
            case CLOSED:
                return 'No Further Steps';
            case HIDDEN:
                return 'No Further Steps';
            case REJECTED:
                return 'No Further Steps';
            default:
                return 'Unknown';
        }
    },

    /**
     * Returns the next typical state in the device lifecycle.
     * This describes the normal progression of the state machine, if there are no issues or edge cases that occur.
     * @param state {number} - The current state of the device
     * @returns {number} - The next typical state in the device lifecycle
     * @author Benjamin Lister
     */
    getNextTypicalState: (state) => {
        switch(state) {
            case DRAFT:
                return IN_REVIEW;
            case IN_REVIEW:
                return LISTED;
            case LISTED:
                return CLOSED;
            case HAS_QUOTE:
                return CLOSED;
            case SOLD:
                return SOLD;
            case RECYCLED:
                return RECYCLED;
            case AUCTION:
                return AUCTION;
            case DATA_RECOVERY:
                return DATA_RECOVERY;
            case CLOSED:
                return CLOSED;
            case HIDDEN:
                return HIDDEN;
            case REJECTED:
                return REJECTED;
            default:
                return state;
        }
    },

    /**
     * Returns the previous typical state in the device lifecycle.
     * This describes the normal progression of the state machine, if there are no issues or edge cases that occur.
     * @param state {number} - The current state of the device
     * @returns {number} - The previous typical state in the device lifecycle
     * @author Benjamin Lister
     */
    getPreviousTypicalState: (state) => {
        switch(state) {
            case DRAFT:
                return DRAFT;
            case IN_REVIEW:
                return REJECTED;
            case LISTED:
                return REJECTED;
            case HAS_QUOTE:
                return REJECTED;
            case SOLD:
                return SOLD;
            case RECYCLED:
                return RECYCLED;
            case AUCTION:
                return AUCTION;
            case DATA_RECOVERY:
                return DATA_RECOVERY;
            case CLOSED:
                return CLOSED;
            case HIDDEN:
                return HIDDEN;
            case REJECTED:
                return REJECTED;
            default:
                return state;
        }
    },

    /**
     * Returns a boolean value that indicates whether the state has a previous step in the device state machine.
     * For example, IN_REVIEW does not have a previous step as it is the entry point of the state machine.
     * @param state {number} - The current state of the device
     * @returns {boolean} - A boolean value that indicates whether the state has a previous step in the device state machine
     * @author Benjamin Lister
     */
    hasPreviousStep: (state) => (state === IN_REVIEW || state === LISTED || state === HAS_QUOTE),

    /**
     * Returns a boolean value that indicates whether the state has a next step in the device state machine.
     * For example, SOLD does not have a next step as it is the final state in the state machine.
     * @param state {number} - The current state of the device
     * @returns {boolean} - A boolean value that indicates whether the state has a next step in the device state machine
     * @author Benjamin Lister
     */
    hasNextStep: (state) => (state === DRAFT || state === IN_REVIEW || state === LISTED || state === HAS_QUOTE),


    /**
     * Returns a boolean value that indicates whether the given state is a failed state.
     * This groups any states together which would indicate that the device has failed to progress through a conclusive state.
     * This encompasses error states such as if a device has been rejected
     * @param state {number} - The current state of the device
     * @returns {boolean} - A boolean value that indicates whether the given state is a failed state
     * @author Benjamin Lister
     */
    isFailedState: (state) => (state === REJECTED || state === HIDDEN),

    /**
     * Returns a boolean value that indicates whether the given state is within the range of valid states.
     * This is used to make sure a value is within the range of states that are defined in the deviceState enum.
     * This does NOT verify transitions between states, only that the value is within the range of valid states.
     * @param state {number} - The current state of the device
     * @returns {boolean} - A boolean value that indicates whether the given state is within the range of valid states
     * @author Benjamin Lister
     */
    isValidStateValue: (state) => (state >= DRAFT && state <= REJECTED),

    getList: () => Object.values(deviceState).filter(value => typeof value === 'number')
};

module.exports = deviceState;
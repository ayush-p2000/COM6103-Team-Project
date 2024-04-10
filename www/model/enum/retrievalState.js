const AWAITING_DEVICE = 0;
const DEVICE_RECEIVED = 1;
const DATA_RECOVERED = 2;
const DATA_RECOVERY_FAILED = 3;
const DATA_RECOVERY_CANCELLED = 4;
const AVAILABLE_FOR_RETREIVAL = 5;
const EXPIRING_SOON = 6;
const RETRIEVAL_EXPIRED = 7;
const DATA_DELETED = 8;

const retrievalState = {
    AWAITING_DEVICE,
    DEVICE_RECEIVED,
    DATA_RECOVERED,
    DATA_RECOVERY_FAILED,
    DATA_RECOVERY_CANCELLED,
    AVAILABLE_FOR_RETREIVAL,
    EXPIRING_SOON,
    RETRIEVAL_EXPIRED,
    DATA_DELETED,

    retrievalStateToString: (state) => {
        switch(state) {
            case AWAITING_DEVICE:
                return 'Awaiting Device';
            case DEVICE_RECEIVED:
                return 'Device Received';
            case DATA_RECOVERED:
                return 'Data Recovered';
            case DATA_RECOVERY_FAILED:
                return 'Data Recovery Failed';
            case DATA_RECOVERY_CANCELLED:
                return 'Data Recovery Cancelled';
            case AVAILABLE_FOR_RETREIVAL:
                return 'Available for Retrieval';
            case EXPIRING_SOON:
                return 'Expiring Soon';
            case RETRIEVAL_EXPIRED:
                return 'Expired';
            case DATA_DELETED:
                return 'Data Deleted';
            default:
                return 'Unknown';
        }
    },

    retrievalStateToColor: (state, prefix = "") => {
        switch(state) {
            case AWAITING_DEVICE:
                return prefix + 'secondary';
            case DEVICE_RECEIVED:
                return prefix + 'success';
            case DATA_RECOVERED:
                return prefix + 'info';
            case DATA_RECOVERY_FAILED:
                return prefix + 'danger';
            case DATA_RECOVERY_CANCELLED:
                return prefix + 'secondary';
            case AVAILABLE_FOR_RETREIVAL:
                return prefix + 'info';
            case EXPIRING_SOON:
                return prefix + 'warning';
            case RETRIEVAL_EXPIRED:
                return prefix + 'danger';
            case DATA_DELETED:
                return prefix + 'secondary';
            default:
                return prefix + 'info';
        }
    },

    /**
     * Returns a text string that describes the next step in the data retrieval process.
     * This is used to give the user an indication of the next step in the process/what needs to be done.
     * @param state {number} - The current state of the data retrieval process
     * @returns {string} - A string that describes the next step in the data retrieval process
     * @author Benjamin Lister
     */
    retrievalStateToNextStepString: (state) => {
        switch(state) {
            case AWAITING_DEVICE:
                return 'Make sure to bring your device to us as soon as possible in order to start the data recovery process.';
            case DEVICE_RECEIVED:
                return 'We have received your device and are currently working on recovering your data.';
            case DATA_RECOVERED:
                return 'Your data has been successfully recovered and is available for download.';
            case DATA_RECOVERY_FAILED:
                return 'Unfortunately, we were unable to recover any data from your device.';
            case DATA_RECOVERY_CANCELLED:
                return 'Your data recovery process has been cancelled.';
            case AVAILABLE_FOR_RETREIVAL:
                return 'Your data is available for download.';
            case EXPIRING_SOON:
                return 'Your data is available for download, but will expire soon. Make sure to download it before it is too late.';
            case RETRIEVAL_EXPIRED:
                return 'Your data has expired and is no longer available for download.';
            case DATA_DELETED:
                return 'Your data has been deleted.';
            default:
                return 'Unknown';
        }
    },

    /**
     * Returns a text string that can be used as a button label that describes what will happen if the state is promoted.
     * @param state {number} - The current state of the data retrieval process
     * @returns {string} - A string that can be used as a button label to promote the data retrieval process to the next step
     * @author Benjamin Lister
     */
    retrievalStepToPromotionButtonString: (state) => {
        switch(state) {
            case AWAITING_DEVICE:
                return 'Received Device';
            case DEVICE_RECEIVED:
                return 'Data Recovered';
            case DATA_RECOVERED:
                return "Promote to 'Data Available'"
            case DATA_RECOVERY_FAILED:
                return 'No Further Steps';
            case DATA_RECOVERY_CANCELLED:
                return 'No Further Steps';
            case AVAILABLE_FOR_RETREIVAL:
                return "No Further Steps"
            case EXPIRING_SOON:
                return "No Further Steps"
            case RETRIEVAL_EXPIRED:
                return "No Further Steps"
            case DATA_DELETED:
                return "No Further Steps"
            default:
                return 'Unknown';
        }
    },

    /**
     * Returns a text string that can be used as a button label that describes what will happen if the state is demoted.
     * @param state {number} - The current state of the data retrieval process
     * @returns {string} - A string that can be used as a button label to demote the data retrieval process to the previous step
     * @author Benjamin Lister
     */
    retrievalStepToDemotionButtonString: (state) => {
        switch(state) {
            case AWAITING_DEVICE:
                return 'No Further Steps';
            case DEVICE_RECEIVED:
                return 'Awaiting Device';
            case DATA_RECOVERED:
                return "Demote to 'Device Received'"
            case DATA_RECOVERY_FAILED:
                return "Demote to 'Device Received'";
            case DATA_RECOVERY_CANCELLED:
                return "Demote to 'Device Received'";
            case AVAILABLE_FOR_RETREIVAL:
                return "Demote to 'Data Recovered'";
            case EXPIRING_SOON:
                return "No Further Steps";
            case RETRIEVAL_EXPIRED:
                return "No Further Steps";
            case DATA_DELETED:
                return "No Further Steps";
            default:
                return 'Unknown';
        }
    },

    /**
     * Returns the next typical state in the data retrieval process.
     * This describes the normal progression of the state machine, if there are no issues or edge cases that occur.
     * @param state {number} - The current state of the data retrieval process
     * @returns {number} - The next typical state in the data retrieval process
     * @author Benjamin Lister
     */
    getNextTypicalState: (state) => {
        switch(state) {
            case AWAITING_DEVICE:
                return DEVICE_RECEIVED;
            case DEVICE_RECEIVED:
                return DATA_RECOVERED;
            case DATA_RECOVERED:
                return AVAILABLE_FOR_RETREIVAL;
            case DATA_RECOVERY_FAILED:
                return DATA_DELETED;
            case DATA_RECOVERY_CANCELLED:
                return DATA_DELETED;
            case AVAILABLE_FOR_RETREIVAL:
                return EXPIRING_SOON;
            case EXPIRING_SOON:
                return RETRIEVAL_EXPIRED;
            case RETRIEVAL_EXPIRED:
                return DATA_DELETED;
            case DATA_DELETED:
                return DATA_DELETED;
            default:
                return state;
        }
    },

    /**
     * Returns the previous typical state in the data retrieval process.
     * This describes the normal progression of the state machine, if there are no issues or edge cases that occur.
     * @param state {number} - The current state of the data retrieval process
     * @returns {number} - The previous typical state in the data retrieval process
     * @author Benjamin Lister
     */
    getPreviousTypicalState: (state) => {
        switch(state) {
            case AWAITING_DEVICE:
                return AWAITING_DEVICE;
            case DEVICE_RECEIVED:
                return AWAITING_DEVICE;
            case DATA_RECOVERED:
                return DEVICE_RECEIVED;
            case DATA_RECOVERY_FAILED:
                return DEVICE_RECEIVED;
            case DATA_RECOVERY_CANCELLED:
                return DEVICE_RECEIVED;
            case AVAILABLE_FOR_RETREIVAL:
                return DATA_RECOVERED;
            case EXPIRING_SOON:
                return EXPIRING_SOON;
            case RETRIEVAL_EXPIRED:
                return EXPIRING_SOON;
            case DATA_DELETED:
                return DATA_DELETED;
            default:
                return state;
        }
    },

    /**
     * Returns a boolean value that indicates whether the state has a previous step in the data retrieval process state machine.
     * For example, AWAITING_DEVICE does not have a previous step as it is the entry point of the state machine.
     * @param state {number} - The current state of the data retrieval process
     * @returns {boolean} - A boolean value that indicates whether the state has a previous step in the data retrieval process state machine
     * @author Benjamin Lister
     */
    hasPreviousStep: (state) => (state !== AWAITING_DEVICE && state !== DATA_DELETED && state !== EXPIRING_SOON),

    /**
     * Returns a boolean value that indicates whether the state has a next step in the data retrieval process state machine.
     * For example, DATA_DELETED does not have a next step as it is the final state of the state machine, as the data has been deleted.
     * @param state {number} - The current state of the data retrieval process
     * @returns {boolean} - A boolean value that indicates whether the state has a next step in the data retrieval process state machine
     * @author Benjamin Lister
     */
    hasNextStep: (state) => (state !== DATA_DELETED && state !== RETRIEVAL_EXPIRED && state !== DATA_RECOVERY_FAILED && state !== DATA_RECOVERY_CANCELLED && state !== AVAILABLE_FOR_RETREIVAL && state !== EXPIRING_SOON),

    /**
     * Returns a boolean value that indicates whether the given state should have files associated with it.
     * This is NOT a check to see if the state has files associated with it, but rather if a given state would normally
     *   expect to have files associated with it.
     *  For example, DATA_DELETED does not have files associated with it, as the data has been deleted.
     *  But, once data has been recovered, it is expected that there will be files associated with the retrieval.
     *  This is used to determine what views to show to the user, and what actions they can take.
     * @param state {number} - The current state of the data retrieval process
     * @returns {boolean} - A boolean value that indicates whether the given state normally has files associated with it
     * @author Benjamin Lister
     */
    stateHasFiles: (state) => (state === DATA_RECOVERED || state === AVAILABLE_FOR_RETREIVAL || state === EXPIRING_SOON),

    /**
     * Returns a boolean value that indicates whether the given state is an expired state.
     * This groups any states together which would indicate that the data retrieval process has expired.
     * For example, any states where the data has been deleted or the retrieval has expired would be considered expired states.
     * @param state {number} - The current state of the data retrieval process
     * @returns {boolean} - A boolean value that indicates whether the given state is an expired state
     * @author Benjamin Lister
     */
    isExpiredState: (state) => (state === DATA_DELETED || state === RETRIEVAL_EXPIRED),

    /**
     * Returns a boolean value that indicates whether the given state is a failed state.
     * This groups any states together which would indicate that the data retrieval process has failed.
     * This encompasses error states such as when the data recovery process has failed or been cancelled.
     * @param state {number} - The current state of the data retrieval process
     * @returns {boolean} - A boolean value that indicates whether the given state is a failed state
     * @author Benjamin Lister
     */
    isFailedState: (state) => (state === DATA_RECOVERY_FAILED || state === DATA_RECOVERY_CANCELLED),

    /**
     * Returns a boolean value that indicates whether the given state is within the range of valid states.
     * This is used to make sure a value is within the range of states that are defined in the retrievalState enum.
     * This does NOT verify transitions between states, only that the value is within the range of valid states.
     * @param state {number} - The current state of the data retrieval process
     * @returns {boolean} - A boolean value that indicates whether the given state is within the range of valid states
     * @author Benjamin Lister
     */
    isValidStateValue: (state) => (state >= AWAITING_DEVICE && state <= DATA_DELETED),

    getList: () => Object.values(retrievalState).filter(value => typeof value === 'number')
};

module.exports = retrievalState;
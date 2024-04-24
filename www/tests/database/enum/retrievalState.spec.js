const expect = require('chai').expect;

const retrievalState = require('../../../model/enum/retrievalState');

describe('Test Retrieval State Enum', () => {
    describe('Test Retrieval State Enum Values', () => {
        it('should have a value of 0 for AWAITING_DEVICE', () => {
            expect(retrievalState.AWAITING_DEVICE).to.equal(0);
        });

        it('should have a value of 1 for DEVICE_RECEIVED', () => {
            expect(retrievalState.DEVICE_RECEIVED).to.equal(1);
        });

        it('should have a value of 2 for DATA_RECOVERED', () => {
            expect(retrievalState.DATA_RECOVERED).to.equal(2);
        });

        it('should have a value of 3 for DATA_RECOVERY_FAILED', () => {
            expect(retrievalState.DATA_RECOVERY_FAILED).to.equal(3);
        });

        it('should have a value of 4 for DATA_RECOVERY_CANCELLED', () => {
            expect(retrievalState.DATA_RECOVERY_CANCELLED).to.equal(4);
        });

        it('should have a value of 5 for AVAILABLE_FOR_RETRIEVAL', () => {
            expect(retrievalState.AVAILABLE_FOR_RETREIVAL).to.equal(5);
        });

        it('should have a value of 6 for EXPIRING_SOON', () => {
            expect(retrievalState.EXPIRING_SOON).to.equal(6);
        });

        it('should have a value of 7 for RETRIEVAL_EXPIRED', () => {
            expect(retrievalState.RETRIEVAL_EXPIRED).to.equal(7);
        });

        it('should have a value of 8 for DATA_DELETED', () => {
            expect(retrievalState.DATA_DELETED).to.equal(8);
        });

        it('should only have 9 values', () => {
            // Arrange
            const expected = 9;

            // Act
            const actual = Object.values(retrievalState).filter(value => typeof value === 'number').length;

            // Assert
            expect(actual).to.equal(expected);
        });
    });

    describe('Test getList', () => {
        it('should return an array of 9 values', (done) => {
            // Arrange
            const expected = 9;

            // Act
            const actual = retrievalState.getList().length;

            // Assert
            expect(actual).to.equal(expected);

            done();
        });

        it('should return an array with only numbers', (done) => {
            const expectedType = 'number';

            const list = retrievalState.getList();

            list.forEach(value => {
                expect(typeof value).to.equal(expectedType);
            });

            done();
        });

        it('should return an array with the correct values', (done) => {
            const expectedValues = [
                0, 1, 2, 3, 4, 5, 6, 7, 8
            ];

            const list = retrievalState.getList();

            expect(list).to.have.members(expectedValues);

            done();
        });
    });

    describe('Test retrievalStateToString', () => {
        it('should return "Awaiting Device" for 0', () => {
            expect(retrievalState.retrievalStateToString(0)).to.equal('Awaiting Device');
        });

        it('should return "Device Received" for 1', () => {
            expect(retrievalState.retrievalStateToString(1)).to.equal('Device Received');
        });

        it('should return "Data Recovered" for 2', () => {
            expect(retrievalState.retrievalStateToString(2)).to.equal('Data Recovered');
        });

        it('should return "Data Recovery Failed" for 3', () => {
            expect(retrievalState.retrievalStateToString(3)).to.equal('Data Recovery Failed');
        });

        it('should return "Data Recovery Cancelled" for 4', () => {
            expect(retrievalState.retrievalStateToString(4)).to.equal('Data Recovery Cancelled');
        });

        it('should return "Available for Retrieval" for 5', () => {
            expect(retrievalState.retrievalStateToString(5)).to.equal('Available for Retrieval');
        });

        it('should return "Expiring Soon" for 6', () => {
            expect(retrievalState.retrievalStateToString(6)).to.equal('Expiring Soon');
        });

        it('should return "Expired" for 7', () => {
            expect(retrievalState.retrievalStateToString(7)).to.equal('Expired');
        });

        it('should return "Data Deleted" for 8', () => {
            expect(retrievalState.retrievalStateToString(8)).to.equal('Data Deleted');
        });

        it('should return "Unknown" for an unknown value', () => {
            expect(retrievalState.retrievalStateToString(9)).to.equal('Unknown');
        });
    });

    describe('Test retrievalStateToColor', () => {
        describe('Test with no prefix', () => {
            it('should return "secondary" for AWAITING_DEVICE', () => {
                expect(retrievalState.retrievalStateToColor(retrievalState.AWAITING_DEVICE)).to.equal('secondary');
            });

            it('should return "success" for DEVICE_RECEIVED', () => {
                expect(retrievalState.retrievalStateToColor(retrievalState.DEVICE_RECEIVED)).to.equal('success');
            });

            it('should return "info" for DATA_RECOVERED', () => {
                expect(retrievalState.retrievalStateToColor(retrievalState.DATA_RECOVERED)).to.equal('info');
            });

            it('should return "danger" for DATA_RECOVERY_FAILED', () => {
                expect(retrievalState.retrievalStateToColor(retrievalState.DATA_RECOVERY_FAILED)).to.equal('danger');
            });

            it('should return "secondary" for DATA_RECOVERY_CANCELLED', () => {
                expect(retrievalState.retrievalStateToColor(retrievalState.DATA_RECOVERY_CANCELLED)).to.equal('secondary');
            });

            it('should return "info" for AVAILABLE_FOR_RETRIEVAL', () => {
                expect(retrievalState.retrievalStateToColor(retrievalState.AVAILABLE_FOR_RETREIVAL)).to.equal('info');
            });

            it('should return "warning" for EXPIRING_SOON', () => {
                expect(retrievalState.retrievalStateToColor(retrievalState.EXPIRING_SOON)).to.equal('warning');
            });

            it('should return "danger" for RETRIEVAL_EXPIRED', () => {
                expect(retrievalState.retrievalStateToColor(retrievalState.RETRIEVAL_EXPIRED)).to.equal('danger');
            });

            it('should return "secondary" for DATA_DELETED', () => {
                expect(retrievalState.retrievalStateToColor(retrievalState.DATA_DELETED)).to.equal('secondary');
            });

            it('should return "info" for an unknown value', () => {
                expect(retrievalState.retrievalStateToColor(-1)).to.equal('info');
            });
        });

        describe('Test with a prefix', () => {
            it('should return "bg-secondary" for AWAITING_DEVICE with a prefix of "bg-"', () => {
                expect(retrievalState.retrievalStateToColor(retrievalState.AWAITING_DEVICE, 'bg-')).to.equal('bg-secondary');
            });

            it('should return "bg-success" for DEVICE_RECEIVED with a prefix of "bg-"', () => {
                expect(retrievalState.retrievalStateToColor(retrievalState.DEVICE_RECEIVED, 'bg-')).to.equal('bg-success');
            });

            it('should return "bg-info" for DATA_RECOVERED with a prefix of "bg-"', () => {
                expect(retrievalState.retrievalStateToColor(retrievalState.DATA_RECOVERED, 'bg-')).to.equal('bg-info');
            });

            it('should return "bg-danger" for DATA_RECOVERY_FAILED with a prefix of "bg-"', () => {
                expect(retrievalState.retrievalStateToColor(retrievalState.DATA_RECOVERY_FAILED, 'bg-')).to.equal('bg-danger');
            });

            it('should return "bg-secondary" for DATA_RECOVERY_CANCELLED with a prefix of "bg-"', () => {
                expect(retrievalState.retrievalStateToColor(retrievalState.DATA_RECOVERY_CANCELLED, 'bg-')).to.equal('bg-secondary');
            });

            it('should return "bg-info" for AVAILABLE_FOR_RETRIEVAL with a prefix of "bg-"', () => {
                expect(retrievalState.retrievalStateToColor(retrievalState.AVAILABLE_FOR_RETREIVAL, 'bg-')).to.equal('bg-info');
            });

            it('should return "bg-warning" for EXPIRING_SOON with a prefix of "bg-"', () => {
                expect(retrievalState.retrievalStateToColor(retrievalState.EXPIRING_SOON, 'bg-')).to.equal('bg-warning');
            });

            it('should return "bg-danger" for RETRIEVAL_EXPIRED with a prefix of "bg-"', () => {
                expect(retrievalState.retrievalStateToColor(retrievalState.RETRIEVAL_EXPIRED, 'bg-')).to.equal('bg-danger');
            });

            it('should return "bg-secondary" for DATA_DELETED with a prefix of "bg-"', () => {
                expect(retrievalState.retrievalStateToColor(retrievalState.DATA_DELETED, 'bg-')).to.equal('bg-secondary');
            });

            it('should return "bg-info" for an unknown value with a prefix of "bg-"', () => {
                expect(retrievalState.retrievalStateToColor(-1, 'bg-')).to.equal('bg-info');
            });

            it('should return "info" for an unknown value with a prefix of null', () => {
                expect(retrievalState.retrievalStateToColor(-1, null)).to.equal('info');
            });

            it('should return "info" for an unknown value with a prefix of undefined', () => {
                expect(retrievalState.retrievalStateToColor(-1, undefined)).to.equal('info');
            });

            it('should return "info" for an unknown value with a prefix of true', () => {
                expect(retrievalState.retrievalStateToColor(-1, true)).to.equal('info');
            });

            it('should return "info" for an unknown value with a prefix of false', () => {
                expect(retrievalState.retrievalStateToColor(-1, false)).to.equal('info');
            });

            it('should return "info" for an unknown value with a prefix of 0', () => {
                expect(retrievalState.retrievalStateToColor(-1, 0)).to.equal('info');
            });
        });
    });

    describe('Test retrievalStateToNextStepString', () => {
        it('should return the correct string for AWAITING_DEVICE', () => {
            const expected = 'Make sure to bring your device to us as soon as possible in order to start the data recovery process.';

            const actual = retrievalState.retrievalStateToNextStepString(retrievalState.AWAITING_DEVICE);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for DEVICE_RECEIVED', () => {
            const expected = 'We have received your device and are currently working on recovering your data.';

            const actual = retrievalState.retrievalStateToNextStepString(retrievalState.DEVICE_RECEIVED);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for DATA_RECOVERED', () => {
            const expected = 'Your data has been successfully recovered and is available for download.';

            const actual = retrievalState.retrievalStateToNextStepString(retrievalState.DATA_RECOVERED);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for DATA_RECOVERY_FAILED', () => {
            const expected = 'Unfortunately, we were unable to recover any data from your device.';

            const actual = retrievalState.retrievalStateToNextStepString(retrievalState.DATA_RECOVERY_FAILED);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for DATA_RECOVERY_CANCELLED', () => {
            const expected = 'Your data recovery process has been cancelled.';

            const actual = retrievalState.retrievalStateToNextStepString(retrievalState.DATA_RECOVERY_CANCELLED);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for AVAILABLE_FOR_RETRIEVAL', () => {
            const expected = 'Your data is available for download.';

            const actual = retrievalState.retrievalStateToNextStepString(retrievalState.AVAILABLE_FOR_RETREIVAL);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for EXPIRING_SOON', () => {
            const expected = 'Your data is available for download, but will expire soon. Make sure to download it before it is too late.';

            const actual = retrievalState.retrievalStateToNextStepString(retrievalState.EXPIRING_SOON);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for RETRIEVAL_EXPIRED', () => {
            const expected = 'Your data has expired and is no longer available for download.';

            const actual = retrievalState.retrievalStateToNextStepString(retrievalState.RETRIEVAL_EXPIRED);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for DATA_DELETED', () => {
            const expected = 'Your data has been deleted.';

            const actual = retrievalState.retrievalStateToNextStepString(retrievalState.DATA_DELETED);

            expect(actual).to.equal(expected);
        });

        it('should return "Unknown" for an unknown value', () => {
            const expected = 'Unknown';

            const actual = retrievalState.retrievalStateToNextStepString(-1);

            expect(actual).to.equal(expected);
        });
    });

    describe('Test retrievalStepToPromotionButtonString', () => {

        it('should return the correct string for AWAITING_DEVICE', () => {
            const expected = 'Received Device';

            const actual = retrievalState.retrievalStepToPromotionButtonString(retrievalState.AWAITING_DEVICE);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for DEVICE_RECEIVED', () => {
            const expected = 'Data Recovered';

            const actual = retrievalState.retrievalStepToPromotionButtonString(retrievalState.DEVICE_RECEIVED);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for DATA_RECOVERED', () => {
            const expected = "Promote to 'Data Available'";

            const actual = retrievalState.retrievalStepToPromotionButtonString(retrievalState.DATA_RECOVERED);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for DATA_RECOVERY_FAILED', () => {
            const expected = 'No Further Steps';

            const actual = retrievalState.retrievalStepToPromotionButtonString(retrievalState.DATA_RECOVERY_FAILED);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for DATA_RECOVERY_CANCELLED', () => {
            const expected = 'No Further Steps';

            const actual = retrievalState.retrievalStepToPromotionButtonString(retrievalState.DATA_RECOVERY_CANCELLED);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for AVAILABLE_FOR_RETRIEVAL', () => {
            const expected = "No Further Steps";

            const actual = retrievalState.retrievalStepToPromotionButtonString(retrievalState.AVAILABLE_FOR_RETREIVAL);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for EXPIRING_SOON', () => {
            const expected = "No Further Steps";

            const actual = retrievalState.retrievalStepToPromotionButtonString(retrievalState.EXPIRING_SOON);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for RETRIEVAL_EXPIRED', () => {
            const expected = "No Further Steps";

            const actual = retrievalState.retrievalStepToPromotionButtonString(retrievalState.RETRIEVAL_EXPIRED);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for DATA_DELETED', () => {
            const expected = "No Further Steps";

            const actual = retrievalState.retrievalStepToPromotionButtonString(retrievalState.DATA_DELETED);

            expect(actual).to.equal(expected);
        });

        it('should return "Unknown" for an unknown value', () => {
            const expected = 'Unknown';

            const actual = retrievalState.retrievalStepToPromotionButtonString(-1);

            expect(actual).to.equal(expected);
        });
    });

    describe('Test retrievalStepToDemotionButtonString', () => {

        it('should return the correct string for AWAITING_DEVICE', () => {
            const expected = 'No Further Steps';

            const actual = retrievalState.retrievalStepToDemotionButtonString(retrievalState.AWAITING_DEVICE);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for DEVICE_RECEIVED', () => {
            const expected = 'Awaiting Device';

            const actual = retrievalState.retrievalStepToDemotionButtonString(retrievalState.DEVICE_RECEIVED);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for DATA_RECOVERED', () => {
            const expected = "Demote to 'Device Received'";

            const actual = retrievalState.retrievalStepToDemotionButtonString(retrievalState.DATA_RECOVERED);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for DATA_RECOVERY_FAILED', () => {
            const expected = "Demote to 'Device Received'";

            const actual = retrievalState.retrievalStepToDemotionButtonString(retrievalState.DATA_RECOVERY_FAILED);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for DATA_RECOVERY_CANCELLED', () => {
            const expected = "Demote to 'Device Received'";

            const actual = retrievalState.retrievalStepToDemotionButtonString(retrievalState.DATA_RECOVERY_CANCELLED);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for AVAILABLE_FOR_RETRIEVAL', () => {
            const expected = "Demote to 'Data Recovered'";

            const actual = retrievalState.retrievalStepToDemotionButtonString(retrievalState.AVAILABLE_FOR_RETREIVAL);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for EXPIRING_SOON', () => {
            const expected = "No Further Steps";

            const actual = retrievalState.retrievalStepToDemotionButtonString(retrievalState.EXPIRING_SOON);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for RETRIEVAL_EXPIRED', () => {
            const expected = "No Further Steps";

            const actual = retrievalState.retrievalStepToDemotionButtonString(retrievalState.RETRIEVAL_EXPIRED);

            expect(actual).to.equal(expected);
        });

        it('should return the correct string for DATA_DELETED', () => {
            const expected = "No Further Steps";

            const actual = retrievalState.retrievalStepToDemotionButtonString(retrievalState.DATA_DELETED);

            expect(actual).to.equal(expected);
        });

        it('should return "Unknown" for an unknown value', () => {
            const expected = 'Unknown';

            const actual = retrievalState.retrievalStepToDemotionButtonString(-1);

            expect(actual).to.equal(expected);
        });
    });

    describe('Test getNextTypicalState', () => {
        it('should return DEVICE_RECEIVED for AWAITING_DEVICE', () => {
            const expected = retrievalState.DEVICE_RECEIVED;

            const actual = retrievalState.getNextTypicalState(retrievalState.AWAITING_DEVICE);

            expect(actual).to.equal(expected);
        });

        it('should return DATA_RECOVERED for DEVICE_RECEIVED', () => {
            const expected = retrievalState.DATA_RECOVERED;

            const actual = retrievalState.getNextTypicalState(retrievalState.DEVICE_RECEIVED);

            expect(actual).to.equal(expected);
        });

        it('should return AVAILABLE_FOR_RETREIVAL for DATA_RECOVERED', () => {
            const expected = retrievalState.AVAILABLE_FOR_RETREIVAL;

            const actual = retrievalState.getNextTypicalState(retrievalState.DATA_RECOVERED);

            expect(actual).to.equal(expected);
        });

        it('should return DATA_DELETED for DATA_RECOVERY_FAILED', () => {
            const expected = retrievalState.DATA_DELETED;

            const actual = retrievalState.getNextTypicalState(retrievalState.DATA_RECOVERY_FAILED);

            expect(actual).to.equal(expected);
        });

        it('should return DATA_DELETED for DATA_RECOVERY_CANCELLED', () => {
            const expected = retrievalState.DATA_DELETED;

            const actual = retrievalState.getNextTypicalState(retrievalState.DATA_RECOVERY_CANCELLED);

            expect(actual).to.equal(expected);
        });

        it('should return EXPIRING_SOON for AVAILABLE_FOR_RETREIVAL', () => {
            const expected = retrievalState.EXPIRING_SOON;

            const actual = retrievalState.getNextTypicalState(retrievalState.AVAILABLE_FOR_RETREIVAL);

            expect(actual).to.equal(expected);
        });

        it('should return RETRIEVAL_EXPIRED for EXPIRING_SOON', () => {
            const expected = retrievalState.RETRIEVAL_EXPIRED;

            const actual = retrievalState.getNextTypicalState(retrievalState.EXPIRING_SOON);

            expect(actual).to.equal(expected);
        });

        it('should return DATA_DELETED for RETRIEVAL_EXPIRED', () => {
            const expected = retrievalState.DATA_DELETED;

            const actual = retrievalState.getNextTypicalState(retrievalState.RETRIEVAL_EXPIRED);

            expect(actual).to.equal(expected);
        });

        it('should return DATA_DELETED for DATA_DELETED', () => {
            const expected = retrievalState.DATA_DELETED;

            const actual = retrievalState.getNextTypicalState(retrievalState.DATA_DELETED);

            expect(actual).to.equal(expected);
        });

        it('should return the same state for an unknown value', () => {
            const expected = -1;

            const actual = retrievalState.getNextTypicalState(-1);

            expect(actual).to.equal(expected);
        });
    });

    describe('Test getPreviousTypicalState', () => {
        it('should return AWAITING_DEVICE for AWAITING_DEVICE', () => {
            const expected = retrievalState.AWAITING_DEVICE;

            const actual = retrievalState.getPreviousTypicalState(retrievalState.AWAITING_DEVICE);

            expect(actual).to.equal(expected);
        });

        it('should return AWAITING_DEVICE for DEVICE_RECEIVED', () => {
            const expected = retrievalState.AWAITING_DEVICE;

            const actual = retrievalState.getPreviousTypicalState(retrievalState.DEVICE_RECEIVED);

            expect(actual).to.equal(expected);
        });

        it('should return DEVICE_RECEIVED for DATA_RECOVERED', () => {
            const expected = retrievalState.DEVICE_RECEIVED;

            const actual = retrievalState.getPreviousTypicalState(retrievalState.DATA_RECOVERED);

            expect(actual).to.equal(expected);
        });

        it('should return DEVICE_RECEIVED for DATA_RECOVERY_FAILED', () => {
            const expected = retrievalState.DEVICE_RECEIVED;

            const actual = retrievalState.getPreviousTypicalState(retrievalState.DATA_RECOVERY_FAILED);

            expect(actual).to.equal(expected);
        });

        it('should return DEVICE_RECEIVED for DATA_RECOVERY_CANCELLED', () => {
            const expected = retrievalState.DEVICE_RECEIVED;

            const actual = retrievalState.getPreviousTypicalState(retrievalState.DATA_RECOVERY_CANCELLED);

            expect(actual).to.equal(expected);
        });

        it('should return DATA_RECOVERED for AVAILABLE_FOR_RETREIVAL', () => {
            const expected = retrievalState.DATA_RECOVERED;

            const actual = retrievalState.getPreviousTypicalState(retrievalState.AVAILABLE_FOR_RETREIVAL);

            expect(actual).to.equal(expected);
        });

        it('should return EXPIRING_SOON for EXPIRING_SOON', () => {
            const expected = retrievalState.EXPIRING_SOON;

            const actual = retrievalState.getPreviousTypicalState(retrievalState.EXPIRING_SOON);

            expect(actual).to.equal(expected);
        });

        it('should return EXPIRING_SOON for RETRIEVAL_EXPIRED', () => {
            const expected = retrievalState.EXPIRING_SOON;

            const actual = retrievalState.getPreviousTypicalState(retrievalState.RETRIEVAL_EXPIRED);

            expect(actual).to.equal(expected);
        });

        it('should return DATA_DELETED for DATA_DELETED', () => {
            const expected = retrievalState.DATA_DELETED;

            const actual = retrievalState.getPreviousTypicalState(retrievalState.DATA_DELETED);

            expect(actual).to.equal(expected);
        });

        it('should return the same state for an unknown value', () => {
            const expected = -1;

            const actual = retrievalState.getPreviousTypicalState(-1);

            expect(actual).to.equal(expected);
        });
    });

    describe('Test hasPreviousStep', () => {
        it('should return false for AWAITING_DEVICE', () => {
            const expected = false;

            const actual = retrievalState.hasPreviousStep(retrievalState.AWAITING_DEVICE);

            expect(actual).to.equal(expected);
        });

        it('should return true for DEVICE_RECEIVED', () => {
            const expected = true;

            const actual = retrievalState.hasPreviousStep(retrievalState.DEVICE_RECEIVED);

            expect(actual).to.equal(expected);
        });

        it('should return true for DATA_RECOVERED', () => {
            const expected = true;

            const actual = retrievalState.hasPreviousStep(retrievalState.DATA_RECOVERED);

            expect(actual).to.equal(expected);
        });

        it('should return true for DATA_RECOVERY_FAILED', () => {
            const expected = true;

            const actual = retrievalState.hasPreviousStep(retrievalState.DATA_RECOVERY_FAILED);

            expect(actual).to.equal(expected);
        });

        it('should return true for DATA_RECOVERY_CANCELLED', () => {
            const expected = true;

            const actual = retrievalState.hasPreviousStep(retrievalState.DATA_RECOVERY_CANCELLED);

            expect(actual).to.equal(expected);
        });

        it('should return true for AVAILABLE_FOR_RETREIVAL', () => {
            const expected = true;

            const actual = retrievalState.hasPreviousStep(retrievalState.AVAILABLE_FOR_RETREIVAL);

            expect(actual).to.equal(expected);
        });

        it('should return false for EXPIRING_SOON', () => {
            const expected = false;

            const actual = retrievalState.hasPreviousStep(retrievalState.EXPIRING_SOON);

            expect(actual).to.equal(expected);
        });

        it('should return true for RETRIEVAL_EXPIRED', () => {
            const expected = true;

            const actual = retrievalState.hasPreviousStep(retrievalState.RETRIEVAL_EXPIRED);

            expect(actual).to.equal(expected);
        });

        it('should return false for DATA_DELETED', () => {
            const expected = false;

            const actual = retrievalState.hasPreviousStep(retrievalState.DATA_DELETED);

            expect(actual).to.equal(expected);
        });

        it('should return false for an unknown value', () => {
            const expected = false;

            const actual = retrievalState.hasPreviousStep(-1);

            expect(actual).to.equal(expected);
        });
    });

    describe('Test hasNextStep', () => {
        it('should return true for AWAITING_DEVICE', () => {
            const expected = true;

            const actual = retrievalState.hasNextStep(retrievalState.AWAITING_DEVICE);

            expect(actual).to.equal(expected);
        });

        it('should return true for DEVICE_RECEIVED', () => {
            const expected = true;

            const actual = retrievalState.hasNextStep(retrievalState.DEVICE_RECEIVED);

            expect(actual).to.equal(expected);
        });

        it('should return true for DATA_RECOVERED', () => {
            const expected = true;

            const actual = retrievalState.hasNextStep(retrievalState.DATA_RECOVERED);

            expect(actual).to.equal(expected);
        });

        it('should return false for DATA_RECOVERY_FAILED', () => {
            const expected = false;

            const actual = retrievalState.hasNextStep(retrievalState.DATA_RECOVERY_FAILED);

            expect(actual).to.equal(expected);
        });

        it('should return false for DATA_RECOVERY_CANCELLED', () => {
            const expected = false;

            const actual = retrievalState.hasNextStep(retrievalState.DATA_RECOVERY_CANCELLED);

            expect(actual).to.equal(expected);
        });

        it('should return false for AVAILABLE_FOR_RETREIVAL', () => {
            const expected = false;

            const actual = retrievalState.hasNextStep(retrievalState.AVAILABLE_FOR_RETREIVAL);

            expect(actual).to.equal(expected);
        });

        it('should return false for EXPIRING_SOON', () => {
            const expected = false;

            const actual = retrievalState.hasNextStep(retrievalState.EXPIRING_SOON);

            expect(actual).to.equal(expected);
        });

        it('should return false for RETRIEVAL_EXPIRED', () => {
            const expected = false;

            const actual = retrievalState.hasNextStep(retrievalState.RETRIEVAL_EXPIRED);

            expect(actual).to.equal(expected);
        });

        it('should return false for DATA_DELETED', () => {
            const expected = false;

            const actual = retrievalState.hasNextStep(retrievalState.DATA_DELETED);

            expect(actual).to.equal(expected);
        });

        it('should return false for an unknown value', () => {
            const expected = false;

            const actual = retrievalState.hasNextStep(-1);

            expect(actual).to.equal(expected);
        });
    });

    describe('Test stateHasFiles', () => {
        it('should return false for AWAITING_DEVICE', () => {
            const expected = false;

            const actual = retrievalState.stateHasFiles(retrievalState.AWAITING_DEVICE);

            expect(actual).to.equal(expected);
        });

        it('should return false for DEVICE_RECEIVED', () => {
            const expected = false;

            const actual = retrievalState.stateHasFiles(retrievalState.DEVICE_RECEIVED);

            expect(actual).to.equal(expected);
        });

        it('should return true for DATA_RECOVERED', () => {
            const expected = true;

            const actual = retrievalState.stateHasFiles(retrievalState.DATA_RECOVERED);

            expect(actual).to.equal(expected);
        });

        it('should return false for DATA_RECOVERY_FAILED', () => {
            const expected = false;

            const actual = retrievalState.stateHasFiles(retrievalState.DATA_RECOVERY_FAILED);

            expect(actual).to.equal(expected);
        });

        it('should return false for DATA_RECOVERY_CANCELLED', () => {
            const expected = false;

            const actual = retrievalState.stateHasFiles(retrievalState.DATA_RECOVERY_CANCELLED);

            expect(actual).to.equal(expected);
        });

        it('should return true for AVAILABLE_FOR_RETREIVAL', () => {
            const expected = true;

            const actual = retrievalState.stateHasFiles(retrievalState.AVAILABLE_FOR_RETREIVAL);

            expect(actual).to.equal(expected);
        });

        it('should return true for EXPIRING_SOON', () => {
            const expected = true;

            const actual = retrievalState.stateHasFiles(retrievalState.EXPIRING_SOON);

            expect(actual).to.equal(expected);
        });

        it('should return false for RETRIEVAL_EXPIRED', () => {
            const expected = false;

            const actual = retrievalState.stateHasFiles(retrievalState.RETRIEVAL_EXPIRED);

            expect(actual).to.equal(expected);
        });

        it('should return false for DATA_DELETED', () => {
            const expected = false;

            const actual = retrievalState.stateHasFiles(retrievalState.DATA_DELETED);

            expect(actual).to.equal(expected);
        });

        it('should return false for an unknown value', () => {
            const expected = false;

            const actual = retrievalState.stateHasFiles(-1);

            expect(actual).to.equal(expected);
        });
    });

    describe('Test isExpiredState', () => {
        it('should return false for AWAITING_DEVICE', () => {
            const expected = false;

            const actual = retrievalState.isExpiredState(retrievalState.AWAITING_DEVICE);

            expect(actual).to.equal(expected);
        });

        it('should return false for DEVICE_RECEIVED', () => {
            const expected = false;

            const actual = retrievalState.isExpiredState(retrievalState.DEVICE_RECEIVED);

            expect(actual).to.equal(expected);
        });

        it('should return false for DATA_RECOVERED', () => {
            const expected = false;

            const actual = retrievalState.isExpiredState(retrievalState.DATA_RECOVERED);

            expect(actual).to.equal(expected);
        });

        it('should return false for DATA_RECOVERY_FAILED', () => {
            const expected = false;

            const actual = retrievalState.isExpiredState(retrievalState.DATA_RECOVERY_FAILED);

            expect(actual).to.equal(expected);
        });

        it('should return false for DATA_RECOVERY_CANCELLED', () => {
            const expected = false;

            const actual = retrievalState.isExpiredState(retrievalState.DATA_RECOVERY_CANCELLED);

            expect(actual).to.equal(expected);
        });

        it('should return false for AVAILABLE_FOR_RETREIVAL', () => {
            const expected = false;

            const actual = retrievalState.isExpiredState(retrievalState.AVAILABLE_FOR_RETREIVAL);

            expect(actual).to.equal(expected);
        });

        it('should return false for EXPIRING_SOON', () => {
            const expected = false;

            const actual = retrievalState.isExpiredState(retrievalState.EXPIRING_SOON);

            expect(actual).to.equal(expected);
        });

        it('should return true for RETRIEVAL_EXPIRED', () => {
            const expected = true;

            const actual = retrievalState.isExpiredState(retrievalState.RETRIEVAL_EXPIRED);

            expect(actual).to.equal(expected);
        });

        it('should return true for DATA_DELETED', () => {
            const expected = true;

            const actual = retrievalState.isExpiredState(retrievalState.DATA_DELETED);

            expect(actual).to.equal(expected);
        });

        it('should return false for an unknown value', () => {
            const expected = false;

            const actual = retrievalState.isExpiredState(-1);

            expect(actual).to.equal(expected);
        });
    });

    describe('Test isFailedState', () => {
        it('should return false for AWAITING_DEVICE', () => {
            const expected = false;

            const actual = retrievalState.isFailedState(retrievalState.AWAITING_DEVICE);

            expect(actual).to.equal(expected);
        });

        it('should return false for DEVICE_RECEIVED', () => {
            const expected = false;

            const actual = retrievalState.isFailedState(retrievalState.DEVICE_RECEIVED);

            expect(actual).to.equal(expected);
        });

        it('should return false for DATA_RECOVERED', () => {
            const expected = false;

            const actual = retrievalState.isFailedState(retrievalState.DATA_RECOVERED);

            expect(actual).to.equal(expected);
        });

        it('should return true for DATA_RECOVERY_FAILED', () => {
            const expected = true;

            const actual = retrievalState.isFailedState(retrievalState.DATA_RECOVERY_FAILED);

            expect(actual).to.equal(expected);
        });

        it('should return true for DATA_RECOVERY_CANCELLED', () => {
            const expected = true;

            const actual = retrievalState.isFailedState(retrievalState.DATA_RECOVERY_CANCELLED);

            expect(actual).to.equal(expected);
        });

        it('should return false for AVAILABLE_FOR_RETREIVAL', () => {
            const expected = false;

            const actual = retrievalState.isFailedState(retrievalState.AVAILABLE_FOR_RETREIVAL);

            expect(actual).to.equal(expected);
        });

        it('should return false for EXPIRING_SOON', () => {
            const expected = false;

            const actual = retrievalState.isFailedState(retrievalState.EXPIRING_SOON);

            expect(actual).to.equal(expected);
        });

        it('should return false for RETRIEVAL_EXPIRED', () => {
            const expected = false;

            const actual = retrievalState.isFailedState(retrievalState.RETRIEVAL_EXPIRED);

            expect(actual).to.equal(expected);
        });

        it('should return false for DATA_DELETED', () => {
            const expected = false;

            const actual = retrievalState.isFailedState(retrievalState.DATA_DELETED);

            expect(actual).to.equal(expected);
        });

        it('should return false for an unknown value', () => {
            const expected = false;

            const actual = retrievalState.isFailedState(-1);

            expect(actual).to.equal(expected);
        });
    });

    describe('Test isValidStateValue', () => {
        //Should return true for all values in the list
        it('should return true for all values in the list', () => {
            const list = retrievalState.getList();

            list.forEach(value => {
                expect(retrievalState.isValidStateValue(value)).to.be.true;
            });
        });

        //Should return false for an unknown value
        it('should return false for an unknown value', () => {
            const value = -1;

            expect(retrievalState.isValidStateValue(value)).to.be.false;
        });
    });
});
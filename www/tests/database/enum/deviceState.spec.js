const expect = require('chai').expect;

const deviceState = require('../../../model/enum/deviceState');

describe('Test Device State Enum', () => {
    describe('Test Device State Values', () => {
        it('should have a value of 0 for DRAFT', (done) => {
            // Arrange
            const expected = 0;

            // Act
            const result = deviceState.DRAFT;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have a value of 1 for IN_REVIEW', (done) => {
            // Arrange
            const expected = 1;

            // Act
            const result = deviceState.IN_REVIEW;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have a value of 2 for LISTED', (done) => {
            // Arrange
            const expected = 2;

            // Act
            const result = deviceState.LISTED;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have a value of 3 for HAS_QUOTE', (done) => {
            // Arrange
            const expected = 3;

            // Act
            const result = deviceState.HAS_QUOTE;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have a value of 4 for SOLD', (done) => {
            // Arrange
            const expected = 4;

            // Act
            const result = deviceState.SOLD;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have a value of 5 for RECYCLED', (done) => {
            // Arrange
            const expected = 5;

            // Act
            const result = deviceState.RECYCLED;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have a value of 6 for AUCTION', (done) => {
            // Arrange
            const expected = 6;

            // Act
            const result = deviceState.AUCTION;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have a value of 7 for DATA_RECOVERY', (done) => {
            // Arrange
            const expected = 7;

            // Act
            const result = deviceState.DATA_RECOVERY;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have a value of 8 for CLOSED', (done) => {
            // Arrange
            const expected = 8;

            // Act
            const result = deviceState.CLOSED;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have a value of 9 for HIDDEN', (done) => {
            // Arrange
            const expected = 9;

            // Act
            const result = deviceState.HIDDEN;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have a value of 10 for REJECTED', (done) => {
            // Arrange
            const expected = 10;

            // Act
            const result = deviceState.REJECTED;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should only have 11 values', (done) => {
            // Arrange
            const expected = 11;

            // Act
            const result = Object.values(deviceState).filter(value => typeof value === 'number').length;

            // Assert
            expect(result).to.equal(expected);
            done();
        });
    });

    describe('Test getList', () => {
        it('should return an array of 11 values', (done) => {
            // Arrange
            const expectedLength = 11;

            // Act
            const result = deviceState.getList();
            const length = result.length;

            // Assert
            expect(length).to.equal(expectedLength);

            done();
        });

        it('should return an array with only numbers', (done) => {
            // Arrange
            const expectedType = 'number';

            // Act
            const result = deviceState.getList();

            // Assert
            result.forEach((value) => {
                expect(typeof value).to.equal(expectedType);
            });

            done();
        });

        it('should return an array with the values of the enum', (done) => {
            // Arrange
            const expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

            // Act
            const result = deviceState.getList();

            // Assert
            // The result should contain all of the expected values in any order
            expect(result).to.have.members(expected);

            done();
        });
    });

    describe('Test deviceStateToString', () => {
        it('should return "Draft" for DRAFT', (done) => {
            // Arrange
            const expected = "Draft";

            // Act
            const result = deviceState.deviceStateToString(deviceState.DRAFT);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "In Review" for IN_REVIEW', (done) => {
            // Arrange
            const expected = "In Review";

            // Act
            const result = deviceState.deviceStateToString(deviceState.IN_REVIEW);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "Listed" for LISTED', (done) => {
            // Arrange
            const expected = "Listed";

            // Act
            const result = deviceState.deviceStateToString(deviceState.LISTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "Has Quote" for HAS_QUOTE', (done) => {
            // Arrange
            const expected = "Has Quote";

            // Act
            const result = deviceState.deviceStateToString(deviceState.HAS_QUOTE);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "Sold" for SOLD', (done) => {
            // Arrange
            const expected = "Sold";

            // Act
            const result = deviceState.deviceStateToString(deviceState.SOLD);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "Recycled" for RECYCLED', (done) => {
            // Arrange
            const expected = "Recycled";

            // Act
            const result = deviceState.deviceStateToString(deviceState.RECYCLED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "Auction" for AUCTION', (done) => {
            // Arrange
            const expected = "Auction";

            // Act
            const result = deviceState.deviceStateToString(deviceState.AUCTION);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "Data Recovery" for DATA_RECOVERY', (done) => {
            // Arrange
            const expected = "Data Recovery";

            // Act
            const result = deviceState.deviceStateToString(deviceState.DATA_RECOVERY);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "Closed" for CLOSED', (done) => {
            // Arrange
            const expected = "Closed";

            // Act
            const result = deviceState.deviceStateToString(deviceState.CLOSED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "Hidden" for HIDDEN', (done) => {
            // Arrange
            const expected = "Hidden";

            // Act
            const result = deviceState.deviceStateToString(deviceState.HIDDEN);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "Rejected" for REJECTED', (done) => {
            // Arrange
            const expected = "Rejected";

            // Act
            const result = deviceState.deviceStateToString(deviceState.REJECTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "Unknown" for an invalid value', (done) => {
            // Arrange
            const expected = "Unknown";

            // Act
            const result = deviceState.deviceStateToString(100);

            // Assert
            expect(result).to.equal(expected);
            done();
        });
    });

    describe('Test deviceStateToColour', () => {
        describe('Test with no prefix', () => {
            it('should return "secondary" for DRAFT', (done) => {
                // Arrange
                const expected = "secondary";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.DRAFT);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "secondary" for IN_REVIEW', (done) => {
                // Arrange
                const expected = "secondary";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.IN_REVIEW);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "primary" for LISTED', (done) => {
                // Arrange
                const expected = "primary";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.LISTED);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "success" for HAS_QUOTE', (done) => {
                // Arrange
                const expected = "success";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.HAS_QUOTE);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "secondary" for SOLD', (done) => {
                // Arrange
                const expected = "secondary";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.SOLD);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "success" for RECYCLED', (done) => {
                // Arrange
                const expected = "success";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.RECYCLED);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "warning" for AUCTION', (done) => {
                // Arrange
                const expected = "warning";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.AUCTION);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "info" for DATA_RECOVERY', (done) => {
                // Arrange
                const expected = "info";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.DATA_RECOVERY);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "secondary" for CLOSED', (done) => {
                // Arrange
                const expected = "secondary";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.CLOSED);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "secondary" for HIDDEN', (done) => {
                // Arrange
                const expected = "secondary";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.HIDDEN);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "danger" for REJECTED', (done) => {
                // Arrange
                const expected = "danger";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.REJECTED);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "warning" for an invalid value', (done) => {
                // Arrange
                const expected = "warning";

                // Act
                const result = deviceState.deviceStateToColour(100);

                // Assert
                expect(result).to.equal(expected);
                done();
            });
        });

        describe('Test with a prefix', () => {
            it('should return "testsecondary" for DRAFT', (done) => {
                // Arrange
                const expected = "testsecondary";
                const prefix = "test";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.DRAFT, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testsecondary" for IN_REVIEW', (done) => {
                // Arrange
                const expected = "testsecondary";
                const prefix = "test";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.IN_REVIEW, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testprimary" for LISTED', (done) => {
                // Arrange
                const expected = "testprimary";
                const prefix = "test";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.LISTED, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testsuccess" for HAS_QUOTE', (done) => {
                // Arrange
                const expected = "testsuccess";
                const prefix = "test";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.HAS_QUOTE, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testsecondary" for SOLD', (done) => {
                // Arrange
                const expected = "testsecondary";
                const prefix = "test";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.SOLD, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testsuccess" for RECYCLED', (done) => {
                // Arrange
                const expected = "testsuccess";
                const prefix = "test";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.RECYCLED, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testwarning" for AUCTION', (done) => {
                // Arrange
                const expected = "testwarning";
                const prefix = "test";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.AUCTION, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testinfo" for DATA_RECOVERY', (done) => {
                // Arrange
                const expected = "testinfo";
                const prefix = "test";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.DATA_RECOVERY, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testsecondary" for CLOSED', (done) => {
                // Arrange
                const expected = "testsecondary";
                const prefix = "test";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.CLOSED, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testsecondary" for HIDDEN', (done) => {
                // Arrange
                const expected = "testsecondary";
                const prefix = "test";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.HIDDEN, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testdanger" for REJECTED', (done) => {
                // Arrange
                const expected = "testdanger";
                const prefix = "test";

                // Act
                const result = deviceState.deviceStateToColour(deviceState.REJECTED, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testwarning" for an invalid value', (done) => {
                // Arrange
                const expected = "testwarning";
                const prefix = "test";

                // Act
                const result = deviceState.deviceStateToColour(100, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "warning" for an invalid valid and a prefix of null', (done) => {
                // Arrange
                const expected = "warning";
                const prefix = null;

                // Act
                const result = deviceState.deviceStateToColour(100, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "warning" for an invalid valid and a prefix of undefined', (done) => {
                // Arrange
                const expected = "warning";
                const prefix = undefined;

                // Act
                const result = deviceState.deviceStateToColour(100, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "warning" for an invalid valid and a prefix of true', (done) => {
                // Arrange
                const expected = "warning";
                const prefix = true;

                // Act
                const result = deviceState.deviceStateToColour(100, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "warning" for an invalid valid and a prefix of false', (done) => {
                // Arrange
                const expected = "warning";
                const prefix = false;

                // Act
                const result = deviceState.deviceStateToColour(100, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "warning" for an invalid valid and a prefix of 0', (done) => {
                // Arrange
                const expected = "warning";
                const prefix = 0;

                // Act
                const result = deviceState.deviceStateToColour(100, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

        });
    });

    describe('Test deviceStateToRGB', () => {
        describe('Test with border = false', () => {
            it('should return "rgba(128, 128, 128, 0.2)" for DRAFT', (done) => {
                // Arrange
                const expected = "rgba(128, 128, 128, 0.2)";
                const border = false;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.DRAFT, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgba(128, 128, 128, 0.2)" for IN_REVIEW', (done) => {
                // Arrange
                const expected = "rgba(128, 128, 128, 0.2)";
                const border = false;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.IN_REVIEW, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgba(0, 0, 255, 0.2)" for LISTED', (done) => {
                // Arrange
                const expected = "rgba(0, 0, 255, 0.2)";
                const border = false;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.LISTED, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgba(0, 128, 0, 0.2)" for HAS_QUOTE', (done) => {
                // Arrange
                const expected = "rgba(0, 128, 0, 0.2)";
                const border = false;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.HAS_QUOTE, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgba(128, 128, 128, 0.2)" for SOLD', (done) => {
                // Arrange
                const expected = "rgba(128, 128, 128, 0.2)";
                const border = false;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.SOLD, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgba(0, 128, 0, 0.2)" for RECYCLED', (done) => {
                // Arrange
                const expected = "rgba(0, 128, 0, 0.2)";
                const border = false;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.RECYCLED, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgba(255, 165, 0, 0.2)" for AUCTION', (done) => {
                // Arrange
                const expected = "rgba(255, 165, 0, 0.2)";
                const border = false;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.AUCTION, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgba(13, 202, 240, 0.2)" for DATA_RECOVERY', (done) => {
                // Arrange
                const expected = "rgba(13, 202, 240, 0.2)";
                const border = false;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.DATA_RECOVERY, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgba(128, 128, 128, 0.2)" for CLOSED', (done) => {
                // Arrange
                const expected = "rgba(128, 128, 128, 0.2)";
                const border = false;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.CLOSED, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgba(128, 128, 128, 0.2)" for HIDDEN', (done) => {
                // Arrange
                const expected = "rgba(128, 128, 128, 0.2)";
                const border = false;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.HIDDEN, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgba(255, 99, 132, 0.2)" for REJECTED', (done) => {
                // Arrange
                const expected = "rgba(255, 99, 132, 0.2)";
                const border = false;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.REJECTED, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgba(255, 165, 0, 0.2)" for an invalid value', (done) => {
                // Arrange
                const expected = "rgba(255, 165, 0, 0.2)";
                const border = false;

                // Act
                const result = deviceState.deviceStateToRGB(100, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });
        });

        describe('Test with border = true', () => {
            it('should return "rgb(128, 128, 128)" for DRAFT', (done) => {
                // Arrange
                const expected = "rgb(128, 128, 128)";
                const border = true;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.DRAFT, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgb(128, 128, 128)" for IN_REVIEW', (done) => {
                // Arrange
                const expected = "rgb(128, 128, 128)";
                const border = true;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.IN_REVIEW, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgb(0, 0, 255)" for LISTED', (done) => {
                // Arrange
                const expected = "rgb(0, 0, 255)";
                const border = true;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.LISTED, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgb(0, 128, 0)" for HAS_QUOTE', (done) => {
                // Arrange
                const expected = "rgb(0, 128, 0)";
                const border = true;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.HAS_QUOTE, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgb(128, 128, 128)" for SOLD', (done) => {
                // Arrange
                const expected = "rgb(128, 128, 128)";
                const border = true;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.SOLD, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgb(0, 128, 0)" for RECYCLED', (done) => {
                // Arrange
                const expected = "rgb(0, 128, 0)";
                const border = true;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.RECYCLED, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgb(255, 165, 0)" for AUCTION', (done) => {
                // Arrange
                const expected = "rgb(255, 165, 0)";
                const border = true;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.AUCTION, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgb(13, 202, 240)" for DATA_RECOVERY', (done) => {
                // Arrange
                const expected = "rgb(13, 202, 240)";
                const border = true;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.DATA_RECOVERY, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgb(128, 128, 128)" for CLOSED', (done) => {
                // Arrange
                const expected = "rgb(128, 128, 128)";
                const border = true;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.CLOSED, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgb(128, 128, 128)" for HIDDEN', (done) => {
                // Arrange
                const expected = "rgb(128, 128, 128)";
                const border = true;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.HIDDEN, border);

                // Assert
                expect(result).to.equal(expected);
                done();

            });

            it('should return "rgb(255, 99, 132)" for REJECTED', (done) => {
                // Arrange
                const expected = "rgb(255, 99, 132)";
                const border = true;

                // Act
                const result = deviceState.deviceStateToRGB(deviceState.REJECTED, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgb(255, 165, 0)" for an invalid value', (done) => {
                // Arrange
                const expected = "rgb(255, 165, 0)";
                const border = true;

                // Act
                const result = deviceState.deviceStateToRGB(100, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });
        });
    });

    describe('Test deviceStateToNextStepString', () => {
        it('should return the correct string for DRAFT', (done) => {
            // Arrange
            const expected = "Once you are happy with the details of the device, submit it for review";

            // Act
            const result = deviceState.deviceStateToNextStepString(deviceState.DRAFT);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for IN_REVIEW', (done) => {
            // Arrange
            const expected = "Your device is currently being reviewed by an administrator";

            // Act
            const result = deviceState.deviceStateToNextStepString(deviceState.IN_REVIEW);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for LISTED', (done) => {
            // Arrange
            const expected = "Your device is now listed on the marketplace. You can now receive quotes";

            // Act
            const result = deviceState.deviceStateToNextStepString(deviceState.LISTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for HAS_QUOTE', (done) => {
            // Arrange
            const expected = "Your device has received a quote! This can be viewed on the device page";

            // Act
            const result = deviceState.deviceStateToNextStepString(deviceState.HAS_QUOTE);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for SOLD', (done) => {
            // Arrange
            const expected = "Congratulations! You have sold your device to one of our buyers. No further action is required";

            // Act
            const result = deviceState.deviceStateToNextStepString(deviceState.SOLD);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for RECYCLED', (done) => {
            // Arrange
            const expected = "Your device has been recycled. No further action is required";

            // Act
            const result = deviceState.deviceStateToNextStepString(deviceState.RECYCLED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for AUCTION', (done) => {
            // Arrange
            const expected = "You have chosen to auction your device. Please refer to the auction site for further details";

            // Act
            const result = deviceState.deviceStateToNextStepString(deviceState.AUCTION);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for DATA_RECOVERY', (done) => {
            // Arrange
            const expected = "Your device is currently in the data recovery process. Please navigate to the data recovery page for further details";

            // Act
            const result = deviceState.deviceStateToNextStepString(deviceState.DATA_RECOVERY);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for CLOSED', (done) => {
            // Arrange
            const expected = "This listing has been closed. No further action is required";

            // Act
            const result = deviceState.deviceStateToNextStepString(deviceState.CLOSED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for HIDDEN', (done) => {
            // Arrange
            const expected = "This listing has been hidden from the marketplace. Please contact an administrator for further details";

            // Act
            const result = deviceState.deviceStateToNextStepString(deviceState.HIDDEN);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for REJECTED', (done) => {
            // Arrange
            const expected = "Your device has been rejected. Please contact an administrator if you believe this is in error";

            // Act
            const result = deviceState.deviceStateToNextStepString(deviceState.REJECTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for an invalid value', (done) => {
            // Arrange
            const expected = "Unknown";

            // Act
            const result = deviceState.deviceStateToNextStepString(100);

            // Assert
            expect(result).to.equal(expected);
            done();
        });
    });

    describe('Test deviceStepToPromotionButtonString', () => {
        it('should return the correct string for DRAFT', (done) => {
            // Arrange
            const expected = "Submit for Review";

            // Act
            const result = deviceState.deviceStepToPromotionButtonString(deviceState.DRAFT);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for IN_REVIEW', (done) => {
            // Arrange
            const expected = "Approve Listing";

            // Act
            const result = deviceState.deviceStepToPromotionButtonString(deviceState.IN_REVIEW);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for LISTED', (done) => {
            // Arrange
            const expected = "Close Listing";

            // Act
            const result = deviceState.deviceStepToPromotionButtonString(deviceState.LISTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for HAS_QUOTE', (done) => {
            // Arrange
            const expected = "Close Listing";

            // Act
            const result = deviceState.deviceStepToPromotionButtonString(deviceState.HAS_QUOTE);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for SOLD', (done) => {
            // Arrange
            const expected = "No Further Steps";

            // Act
            const result = deviceState.deviceStepToPromotionButtonString(deviceState.SOLD);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for RECYCLED', (done) => {
            // Arrange
            const expected = "No Further Steps";

            // Act
            const result = deviceState.deviceStepToPromotionButtonString(deviceState.RECYCLED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for AUCTION', (done) => {
            // Arrange
            const expected = "No Further Steps";

            // Act
            const result = deviceState.deviceStepToPromotionButtonString(deviceState.AUCTION);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for DATA_RECOVERY', (done) => {
            // Arrange
            const expected = "No Further Steps";

            // Act
            const result = deviceState.deviceStepToPromotionButtonString(deviceState.DATA_RECOVERY);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for CLOSED', (done) => {
            // Arrange
            const expected = "No Further Steps";

            // Act
            const result = deviceState.deviceStepToPromotionButtonString(deviceState.CLOSED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for HIDDEN', (done) => {
            // Arrange
            const expected = "No Further Steps";

            // Act
            const result = deviceState.deviceStepToPromotionButtonString(deviceState.HIDDEN);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for REJECTED', (done) => {
            // Arrange
            const expected = "No Further Steps";

            // Act
            const result = deviceState.deviceStepToPromotionButtonString(deviceState.REJECTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for an invalid value', (done) => {
            // Arrange
            const expected = "Unknown";

            // Act
            const result = deviceState.deviceStepToPromotionButtonString(100);

            // Assert
            expect(result).to.equal(expected);
            done();
        });
    });

    describe('Test deviceStepToDemotionButtonString', () => {
        it('should return the correct string for DRAFT', (done) => {
            // Arrange
            const expected = "No Further Steps";

            // Act
            const result = deviceState.deviceStepToDemotionButtonString(deviceState.DRAFT);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for IN_REVIEW', (done) => {
            // Arrange
            const expected = "Reject Listing";

            // Act
            const result = deviceState.deviceStepToDemotionButtonString(deviceState.IN_REVIEW);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for LISTED', (done) => {
            // Arrange
            const expected = "Reject Listing";

            // Act
            const result = deviceState.deviceStepToDemotionButtonString(deviceState.LISTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for HAS_QUOTE', (done) => {
            // Arrange
            const expected = "Reject Listing";

            // Act
            const result = deviceState.deviceStepToDemotionButtonString(deviceState.HAS_QUOTE);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for SOLD', (done) => {
            // Arrange
            const expected = "No Further Steps";

            // Act
            const result = deviceState.deviceStepToDemotionButtonString(deviceState.SOLD);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for RECYCLED', (done) => {
            // Arrange
            const expected = "No Further Steps";

            // Act
            const result = deviceState.deviceStepToDemotionButtonString(deviceState.RECYCLED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for AUCTION', (done) => {
            // Arrange
            const expected = "No Further Steps";

            // Act
            const result = deviceState.deviceStepToDemotionButtonString(deviceState.AUCTION);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for DATA_RECOVERY', (done) => {
            // Arrange
            const expected = "No Further Steps";

            // Act
            const result = deviceState.deviceStepToDemotionButtonString(deviceState.DATA_RECOVERY);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for CLOSED', (done) => {
            // Arrange
            const expected = "No Further Steps";

            // Act
            const result = deviceState.deviceStepToDemotionButtonString(deviceState.CLOSED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for HIDDEN', (done) => {
            // Arrange
            const expected = "No Further Steps";

            // Act
            const result = deviceState.deviceStepToDemotionButtonString(deviceState.HIDDEN);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for REJECTED', (done) => {
            // Arrange
            const expected = "No Further Steps";

            // Act
            const result = deviceState.deviceStepToDemotionButtonString(deviceState.REJECTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the correct string for an invalid value', (done) => {
            // Arrange
            const expected = "Unknown";

            // Act
            const result = deviceState.deviceStepToDemotionButtonString(100);

            // Assert
            expect(result).to.equal(expected);
            done();
        });
    });

    describe('Test getNextTypicalState', () => {
        it('should return IN_REVIEW for DRAFT', (done) => {
            // Arrange
            const expected = deviceState.IN_REVIEW;

            // Act
            const result = deviceState.getNextTypicalState(deviceState.DRAFT);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return LISTED for IN_REVIEW', (done) => {
            // Arrange
            const expected = deviceState.LISTED;

            // Act
            const result = deviceState.getNextTypicalState(deviceState.IN_REVIEW);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return CLOSED for LISTED', (done) => {
            // Arrange
            const expected = deviceState.CLOSED;

            // Act
            const result = deviceState.getNextTypicalState(deviceState.LISTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return CLOSED for HAS_QUOTE', (done) => {
            // Arrange
            const expected = deviceState.CLOSED;

            // Act
            const result = deviceState.getNextTypicalState(deviceState.HAS_QUOTE);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return SOLD for SOLD', (done) => {
            // Arrange
            const expected = deviceState.SOLD;

            // Act
            const result = deviceState.getNextTypicalState(deviceState.SOLD);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return RECYCLED for RECYCLED', (done) => {
            // Arrange
            const expected = deviceState.RECYCLED;

            // Act
            const result = deviceState.getNextTypicalState(deviceState.RECYCLED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return AUCTION for AUCTION', (done) => {
            // Arrange
            const expected = deviceState.AUCTION;

            // Act
            const result = deviceState.getNextTypicalState(deviceState.AUCTION);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return DATA_RECOVERY for DATA_RECOVERY', (done) => {
            // Arrange
            const expected = deviceState.DATA_RECOVERY;

            // Act
            const result = deviceState.getNextTypicalState(deviceState.DATA_RECOVERY);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return CLOSED for CLOSED', (done) => {
            // Arrange
            const expected = deviceState.CLOSED;

            // Act
            const result = deviceState.getNextTypicalState(deviceState.CLOSED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return HIDDEN for HIDDEN', (done) => {
            // Arrange
            const expected = deviceState.HIDDEN;

            // Act
            const result = deviceState.getNextTypicalState(deviceState.HIDDEN);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return REJECTED for REJECTED', (done) => {
            // Arrange
            const expected = deviceState.REJECTED;

            // Act
            const result = deviceState.getNextTypicalState(deviceState.REJECTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the provided value for an invalid value', (done) => {
            // Arrange
            const state = 100;
            const expected = state;

            // Act
            const result = deviceState.getNextTypicalState(state);

            // Assert
            expect(result).to.equal(expected);
            done();
        });
    });

    describe('Test getPreviousTypicalState', () => {
        it('should return DRAFT for DRAFT', (done) => {
            // Arrange
            const expected = deviceState.DRAFT;

            // Act
            const result = deviceState.getPreviousTypicalState(deviceState.DRAFT);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return REJECTED for IN_REVIEW', (done) => {
            // Arrange
            const expected = deviceState.REJECTED;

            // Act
            const result = deviceState.getPreviousTypicalState(deviceState.IN_REVIEW);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return REJECTED for LISTED', (done) => {
            // Arrange
            const expected = deviceState.REJECTED;

            // Act
            const result = deviceState.getPreviousTypicalState(deviceState.LISTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return REJECTED for HAS_QUOTE', (done) => {
            // Arrange
            const expected = deviceState.REJECTED;

            // Act
            const result = deviceState.getPreviousTypicalState(deviceState.HAS_QUOTE);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return SOLD for SOLD', (done) => {
            // Arrange
            const expected = deviceState.SOLD;

            // Act
            const result = deviceState.getPreviousTypicalState(deviceState.SOLD);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return RECYCLED for RECYCLED', (done) => {
            // Arrange
            const expected = deviceState.RECYCLED;

            // Act
            const result = deviceState.getPreviousTypicalState(deviceState.RECYCLED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return AUCTION for AUCTION', (done) => {
            // Arrange
            const expected = deviceState.AUCTION;

            // Act
            const result = deviceState.getPreviousTypicalState(deviceState.AUCTION);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return DATA_RECOVERY for DATA_RECOVERY', (done) => {
            // Arrange
            const expected = deviceState.DATA_RECOVERY;

            // Act
            const result = deviceState.getPreviousTypicalState(deviceState.DATA_RECOVERY);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return CLOSED for CLOSED', (done) => {
            // Arrange
            const expected = deviceState.CLOSED;

            // Act
            const result = deviceState.getPreviousTypicalState(deviceState.CLOSED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return HIDDEN for HIDDEN', (done) => {
            // Arrange
            const expected = deviceState.HIDDEN;

            // Act
            const result = deviceState.getPreviousTypicalState(deviceState.HIDDEN);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return REJECTED for REJECTED', (done) => {
            // Arrange
            const expected = deviceState.REJECTED;

            // Act
            const result = deviceState.getPreviousTypicalState(deviceState.REJECTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return the provided value for an invalid value', (done) => {
            // Arrange
            const state = 100;
            const expected = state;

            // Act
            const result = deviceState.getPreviousTypicalState(state);

            // Assert
            expect(result).to.equal(expected);
            done();
        });
    });

    describe('Test hasPreviousStep', () => {
        it('should return false for DRAFT', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.hasPreviousStep(deviceState.DRAFT);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return true for IN_REVIEW', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.hasPreviousStep(deviceState.IN_REVIEW);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return true for LISTED', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.hasPreviousStep(deviceState.LISTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return true for HAS_QUOTE', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.hasPreviousStep(deviceState.HAS_QUOTE);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for SOLD', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.hasPreviousStep(deviceState.SOLD);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for RECYCLED', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.hasPreviousStep(deviceState.RECYCLED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for AUCTION', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.hasPreviousStep(deviceState.AUCTION);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for DATA_RECOVERY', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.hasPreviousStep(deviceState.DATA_RECOVERY);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for CLOSED', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.hasPreviousStep(deviceState.CLOSED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for HIDDEN', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.hasPreviousStep(deviceState.HIDDEN);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for REJECTED', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.hasPreviousStep(deviceState.REJECTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for an invalid value', (done) => {
            // Arrange
            const state = 100;
            const expected = false;

            // Act
            const result = deviceState.hasPreviousStep(state);

            // Assert
            expect(result).to.equal(expected);
            done();
        });
    });

    describe('Test hasNextStep', () => {
        it('should return true for DRAFT', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.hasNextStep(deviceState.DRAFT);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return true for IN_REVIEW', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.hasNextStep(deviceState.IN_REVIEW);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return true for LISTED', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.hasNextStep(deviceState.LISTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return true for HAS_QUOTE', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.hasNextStep(deviceState.HAS_QUOTE);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for SOLD', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.hasNextStep(deviceState.SOLD);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for RECYCLED', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.hasNextStep(deviceState.RECYCLED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for AUCTION', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.hasNextStep(deviceState.AUCTION);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for DATA_RECOVERY', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.hasNextStep(deviceState.DATA_RECOVERY);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for CLOSED', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.hasNextStep(deviceState.CLOSED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for HIDDEN', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.hasNextStep(deviceState.HIDDEN);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for REJECTED', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.hasNextStep(deviceState.REJECTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for an invalid value', (done) => {
            // Arrange
            const state = 100;
            const expected = false;

            // Act
            const result = deviceState.hasNextStep(state);

            // Assert
            expect(result).to.equal(expected);
            done();
        });
    });

    describe('Test isFailedState', () => {
        it('should return false for DRAFT', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.isFailedState(deviceState.DRAFT);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for IN_REVIEW', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.isFailedState(deviceState.IN_REVIEW);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for LISTED', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.isFailedState(deviceState.LISTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for HAS_QUOTE', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.isFailedState(deviceState.HAS_QUOTE);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for SOLD', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.isFailedState(deviceState.SOLD);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for RECYCLED', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.isFailedState(deviceState.RECYCLED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for AUCTION', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.isFailedState(deviceState.AUCTION);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for DATA_RECOVERY', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.isFailedState(deviceState.DATA_RECOVERY);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for CLOSED', (done) => {
            // Arrange
            const expected = false;

            // Act
            const result = deviceState.isFailedState(deviceState.CLOSED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return true for HIDDEN', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.isFailedState(deviceState.HIDDEN);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return true for REJECTED', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.isFailedState(deviceState.REJECTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for an invalid value', (done) => {
            // Arrange
            const state = 100;
            const expected = false;

            // Act
            const result = deviceState.isFailedState(state);

            // Assert
            expect(result).to.equal(expected);
            done();
        });
    });

    describe('Test isValidStateValue', () => {
        it('should return true for DRAFT', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.isValidStateValue(deviceState.DRAFT);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return true for IN_REVIEW', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.isValidStateValue(deviceState.IN_REVIEW);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return true for LISTED', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.isValidStateValue(deviceState.LISTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return true for HAS_QUOTE', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.isValidStateValue(deviceState.HAS_QUOTE);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return true for SOLD', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.isValidStateValue(deviceState.SOLD);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return true for RECYCLED', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.isValidStateValue(deviceState.RECYCLED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return true for AUCTION', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.isValidStateValue(deviceState.AUCTION);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return true for DATA_RECOVERY', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.isValidStateValue(deviceState.DATA_RECOVERY);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return true for CLOSED', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.isValidStateValue(deviceState.CLOSED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return true for HIDDEN', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.isValidStateValue(deviceState.HIDDEN);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return true for REJECTED', (done) => {
            // Arrange
            const expected = true;

            // Act
            const result = deviceState.isValidStateValue(deviceState.REJECTED);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return false for an invalid value', (done) => {
            // Arrange
            const state = 100;
            const expected = false;

            // Act
            const result = deviceState.isValidStateValue(state);

            // Assert
            expect(result).to.equal(expected);
            done();
        });
    });
});
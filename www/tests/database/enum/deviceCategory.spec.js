const expect = require('chai').expect;

const deviceCategory = require('../../../model/enum/deviceCategory');
const dataTypes = require("../../../model/enum/dataTypes");

describe('Test Device Category Enum', () => {
    describe('Test Device Category Values', () => {
        it('should have a value of 0 for CURRENT', (done) => {
            // Arrange
            const expected = 0;

            // Act
            const result = deviceCategory.CURRENT;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have a value of 1 for RARE', (done) => {
            // Arrange
            const expected = 1;

            // Act
            const result = deviceCategory.RARE;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have a value of 2 for RECYCLE', (done) => {
            // Arrange
            const expected = 2;

            // Act
            const result = deviceCategory.RECYCLE;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have a value of 3 for UNKNOWN', (done) => {
            // Arrange
            const expected = 3;

            // Act
            const result = deviceCategory.UNKNOWN;

            // Assert
            expect(result).to.equal(expected);
            done();
        });


    });

    describe('Test deviceCategoryToString', () => {
        it('should return "Current" for CURRENT', (done) => {
            // Arrange
            const expected = "Current";

            // Act
            const result = deviceCategory.deviceCategoryToString(deviceCategory.CURRENT);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "Rare" for RARE', (done) => {
            // Arrange
            const expected = "Rare";

            // Act
            const result = deviceCategory.deviceCategoryToString(deviceCategory.RARE);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "Recycle" for RECYCLE', (done) => {
            // Arrange
            const expected = "Recycle";

            // Act
            const result = deviceCategory.deviceCategoryToString(deviceCategory.RECYCLE);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "Unknown" for UNKNOWN', (done) => {
            // Arrange
            const expected = "Unknown";

            // Act
            const result = deviceCategory.deviceCategoryToString(deviceCategory.UNKNOWN);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "Unknown" if provided invalid data', (done) => {
            // Arrange
            const expected = "Unknown";

            // Act
            const result = deviceCategory.deviceCategoryToString("Invalid");

            // Assert
            expect(result).to.equal(expected);
            done();
        });

    });

    describe('Test deviceCategoryToColour', () => {
        describe('Test with no prefix', () => {
            it('should return "secondary" for UNKNOWN', (done) => {
                // Arrange
                const expected = "secondary";

                // Act
                const result =  deviceCategory.deviceCategoryToColour(deviceCategory.UNKNOWN);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "success" for RECYCLE', (done) => {
                // Arrange
                const expected = "success";

                // Act
                const result = deviceCategory.deviceCategoryToColour(deviceCategory.RECYCLE);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "warning" for CURRENT', (done) => {
                // Arrange
                const expected = "warning";

                // Act
                const result = deviceCategory.deviceCategoryToColour(deviceCategory.CURRENT);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "info" for RARE', (done) => {
                // Arrange
                const expected = "info";

                // Act
                const result = deviceCategory.deviceCategoryToColour(deviceCategory.RARE);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "secondary" for passing in a value not of deviceCategory', (done) => {
                // Arrange
                const expected = "secondary";

                // Act
                const result =  deviceCategory.deviceCategoryToColour(99);

                // Assert
                expect(result).to.equal(expected);
                done();
            });
        });

        describe('Test with a prefix', () => {
            it('should return "testsecondary" for UNKNOWN with prefix "test"', (done) => {
                // Arrange
                const expected = "testsecondary";
                const prefix = "test";

                // Act
                const result =  deviceCategory.deviceCategoryToColour(deviceCategory.UNKNOWN, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testsuccess" for RECYCLE with prefix "test"', (done) => {
                // Arrange
                const expected = "testsuccess";
                const prefix = "test";

                // Act
                const result = deviceCategory.deviceCategoryToColour(deviceCategory.RECYCLE, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testwarning" for CURRENT with prefix "test"', (done) => {
                // Arrange
                const expected = "testwarning";
                const prefix = "test";

                // Act
                const result = deviceCategory.deviceCategoryToColour(deviceCategory.CURRENT, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testinfo" for RARE with prefix "test"', (done) => {
                // Arrange
                const expected = "testinfo";
                const prefix = "test";

                // Act
                const result = deviceCategory.deviceCategoryToColour(deviceCategory.RARE,prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "secondary" for UNKNOWN with prefix null', (done) => {
                // Arrange
                const expected = "secondary";
                const prefix = null;

                // Act
                const result =  deviceCategory.deviceCategoryToColour(deviceCategory.UNKNOWN, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "secondary" for UNKNOWN with prefix 0', (done) => {
                // Arrange
                const expected = "secondary";
                const prefix = 0;

                // Act
                const result =  deviceCategory.deviceCategoryToColour(deviceCategory.UNKNOWN, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "secondary" for UNKNOWN with prefix true', (done) => {
                // Arrange
                const expected = "secondary";
                const prefix = true;

                // Act
                const result =  deviceCategory.deviceCategoryToColour(deviceCategory.UNKNOWN, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "secondary" for UNKNOWN with prefix false', (done) => {
                // Arrange
                const expected = "secondary";
                const prefix = false;

                // Act
                const result =  deviceCategory.deviceCategoryToColour(deviceCategory.UNKNOWN, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testsecondary" for passing in a value not of deviceCategory with prefix "test"', (done) => {
                // Arrange
                const expected = "testsecondary";
                const prefix = "test";
                // Act
                const result =  deviceCategory.deviceCategoryToColour(99,prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });
        });
    });

    describe('Test deviceCategoryToRGB', () => {
        describe('Test with border = false', () => {
            it('should return "rgba(255, 165, 0, 0.2)" for CURRENT', (done) => {
                // Arrange
                const expected = "rgba(255, 165, 0, 0.2)";
                const border = false;

                // Act
                const result = deviceCategory.deviceCategoryToRGB(deviceCategory.CURRENT);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgba(13,202,240, 0.2)" for RARE', (done) => {
                // Arrange
                const expected = "rgba(13,202,240, 0.2)";
                const border = false;

                // Act
                const result = deviceCategory.deviceCategoryToRGB(deviceCategory.RARE);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgba(0, 128, 0, 0.2)" for RECYCLE', (done) => {
                // Arrange
                const expected = "rgba(0, 128, 0, 0.2)";
                const border = false;

                // Act
                const result = deviceCategory.deviceCategoryToRGB(deviceCategory.RECYCLE);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgba(255, 99, 132, 0.2)" for UNKNOWN', (done) => {
                // Arrange
                const expected = "rgba(255, 99, 132, 0.2)";
                const border = false;

                // Act
                const result = deviceCategory.deviceCategoryToRGB(deviceCategory.UNKNOWN);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgba(255, 99, 132, 0.2)" for passing in a value not of deviceCategory', (done) => {
                // Arrange
                const expected = "rgba(255, 99, 132, 0.2)";
                const border = false;

                // Act
                const result = deviceCategory.deviceCategoryToRGB(99);

                // Assert
                expect(result).to.equal(expected);
                done();
            });
        });

        describe('Test with border = true', () => {
            it('should return "rgb(255, 165, 0)" for CURRENT with border', (done) => {
                // Arrange
                const expected = "rgb(255, 165, 0)";
                const border = true;

                // Act
                const result = deviceCategory.deviceCategoryToRGB(deviceCategory.CURRENT,border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgb(13,202,240)" for RARE with border', (done) => {
                // Arrange
                const expected = "rgb(13,202,240)";
                const border = true;

                // Act
                const result = deviceCategory.deviceCategoryToRGB(deviceCategory.RARE,border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgb(0, 128, 0)" for RECYCLE with border', (done) => {
                // Arrange
                const expected = "rgb(0, 128, 0)";
                const border = true;

                // Act
                const result = deviceCategory.deviceCategoryToRGB(deviceCategory.RECYCLE,border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgb(255, 99, 132)" for UNKNOWN with border', (done) => {
                // Arrange
                const expected = "rgb(255, 99, 132)";
                const border = true;

                // Act
                const result = deviceCategory.deviceCategoryToRGB(deviceCategory.UNKNOWN,border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgb(255, 99, 132)" for passing in a value not of deviceCategory with border', (done) => {
                // Arrange
                const expected = "rgb(255, 99, 132)";
                const border = true;

                // Act
                const result = deviceCategory.deviceCategoryToRGB(99,border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });
        });

        describe('Test getList', () => {
            it('should return an array of four values', (done) => {
                // Arrange
                const expectedLength = 4;

                // Act
                const result = deviceCategory.getList();
                const length = result.length;

                // Assert
                expect(length).to.equal(expectedLength);
                done();
            });

            it('should return an array with only numbers', (done) => {
                // Arrange
                const expectedType = 'number';

                // Act
                const result = deviceCategory.getList();

                // Assert
                // The result should only contain numbers
                result.forEach(value => {
                    expect(typeof value).to.equal(expectedType);
                });

                done();
            });

            it('should return an array with the values of the enum', (done) => {
                // Arrange
                const expected = [0, 1, 2, 3];

                // Act
                const result = deviceCategory.getList();

                // Assert
                // The result should contain all of the expected values in any order
                expect(result).to.have.members(expected);

                done();
            });

            it('should return an array with a length of four', (done) => {
                // Arrange
                const expected = 4;

                // Act
                const result = deviceCategory.getList();

                // Assert
                expect(result.length).to.equal(expected);
                done();
            });
        });
    });
});
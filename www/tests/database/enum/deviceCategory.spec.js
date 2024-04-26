const expect = require('chai').expect;

const deviceCategory = require('../../../model/enum/deviceCategory');

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
        });

        describe('Test with border = true', () => {
            it('should return "rgb(255, 165, 0)" for CURRENT', (done) => {
                // Arrange
                const expected = "rgb(255, 165, 0)";
                const border = true;

                // Act
                const result = deviceCategory.deviceCategoryToRGB(deviceCategory.CURRENT,border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgb(13,202,240)" for RARE', (done) => {
                // Arrange
                const expected = "rgb(13,202,240)";
                const border = true;

                // Act
                const result = deviceCategory.deviceCategoryToRGB(deviceCategory.RARE,border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgb(0, 128, 0)" for RECYCLE', (done) => {
                // Arrange
                const expected = "rgb(0, 128, 0)";
                const border = true;

                // Act
                const result = deviceCategory.deviceCategoryToRGB(deviceCategory.RECYCLE,border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "rgb(255, 99, 132)" for UNKNOWN', (done) => {
                // Arrange
                const expected = "rgb(255, 99, 132)";
                const border = true;

                // Act
                const result = deviceCategory.deviceCategoryToRGB(deviceCategory.UNKNOWN,border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });
        });
    });
});
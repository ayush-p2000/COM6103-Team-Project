const expect = require('chai').expect;

const dataTypes = require('../../../model/enum/dataTypes');

describe('Test Data Types Enum', () => {
    describe('Test Data Types Values', () => {
        it('should have an IMAGE value of 8', (done) => {
            // Arrange
            const expected = 8;

            // Act
            const result = dataTypes.IMAGE;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have a FILE value of 9', (done) => {
            // Arrange
            const expected = 9;

            // Act
            const result = dataTypes.FILE;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have a URL value of 10', (done) => {
            // Arrange
            const expected = 10;

            // Act
            const result = dataTypes.URL;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have an ARCHIVE value of 11', (done) => {
            // Arrange
            const expected = 11;

            // Act
            const result = dataTypes.ARCHIVE;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have only four values', (done) => {
            // Arrange
            const expected = 4;

            // Act
            const result = Object.values(dataTypes).filter(value => typeof value === 'number').length;

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
            const result = dataTypes.getList();
            const length = result.length;

            // Assert
            expect(length).to.equal(expectedLength);
            done();
        });

        it('should return an array with only numbers', (done) => {
            // Arrange
            const expectedType = 'number';

            // Act
            const result = dataTypes.getList();

            // Assert
            // The result should only contain numbers
            result.forEach(value => {
                expect(typeof value).to.equal(expectedType);
            });

            done();
        });

        it('should return an array with the values of the enum', (done) => {
            // Arrange
            const expected = [8, 9, 10, 11];

            // Act
            const result = dataTypes.getList();

            // Assert
            // The result should contain all of the expected values in any order
            expect(result).to.have.members(expected);

            done();
        });

        it('should return an array with a length of four', (done) => {
            // Arrange
            const expected = 4;

            // Act
            const result = dataTypes.getList();

            // Assert
            expect(result.length).to.equal(expected);
            done();
        });
    });

    describe('Test dataTypeToString', () => {
        it('should return "Image" when passed IMAGE', (done) => {
            // Arrange
            const expected = 'Image';
            const dataType = dataTypes.IMAGE;

            // Act
            const result = dataTypes.dataTypeToString(dataType);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "File" when passed FILE', (done) => {
            // Arrange
            const expected = 'File';
            const dataType = dataTypes.FILE;

            // Act
            const result = dataTypes.dataTypeToString(dataType);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "URL" when passed URL', (done) => {
            // Arrange
            const expected = 'URL';
            const dataType = dataTypes.URL;

            // Act
            const result = dataTypes.dataTypeToString(dataType);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "Compressed File" when passed ARCHIVE', (done) => {
            // Arrange
            const expected = 'Compressed File';
            const dataType = dataTypes.ARCHIVE;

            // Act
            const result = dataTypes.dataTypeToString(dataType);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "Unknown" when passed an invalid value', (done) => {
            // Arrange
            const expected = 'Unknown';
            const dataType = -1;

            // Act
            const result = dataTypes.dataTypeToString(dataType);

            // Assert
            expect(result).to.equal(expected);
            done();
        });
    });

    describe('Test dataTypeToColour', () => {
        describe('Test with no prefix', () => {
            it('should return "dark" when passed IMAGE', (done) => {
                // Arrange
                const expected = 'dark';
                const dataType = dataTypes.IMAGE;

                // Act
                const result = dataTypes.dataTypeToColour(dataType);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "secondary" when passed FILE', (done) => {
                // Arrange
                const expected = 'secondary';
                const dataType = dataTypes.FILE;

                // Act
                const result = dataTypes.dataTypeToColour(dataType);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "info" when passed URL', (done) => {
                // Arrange
                const expected = 'info';
                const dataType = dataTypes.URL;

                // Act
                const result = dataTypes.dataTypeToColour(dataType);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "warning" when passed ARCHIVE', (done) => {
                // Arrange
                const expected = 'warning';
                const dataType = dataTypes.ARCHIVE;

                // Act
                const result = dataTypes.dataTypeToColour(dataType);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "secondary" when passed an invalid value', (done) => {
                // Arrange
                const expected = 'secondary';
                const dataType = -1;

                // Act
                const result = dataTypes.dataTypeToColour(dataType);

                // Assert
                expect(result).to.equal(expected);
                done();
            });
        });

        describe('Test with a prefix', () => {
            it('should return "testdark" when passed IMAGE and "test"', (done) => {
                // Arrange
                const expected = 'testdark';
                const dataType = dataTypes.IMAGE;
                const prefix = 'test';

                // Act
                const result = dataTypes.dataTypeToColour(dataType, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testsecondary" when passed FILE and "test"', (done) => {
                // Arrange
                const expected = 'testsecondary';
                const dataType = dataTypes.FILE;
                const prefix = 'test';

                // Act
                const result = dataTypes.dataTypeToColour(dataType, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testinfo" when passed URL and "test"', (done) => {
                // Arrange
                const expected = 'testinfo';
                const dataType = dataTypes.URL;
                const prefix = 'test';

                // Act
                const result = dataTypes.dataTypeToColour(dataType, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testwarning" when passed ARCHIVE and "test"', (done) => {
                // Arrange
                const expected = 'testwarning';
                const dataType = dataTypes.ARCHIVE;
                const prefix = 'test';

                // Act
                const result = dataTypes.dataTypeToColour(dataType, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "testsecondary" when passed an invalid value and "test"', (done) => {
                // Arrange
                const expected = 'testsecondary';
                const dataType = -1;
                const prefix = 'test';

                // Act
                const result = dataTypes.dataTypeToColour(dataType, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "secondary" when passed an invalid value and ""', (done) => {
                // Arrange
                const expected = 'secondary';
                const dataType = -1;
                const prefix = '';

                // Act
                const result = dataTypes.dataTypeToColour(dataType, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "secondary" when passed an invalid value and undefined', (done) => {
                // Arrange
                const expected = 'secondary';
                const dataType = -1;
                const prefix = undefined;

                // Act
                const result = dataTypes.dataTypeToColour(dataType, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "secondary" when passed an invalid value and null', (done) => {
                // Arrange
                const expected = 'secondary';
                const dataType = -1;
                const prefix = null;

                // Act
                const result = dataTypes.dataTypeToColour(dataType, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "secondary" when passed an invalid value and 0', (done) => {
                // Arrange
                const expected = 'secondary';
                const dataType = -1;
                const prefix = 0;

                // Act
                const result = dataTypes.dataTypeToColour(dataType, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "secondary" when passed an invalid value and false', (done) => {
                // Arrange
                const expected = 'secondary';
                const dataType = -1;
                const prefix = false;

                // Act
                const result = dataTypes.dataTypeToColour(dataType, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });
        });
    });
});
const expect = require('chai').expect;

const accountStatus = require('../../../model/enum/accountStatus');

describe('Test Account Status Enum', () => {
    describe('Test Account Status Values', () => {
        it('should have an INACTIVE value of 0', (done) => {
            // Arrange
            const expected = 0;

            // Act
            const result = accountStatus.INACTIVE;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have an ACTIVE value of 1', (done) => {
            // Arrange
            const expected = 1;

            // Act
            const result = accountStatus.ACTIVE;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have only two values', (done) => {
            // Arrange
            const expected = 2;

            // Act
            const result = Object.values(accountStatus).filter(value => typeof value === 'number').length;

            // Assert
            expect(result).to.equal(expected);
            done();
        });
    });

    describe('Test getList', () => {
        it('should return an array of two values', (done) => {
            // Arrange
            const expectedLength = 2;

            // Act
            const result = accountStatus.getList();
            const length = result.length;

            // Assert
            expect(length).to.equal(expectedLength);

            done();
        });

        it('should return an array with only numbers', (done) => {
            // Arrange
            const expected = [0, 1];

            // Act
            const result = accountStatus.getList();

            // Assert
            // The result should contain all of the expected values in any order
            expect(result).to.have.members(expected);

            done();
        });

        it('should only return numbers', (done) => {
            // Arrange
            const expectedType = 'number';

            // Act
            const list = accountStatus.getList();

            // Assert
            list.forEach((value) => {
                expect(typeof value).to.equal(expectedType);
            });
            done();
        });
    });

    describe('Test accountStatusToRGB', () => {
        it('should return green, opacity 0.2 for ACTIVE, border = false', (done) => {
            // Arrange
            const status = 1;
            const border = false;
            const expectedRGB = 'rgba(0, 128, 0, 0.2)';

            // Act
            const result = accountStatus.accountStatusToRGB(status, border);

            // Assert
            expect(result).to.equal(expectedRGB);
            done();
        });

        it('should return green for ACTIVE, border = true', (done) => {
            // Arrange
            const status = 1;
            const border = true;
            const expectedRGB = 'rgb(0, 128, 0)';

            // Act
            const result = accountStatus.accountStatusToRGB(status, border);

            // Assert
            expect(result).to.equal(expectedRGB);
            done();
        });

        it('should return red, opacity 0.2 for INACTIVE, border = false', (done) => {
            // Arrange
            const status = 0;
            const border = false;
            const expectedRGB = 'rgba(255, 99, 132, 0.2)';

            // Act
            const result = accountStatus.accountStatusToRGB(status, border);

            // Assert
            expect(result).to.equal(expectedRGB);
            done();
        });

        it('should return red for INACTIVE, border = true', (done) => {
            // Arrange
            const status = 0;
            const border = true;
            const expectedRGB = 'rgb(255, 99, 132)';

            // Act
            const result = accountStatus.accountStatusToRGB(status, border);

            // Assert
            expect(result).to.equal(expectedRGB);
            done();
        });

        it('should return orange, opacity 0.2 for unknown status, border = false', (done) => {
            // Arrange
            const status = 2;
            const border = false;
            const expectedRGB = 'rgba(255, 165, 0, 0.2)';

            // Act
            const result = accountStatus.accountStatusToRGB(status, border);

            // Assert
            expect(result).to.equal(expectedRGB);
            done();
        });

        it('should return orange for unknown status, border = true', (done) => {
            // Arrange
            const status = 2;
            const border = true;
            const expectedRGB = 'rgb(255, 165, 0)';

            // Act
            const result = accountStatus.accountStatusToRGB(status, border);

            // Assert
            expect(result).to.equal(expectedRGB);
            done();
        });
    });
});
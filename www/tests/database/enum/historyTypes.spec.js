const {expect} = require('chai')

const historyType = require('../../../model/enum/historyType')

describe('Test History Types enum', () => {

    describe('Test History Types Values', () => {
        it('should have an REVIEW_REQUESTED value of 0', (done) => {
            // Arrange
            const expected = 0;

            // Act
            const result = historyType.REVIEW_REQUESTED;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have an REVIEW_ACCEPTED value of 1', (done) => {
            // Arrange
            const expected = 1;

            // Act
            const result = historyType.REVIEW_ACCEPTED;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have an REVIEW_REJECTED value of 2', (done) => {
            // Arrange
            const expected = 2;

            // Act
            const result = historyType.REVIEW_REJECTED;

            // Assert
            expect(result).to.equal(expected);
            done();
        });
        it('should have an ITEM_HIDDEN value of 3', (done) => {
            // Arrange
            const expected = 3;

            // Act
            const result = historyType.ITEM_HIDDEN;

            // Assert
            expect(result).to.equal(expected);
            done();
        });
        it('should have an ITEM_UNHIDDEN value of 4', (done) => {
            // Arrange
            const expected = 4;

            // Act
            const result = historyType.ITEM_UNHIDDEN;

            // Assert
            expect(result).to.equal(expected);
            done();
        });
        it('should have an ITEM_APPROVED value of 5', (done) => {
            // Arrange
            const expected = 5;

            // Act
            const result = historyType.ITEM_APPROVED;

            // Assert
            expect(result).to.equal(expected);
            done();
        });
        it('should have an UNKNOWN_DEVICE value of 6', (done) => {
            // Arrange
            const expected = 6;

            // Act
            const result = historyType.UNKNOWN_DEVICE;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

    });

    describe('historyTypeToString', function() {
        it('should return correct string for each type', function() {
            expect(historyType.historyTypeToString(historyType.REVIEW_REQUESTED)).to.equal("Review Requested");
            expect(historyType.historyTypeToString(historyType.REVIEW_ACCEPTED)).to.equal("Review Accepted");
            expect(historyType.historyTypeToString(historyType.REVIEW_REJECTED)).to.equal("Review Rejected");
            expect(historyType.historyTypeToString(historyType.ITEM_HIDDEN)).to.equal("Item Hidden");
            expect(historyType.historyTypeToString(historyType.ITEM_UNHIDDEN)).to.equal("Item Unhidden");
            expect(historyType.historyTypeToString(historyType.ITEM_APPROVED)).to.equal("Item Approved");
            expect(historyType.historyTypeToString(historyType.UNKNOWN_DEVICE)).to.equal("Unknown Device");
            expect(historyType.historyTypeToString(999)).to.equal("Unknown");
        });
    });

    describe('historyTypeToColour', function() {
        it('should return correct colour class for each type', function() {
            expect(historyType.historyTypeToColour(historyType.REVIEW_REQUESTED)).to.equal("warning");
            expect(historyType.historyTypeToColour(historyType.REVIEW_ACCEPTED)).to.equal("success");
            expect(historyType.historyTypeToColour(historyType.REVIEW_REJECTED, "bg-")).to.equal("bg-danger");
            expect(historyType.historyTypeToColour(historyType.ITEM_HIDDEN)).to.equal("warning");
            expect(historyType.historyTypeToColour(historyType.ITEM_UNHIDDEN, "text-")).to.equal("text-info");
            expect(historyType.historyTypeToColour(historyType.ITEM_APPROVED)).to.equal("success");
            expect(historyType.historyTypeToColour(historyType.UNKNOWN_DEVICE)).to.equal("secondary");
            expect(historyType.historyTypeToColour(999, "text-")).to.equal("text-secondary");
        });
    });

    describe('getList', function() {
        it('should return a list of all history types', function() {
            const expectedList = [
                historyType.REVIEW_REQUESTED,
                historyType.REVIEW_ACCEPTED,
                historyType.REVIEW_REJECTED,
                historyType.ITEM_HIDDEN,
                historyType.ITEM_UNHIDDEN,
                historyType.ITEM_APPROVED,
                historyType.UNKNOWN_DEVICE
            ];
            expect(historyType.getList()).to.have.members(expectedList);
            expect(historyType.getList()).to.be.an('array').that.does.not.include('historyTypeToString');
        });
    });

})
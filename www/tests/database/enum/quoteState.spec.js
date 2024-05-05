const {expect} = require('chai')

const {quoteState} = require('../../../model/enum/quoteState')

describe('Quote State', function() {

    describe('Test quote state Values', () => {
        it('should have an NEW value of 0', (done) => {
            // Arrange
            const expected = 0;

            // Act
            const result = quoteState.NEW;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have an SAVED value of 1', (done) => {
            // Arrange
            const expected = 1;

            // Act
            const result = quoteState.SAVED;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have an ACCEPTED value of 3', (done) => {
            // Arrange
            const expected = 3;

            // Act
            const result = quoteState.ACCEPTED;

            // Assert
            expect(result).to.equal(expected);
            done();
        });
        it('should have an REJECTED value of 2', (done) => {
            // Arrange
            const expected = 2;

            // Act
            const result = quoteState.REJECTED;

            // Assert
            expect(result).to.equal(expected);
            done();
        });
        it('should have an CONVERTED value of 4', (done) => {
            // Arrange
            const expected = 4;

            // Act
            const result = quoteState.CONVERTED;

            // Assert
            expect(result).to.equal(expected);
            done();
        });
        it('should have an EXPIRED value of 5', (done) => {
            // Arrange
            const expected = 5;

            // Act
            const result = quoteState.EXPIRED;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

    });



    describe('stateToString', function() {
        it('should convert each state to the correct string', function() {
            expect(quoteState.stateToString(quoteState.NEW)).to.equal("New");
            expect(quoteState.stateToString(quoteState.SAVED)).to.equal("Saved");
            expect(quoteState.stateToString(quoteState.REJECTED)).to.equal("Rejected");
            expect(quoteState.stateToString(quoteState.ACCEPTED)).to.equal("Accepted");
            expect(quoteState.stateToString(quoteState.CONVERTED)).to.equal("Converted");
            expect(quoteState.stateToString(quoteState.EXPIRED)).to.equal("Expired");
            expect(quoteState.stateToString(999)).to.equal("Invalid state"); // Testing default case
        });
    });

    describe('stateToColour', function() {
        it('should return correct colour class for each state', function() {
            expect(quoteState.stateToColour(quoteState.NEW)).to.equal("primary");
            expect(quoteState.stateToColour(quoteState.SAVED, "bg-")).to.equal("bg-info");
            expect(quoteState.stateToColour(quoteState.REJECTED)).to.equal("danger");
            expect(quoteState.stateToColour(quoteState.ACCEPTED, "text-")).to.equal("text-warning");
            expect(quoteState.stateToColour(quoteState.CONVERTED)).to.equal("success");
            expect(quoteState.stateToColour(quoteState.EXPIRED)).to.equal("secondary");
            expect(quoteState.stateToColour(999)).to.equal("light");
        });
        it('should handle non-string prefix values appropriately', function() {
            expect(quoteState.stateToColour(quoteState.NEW, undefined)).to.equal("primary");
            expect(quoteState.stateToColour(quoteState.SAVED, null)).to.equal("info");
            expect(quoteState.stateToColour(quoteState.REJECTED, true)).to.equal("danger");
            expect(quoteState.stateToColour(quoteState.ACCEPTED, false)).to.equal("warning");
            expect(quoteState.stateToColour(quoteState.CONVERTED, 123)).to.equal("success");
        });
    });

    describe('quoteStateToRGB', function() {
        it('should return correct RGB values for each state, with border variations', function() {
            expect(quoteState.quoteStateToRGB(quoteState.NEW)).to.equal('rgba(13, 110, 253, 0.2)');
            expect(quoteState.quoteStateToRGB(quoteState.NEW, true)).to.equal('rgb(13, 110, 253)');
            expect(quoteState.quoteStateToRGB(quoteState.SAVED, true)).to.equal('rgb(0, 191, 255)');
            expect(quoteState.quoteStateToRGB(quoteState.ACCEPTED, true)).to.be.equal('rgb(255, 165, 0)');
            expect(quoteState.quoteStateToRGB(quoteState.REJECTED, true)).to.equal('rgb(255, 0, 0)');
            expect(quoteState.quoteStateToRGB(quoteState.EXPIRED, true)).to.equal('rgb(128, 128, 128)');
            expect(quoteState.quoteStateToRGB(quoteState.CONVERTED, true)).to.be.equal('rgb(0, 128, 0)')
            expect(quoteState.quoteStateToRGB(quoteState.NEW, false)).to.equal('rgba(13, 110, 253, 0.2)');
            expect(quoteState.quoteStateToRGB(quoteState.SAVED, false)).to.equal('rgba(0, 191, 255, 0.2)');
            expect(quoteState.quoteStateToRGB(quoteState.ACCEPTED, false)).to.be.equal('rgba(255, 165, 0, 0.2)');
            expect(quoteState.quoteStateToRGB(quoteState.REJECTED, false)).to.equal('rgba(255, 0, 0, 0.2)');
            expect(quoteState.quoteStateToRGB(quoteState.EXPIRED, false)).to.equal('rgba(128, 128, 128, 0.2)');
            expect(quoteState.quoteStateToRGB(quoteState.CONVERTED, false)).to.be.equal('rgba(0, 128, 0, 0.2)')
            expect(quoteState.quoteStateToRGB(932)).to.be.equal('rgba(255, 165, 0, 0.2)')
        });
    });

    describe('getList', function() {
        it('should return a list of all quote states as numbers', function() {
            const expectedList = [quoteState.NEW, quoteState.SAVED, quoteState.REJECTED, quoteState.ACCEPTED, quoteState.CONVERTED, quoteState.EXPIRED];

            const resultList = quoteState.getList()
            expect(resultList).to.deep.equal(expectedList);
            expect(resultList).to.be.an('array').that.has.lengthOf(6);
            resultList.forEach(item => expect(item).to.be.a('number'))
        });
    });
});
const {expect} = require("chai");
const proxyquire = require('proxyquire');

const sandbox = require('sinon').createSandbox();

const dotenv = require('dotenv')
const parse = require('dotenv-parse-variables')

let env = dotenv.config({path: __dirname + '../../../../.env.test'})
if (env.error) {
    throw env.error
}
env = parse(env, {assignToProcessEnv: true, overrideProcessEnv: true})

const roleTypes = require('../../../model/enum/roleTypes');


describe('Test Role Types Enum', () => {
    describe('Test Role Types Values', () => {
        it('should have an USER value of 0', (done) => {
            // Arrange
            const expected = 0;

            // Act
            const result = roleTypes.USER;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have a STAFF value of 1', (done) => {
            // Arrange
            const expected = 1;

            // Act
            const result = roleTypes.STAFF;

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should have a ADMIN value of 2', (done) => {
            // Arrange
            const expected = 2;

            // Act
            const result = roleTypes.ADMIN;

            // Assert
            expect(result).to.equal(expected);
            done();
        });
    });

    describe('Test getList',() => {
        it('should return an array with only numbers', (done) => {
            // Arrange
            const expectedType = 'number';

            // Act
            const result = roleTypes.getList();

            // Assert
            // The result should only contain numbers
            result.forEach(value => {
                expect(typeof value).to.equal(expectedType);
            });

            done();
        });

        it('should return an array with the values of the enum', (done) => {
            // Arrange
            const expected = [0, 1, 2];

            // Act
            const result = roleTypes.getList();

            // Assert
            // The result should contain all of the expected values in any order
            expect(result).to.have.members(expected);

            done();
        });

        it('should return an array with a length of four', (done) => {
            // Arrange
            const expected = 3;

            // Act
            const result = roleTypes.getList();

            // Assert
            expect(result.length).to.equal(expected);
            done();
        });
    });

    describe('Test dataTypeToString', () => {
        it('should return "Staff" when passed STAFF', (done) => {
            // Arrange
            const expected = 'Staff';
            const dataType = roleTypes.STAFF;

            // Act
            const result = roleTypes.roleTypeToString(dataType);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "User" when passed USER', (done) => {
            // Arrange
            const expected = 'User';
            const dataType = roleTypes.USER;

            // Act
            const result = roleTypes.roleTypeToString(dataType);

            // Assert
            expect(result).to.equal(expected);
            done();
        });

        it('should return "Admin" when passed ADMIN', (done) => {
            // Arrange
            const expected = 'Admin';
            const dataType = roleTypes.ADMIN;

            // Act
            const result = roleTypes.roleTypeToString(dataType);

            // Assert
            expect(result).to.equal(expected);
            done();
        });
    });
    describe('Test dataTypeToColour', () => {
        describe('Test with no prefix', () => {
            it('should return "rgb(0, 128, 0)" when passed USER', (done) => {
                // Arrange
                const expected = 'rgba(0, 128, 0, 0.2)';
                const dataType = roleTypes.USER;

                // Act
                const result = roleTypes.roleTypeToRGB(dataType);

                // Assert
                expect(result).to.equal(expected);
                done();
            });


            });
        });
    });

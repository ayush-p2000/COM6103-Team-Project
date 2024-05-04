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

    describe('Test getList', () => {
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

    describe('Test roleTypeToString', () => {
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

    describe('Test roleTypeToRGB', () => {
        describe('Test with border false for admin', () => {
            it('should return "rgba(0,0,255, 0.2)" when passed ADMIN', (done) => {
                // Arrange
                const expected = 'rgba(0,0,255, 0.2)';
                const dataType = roleTypes.ADMIN;
                const border = false;

                // Act
                const result = roleTypes.roleTypeToRGB(dataType, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });


            it('should return "rgba(255, 165, 0, 0.2)" when passed STAFF', (done) => {
                // Arrange
                const expected = 'rgba(255, 165, 0, 0.2)';
                const dataType = roleTypes.STAFF;
                const border = false;

                // Act
                const result = roleTypes.roleTypeToRGB(dataType, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });


            it('should return "rgba(0, 128, 0, 0.2)" when passed USER', (done) => {
                // Arrange
                const expected = 'rgba(0, 128, 0, 0.2)';
                const dataType = roleTypes.USER;
                const border = false;

                // Act
                const result = roleTypes.roleTypeToRGB(dataType, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });


            it('should return "rgb(255, 165, 0)" when passed STAFF', (done) => {
                // Arrange
                const expected = 'rgb(255, 165, 0)';
                const dataType = roleTypes.STAFF;
                const border = true;

                // Act
                const result = roleTypes.roleTypeToRGB(dataType, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });


            it('should return "rgb(0, 128, 0)" when passed USER', (done) => {
                // Arrange
                const expected = 'rgb(0, 128, 0)';
                const dataType = roleTypes.USER;
                const border = true;

                // Act
                const result = roleTypes.roleTypeToRGB(dataType, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });


            it('should return "rgb(0, 128, 0)" when passed USER', (done) => {
                // Arrange
                const expected = 'rgb(0, 128, 0)';
                const dataType = roleTypes.USER;
                const border = true;

                // Act
                const result = roleTypes.roleTypeToRGB(dataType, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });


            it('should return "rgba(255, 165, 0, 0.2)" when passed null', (done) => {
                // Arrange
                const expected = 'rgba(255, 165, 0, 0.2)';
                const dataType = null;
                const border = false;

                // Act
                const result = roleTypes.roleTypeToRGB(dataType, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });


            it('should return "rgba(255, 165, 0, 0.2)" when passed undefined', (done) => {
                // Arrange
                const expected = 'rgba(255, 165, 0, 0.2)';
                const dataType = undefined;
                const border = false;

                // Act
                const result = roleTypes.roleTypeToRGB(dataType, border);

                // Assert
                expect(result).to.equal(expected);
                done();
            });
        });

        describe('Test roleTypeToColour', () => {
            it('should return "success" when passed USER and prefix = "" ', (done) => {
                // Arrange
                const expected = 'success';
                const rank = roleTypes.USER;
                const prefix = "";

                // Act
                const result = roleTypes.roleTypeToColour(rank, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "success" when passed USER and prefix = "hello" ', (done) => {
                // Arrange
                const expected = 'hellosuccess';
                const rank = roleTypes.USER;
                const prefix = "hello";

                // Act
                const result = roleTypes.roleTypeToColour(rank, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "success" when passed USER and prefix = null ', (done) => {
                // Arrange
                const expected = 'success';
                const rank = roleTypes.USER;
                const prefix = null;

                // Act
                const result = roleTypes.roleTypeToColour(rank, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "warning" when passed STAFF and prefix = null ', (done) => {
                // Arrange
                const expected = 'warning';
                const rank = roleTypes.STAFF;
                const prefix = null;

                // Act
                const result = roleTypes.roleTypeToColour(rank, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "primary" when passed ADMIN and prefix = null ', (done) => {
                // Arrange
                const expected = 'primary';
                const rank = roleTypes.ADMIN;
                const prefix = null;

                // Act
                const result = roleTypes.roleTypeToColour(rank, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });
            it('should return "warning" when passed USER and prefix = "hello" ', (done) => {
                // Arrange
                const expected = 'hellowarning';
                const rank = roleTypes.STAFF;
                const prefix = "hello";

                // Act
                const result = roleTypes.roleTypeToColour(rank, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });
            it('should return "primary" when passed USER and prefix = "hello" ', (done) => {
                // Arrange
                const expected = 'helloprimary';
                const rank = roleTypes.ADMIN;
                const prefix = "hello";

                // Act
                const result = roleTypes.roleTypeToColour(rank, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

            it('should return "secondary" when passed USER and prefix = "hello" ', (done) => {
                // Arrange
                const expected = 'hellosecondary';
                const rank = null;
                const prefix = "hello";

                // Act
                const result = roleTypes.roleTypeToColour(rank, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });
            it('should return "secondary" when passed USER and prefix = true ', (done) => {
                // Arrange
                const expected = 'secondary';
                const rank = null;
                const prefix = true;

                // Act
                const result = roleTypes.roleTypeToColour(rank, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });
            it('should return "secondary" when passed USER and prefix = true ', (done) => {
                // Arrange
                const expected = 'secondary';
                const rank = null;
                const prefix = false;

                // Act
                const result = roleTypes.roleTypeToColour(rank, prefix);

                // Assert
                expect(result).to.equal(expected);
                done();
            });

        });

    });
});



const {Brand} = require("../../../model/schema/brand");
const expect = require('chai').expect;
describe('Test Brand Model', () => {

    it('should pass with all fields present, and no models', (done) => {
        const testBrand = new Brand({
            name: 'Test Brand',
            is_deleted: false,
            models: []
        });

        const error = testBrand.validateSync();

        expect(error).to.not.exist;

        expect(testBrand.name).to.equal('Test Brand');
        expect(testBrand.is_deleted).to.equal(false);
        expect(testBrand.models).to.eql([]);
        done();
    });

    it('should throw an error due to all fields missing', (done) => {
        const testBrand = new Brand();

        const error = testBrand.validateSync();

        expect(error.errors.name).to.exist;
        done();
        //Models is not required, so it should not throw an error
        //Is_deleted is required, but it has a default value, so it should not throw an error

    });

    it('should fail without name', (done) => {
        const testBrand = new Brand({
            is_deleted: false,
            models: []
        });

        const error = testBrand.validateSync();

        expect(error.errors.name).to.exist;
        done();
    })

    it('should fail if something other than an objectID is in models', (done) => {
        const testBrand = new Brand({
            name: 'Test Brand',
            is_deleted: false,
            models: ['not an objectID']
        });

        const error = testBrand.validateSync();

        expect(error.errors['models.0']).to.exist;
        done();
    });

    it('should pass if models is an array of objectIDs', (done) => {
        const testBrand = new Brand({
            name: 'Test Brand',
            is_deleted: false,
            models: ['5f4f7c8e5b4a3b0e6c0f3d2f']
        });

        const error = testBrand.validateSync();

        expect(error).to.not.exist;
        done();
    });
})
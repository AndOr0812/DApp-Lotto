var Loto = artifacts.require("Loto");
chai = require("chai");
chaiAsPromise = require("chai-as-promised");

chai.use(chaiAsPromise);

expect = chai.expect;

contract("Test the Loto contract", function(accounts) {
    describe("Deploy the Loto smart contract", function() {
        it("Catch an instance of Loto contracts", function() {
            return Loto.new().then(function(instance) {
                lotoContract = instance;
            });
        });
    });

    describe("Check the contract variables",function() {

        it("Check the var - should be 1",function() {
            return lotoContract.ticksN().then(function(res) {
                expect(res.toString()).to.be.equal('1');
            });
        });
    });
});
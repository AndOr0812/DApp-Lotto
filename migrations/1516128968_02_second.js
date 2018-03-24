var Loto = artifacts.require("Loto");
var MultiSig = artifacts.require("MultiSig");

module.exports = function(deployer) {
  deployer.deploy(MultiSig,"1",['0x627306090abab3a6e1400e9345bc60c78a8bef57',
                                '0xf17f52151ebef6c7334fad080c5704d77216b732',
                                '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef'])
  .then(function() {
    return deployer.deploy(Loto,MultiSig.address,{gas: 4612388,from: "0x627306090abab3a6e1400e9345bc60c78a8bef57"});
  });
};
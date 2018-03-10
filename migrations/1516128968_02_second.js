var Loto = artifacts.require("Loto");
//var RandomPick = artifacts.require("RandomPick");

module.exports = function(deployer) {
  deployer.deploy(Loto,{gas: 4612388,from: "0x627306090abab3a6e1400e9345bc60c78a8bef57"});
  //deployer.deploy(RandomPick);
};
const OwnerTestContract = artifacts.require("OwnerTestContract");

module.exports = function(deployer) {
  deployer.deploy(OwnerTestContract);
};

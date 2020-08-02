const OwnerTestContract = artifacts.require("OwnerTestContract");

module.exports = async function(deployer) {
  deployer.deploy(OwnerTestContract);
};

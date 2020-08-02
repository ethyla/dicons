const OwnerTestContract2 = artifacts.require("OwnerTestContract2");

module.exports = async function(deployer) {
  deployer.deploy(OwnerTestContract2);
};

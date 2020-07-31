const IconRegistry = artifacts.require("IconRegistry");
const OwnerTestContract = artifacts.require("OwnerTestContract");

contract("IconRegistry Test", async () => {
  let IconRegistryInstance;
  let OwnerTestContractInstance;

  before(async () => {
    IconRegistryInstance = await IconRegistry.deployed();
    OwnerTestContractInstance = await OwnerTestContract.deployed();
  });

  it("register first smart contract", async () => {
    await IconRegistryInstance.setRegistryValue(
      OwnerTestContractInstance.address,
      "lalala",
      "AwesomeContract",
      "ERC20"
    );
    let entry = await IconRegistryInstance.registry(
      OwnerTestContractInstance.address
    );
    assert.equal(entry["_path"], "lalala");
    assert.equal(entry["_name"], "AwesomeContract");
    assert.equal(entry["_type"], "ERC20");
  });

  it("length of array should be 1", async () => {
    let scAddresses = await IconRegistryInstance.getSCAddresses();
    assert.equal(scAddresses.length, 1);
  });

  it("check address of first smart contract in registry", async () => {
    let scAddresses = await IconRegistryInstance.getSCAddresses();
    assert.equal(scAddresses[0], OwnerTestContractInstance.address);
  });
});

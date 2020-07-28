const IconRegistry = artifacts.require("IconRegistry");

contract("IconRegistry Test", async accounts => {
  it("set an address value", async () => {
    let instance = await IconRegistry.deployed();
    await instance.setRegistryValue(accounts[0], "lalala");
    let value = await instance.registry(accounts[0]);
    assert.equal(value, "lalala");
  });
});

import Web3 from "web3";
import contractData from "../truffle/build/contracts/IconRegistry.json";

let web3 = new Web3("ws://localhost:8545");

let contract = new web3.eth.Contract(
  contractData.abi,
  contractData.networks[1337].address
);

export async function getValueFromAdd(address) {
  return contract.methods.registry(address).call();
}

export async function registerIcon(address, path, name, type) {
  const sendAccount = await web3.eth.getAccounts();
  const result = await contract.methods
    .setRegistryValue(address, path, name, type)
    .send({ from: sendAccount[0], gas: 200000 });
  if (result.transactionHash !== undefined) {
    return true;
  }
  return false;
}

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

export async function setValueToAdd(address, value) {
  let sendAccount = await web3.eth.getAccounts();
  console.log(address);
  await contract.methods
    .setRegistryValue(address, value)
    .send({ from: sendAccount[0] });
}

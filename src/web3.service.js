import Web3 from "web3";
import contractData from "../truffle/build/contracts/IconRegistry.json";

const infuraKey = process.env["VUE_APP_INFURA_API"];
const { ethereum } = window;
let account;

const isMetaMaskInstalled = () => {
  return Boolean(ethereum && ethereum.isMetaMask);
};

if (isMetaMaskInstalled()) {
  console.log("MetaMask is installed!");
} else {
  console.log("no mm");
}

let web3 = new Web3("https://goerli.infura.io/v3/" + infuraKey);

let contract = new web3.eth.Contract(
  contractData.abi,
  contractData.networks[5].address
);

export async function getMMAccount() {
  let accounts = await ethereum.request({ method: "eth_requestAccounts" });
  account = accounts[0];
  return account;
}

export async function getValueFromAdd(address) {
  return contract.methods.registry(address).call();
}

export async function registerIcon(address, path, name, type) {
  const txData = await contract.methods
    .setRegistryValue(address, path, name, type)
    .encodeABI();
  // const gasLimit = await contract.methods
  //   .setRegistryValue(address, path, name, type)
  //   .estimateGas();
  let gasLimit = "50000";
  console.log(contract);
  const transactionParameters = {
    gasPrice: "0x09184e72a0", // customizable by user during MetaMask confirmation.
    gas: gasLimit, // customizable by user during MetaMask confirmation.
    to: contract.options.address, // Required except during contract publications.
    from: ethereum.selectedAddress, // must match user's active address.
    data: txData,
    chainId: 5
  };
  console.log(transactionParameters);
  const txHash = await ethereum.request({
    method: "eth_sendTransaction",
    params: [transactionParameters]
  });
  console.log(txHash);
  if (txHash !== undefined) {
    return true;
  }
  return false;
}

export async function getSmartContractAddresses() {
  return contract.methods.getSCAddresses().call();
}

pragma solidity 0.6.0;

contract IconRegistry {
  address public owner;
  mapping (address=>SmartContractInformation) public registry;
  address[] public scAddresses;

  struct SmartContractInformation {
    string _name;
    string _path;
    string _type;
  }

  constructor() public {
    owner = msg.sender;
  }

  /**
   * _target - Address of smart contract the icon is for
   * _path   - Path to the icon
   * _name   - Name of the smart contract
   * _type   - Type of the smart contract (ERC20, etc.)
   */
  function setRegistryValue(
    address _target,
    string memory _path,
    string memory _name,
    string memory _type) public {
      Owner c = Owner(_target);
      // check if the sender of the transaction is the owner of the smart contract
      require(c.owner() == msg.sender, 'You are not the owner of the contract');
      registry[_target] = SmartContractInformation(_name, _path, _type);
      scAddresses.push(_target);
  }

  /**
   * Returns array which contains all registered smart contract addresses
   */
  function getSCAddresses() public view returns (address[] memory) {
      return scAddresses;
  }
}

/**
 * Interface for contracts which are implementing the
 * Ownership contract by OpenZeppelin
 * (https://docs.openzeppelin.com/contracts/2.x/api/ownership#Ownable-owner--)
 */
interface Owner {
    function owner() external returns(address);
}

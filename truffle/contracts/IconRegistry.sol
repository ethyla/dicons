pragma solidity 0.6.0;

contract IconRegistry {
  address public owner;
  mapping (address=>string) public registry;

  constructor() public {
    owner = msg.sender;
  }

  /**
   * _target - Address of smart contract the icon is for
   * _value  - Path to the icon
   */
  function setRegistryValue(address _target, string memory _value) public {
      Owner c = Owner(_target);
      // check if the sender of the transaction is the owner of the smart contract
      require(c.owner() == msg.sender, 'You are not the owner of the contract');
      registry[_target] = _value;
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

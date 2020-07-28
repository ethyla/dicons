pragma solidity 0.5.16;

contract IconRegistry {
  address public owner;
  mapping (address=>string) public registry;

  constructor() public {
    owner = msg.sender;
  }

  function setRegistryValue(address _target, string memory _value) public  {
    registry[_target] = _value;
  }
}
 
pragma solidity 0.6.0;

//this is for remix
// import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol';
// this is for truffle - somehow not working
// import '@openzeppelin/contracts/access/Ownable.sol';
import './OpenZeppelin/Access/Ownable.sol';

/**
 * This is an empty contract. All we require here is the owner method of the
 * Ownable contract.
 */
contract OwnerTestContract2 is Ownable {
}
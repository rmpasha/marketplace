pragma solidity ^0.4.24;

/**
 * Copied from OpenZeppelin Project but kill() method has added by Rajenda Maharjan
 * @title Ownable
 * @dev The Ownable contract has an contract owner address, and provides basic authorization control
 */
contract Ownable {
  address public owner;

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  /**
   * @dev The constructor sets the original `owner` of the contract to the sender account.
   */
  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner. Modifier for only contract owner
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

  /**
   * @dev Allows contract owner to remove the contract from blockchain
   */
   function kill() public onlyOwner{
       selfdestruct(owner);
   }
   
  /**
   * @dev To get contract balance
   */ 
   function getContractBalance() public view onlyOwner returns(uint) {
       return address(this).balance;
   }
   function transferAllFunds(address newAddress) public onlyOwner returns(uint) {
     address(newAddress).transfer(getContractBalance());
   }
}
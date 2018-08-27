pragma solidity ^0.4.24;

import './Pausable.sol';

/**
 * @title admins_mp
 * @dev The admins_mp contract has an contract admin addresses, Add new admin method and OnlyAdmin modifier
 */
 contract admins_mp is Pausable {

    /**
    * @dev NewAdminEvent calls when contract owner register a new addmin
    */
    event newAdminEvent(address addAdmin);
    
    /**
    * @dev AdminAlreadyExistEvent get called if duplicate admin tries to register
    */
    event adminAlreadyExistEvent(address addAdmin);
    
    /**
    * @dev mapping variable for admins address to bool
    */
    mapping (address => bool) public admins;
    address[] adminGroup;
    /**
    * @dev AddNewAdmin method to insert new admin by contract owner
    * pausable: yes, this method will not run if contract owner pauses the contract
    * params: address for admin
    */
    function addNewAdmin(address _adminAddress) public onlyOwner whenNotPaused
    {
        require(_adminAddress != address(0));
        if(admins[_adminAddress])
        {
            emit adminAlreadyExistEvent(_adminAddress);
            return;
        }
        
        admins[_adminAddress] = true;
        adminGroup.push(_adminAddress);
        emit newAdminEvent(_adminAddress);
    }
    /**
     * This function can be used for validating admin but not using since admins variable is more than enough
    function IsValidAdmin(address _adminAddress) public constant returns (bool) {
        return(admins[_adminAddress]);
    }
    */
    /**
    * @dev Throws if called by any account other than the admins. Modifier for only admins
    */
    modifier onlyAdmin() {
        require(admins[msg.sender] == true);
    _;
    }
    /**
    * @dev To get all admins
    */
    function getAdmins() public view returns(address[]) {
        return adminGroup;
    }
}
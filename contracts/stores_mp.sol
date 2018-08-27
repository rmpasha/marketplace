pragma solidity ^0.4.24;

import "./admins_mp.sol";
import "./SafeMath.sol";
import { library_mp } from "./library_mp.sol";

/**
 * author: Rajenda Maharjan
 * @title stores_mp
 * @dev The stores_mp contract is for stores and owner of the stores. It has store struct and methods.
 */
contract stores_mp is admins_mp {
   /**
    * @dev using SafeMath
    */
    using SafeMath for uint256;
    /**
     * @dev Store owner structure which has all stores and approvedBy admin or not
     * store_name: Name of the store
     * isApproved: true if approved by admin, fals otherwise
     * approvedBy: admin address who approved this owner
     * flag: Always true of a row.
     */
    struct StoreOwner {
        string store_name;
        bool isApproved;
        address approvedBy;     //Admin Address
        bool flag;              //Always true and false when no record.
    }
    /**
     * @dev mapping to store store owner information
     */
    mapping (address => StoreOwner) public store_owners;
    /**
     * @dev mapping to store store owner balance
     */
    mapping (address => uint) public store_owner_balances;
    /**
     * @dev Array store store owner addresses 
     */
    address[] public storeOwnerAddresses;
    /**
     * @dev Event to know empty store name
     * params: store owner address, store name and approved by admin or not 
     */
    event emptyStoreNameEvent(address store_owner, string store_name, bool isApproved);
    /**
     * @dev Event to check duplicate store owner
     * params: store owner address 
     */
    event storeAlreadyExistEvent(address store_owner);
    /**
     * @dev Event for new store registration
     * params: store owner address, store name and here it will passed isApproved=fase
     */
    event newStoreApplicationEvent(address store_owner, string store_name, bool isApproved);
    /**
     * @dev Event for approved by admin
     * params: store owner address, store name and here it will passed isApproved=true
     */
    event approveStoreApplicationEvent(address store_owner, string store_name, bool isApproved);
    /**
     * @dev Event for amount withdrawn notice
     * params: store owner address, amount
     */
    event amountWithdrawn(address storeAddress, uint amountWithdrawn);
    /**
     * @dev Register new store method but still need to approve by admin
     * params: store name
     * pausable: yes
     */
    function addNewStore(string _store_name) public whenNotPaused {
        /**
         * @dev Check if same address already exist. using One Address One Store Concept. If already store name is 
         * there with same address, don't create multiple
         */
        if(store_owners[msg.sender].flag) {
            emit storeAlreadyExistEvent(msg.sender);
            return;
        }
        //Check empty string value paramemter for Store
        if(library_mp.IsEmptyString(_store_name)) {
            emit emptyStoreNameEvent(msg.sender, _store_name, false);
            return;
        }
        StoreOwner memory newStore=StoreOwner({store_name: _store_name, isApproved: false, 
                approvedBy: address(0), flag: true});
        store_owners[msg.sender] = newStore;
        storeOwnerAddresses.push(msg.sender)-1;
        
        emit newStoreApplicationEvent(msg.sender, _store_name, false);
    }
    /**
     * @dev To get all store addresses. This is accessible to all.
     */
    function getAllStoreAddresses() public view returns(address[]) {
        return storeOwnerAddresses;
    }

    /**
     * @dev Get Store details by store owner address
     * params: store owner address
     * returns: store name, appoved or not, appoved admin address
     * pausable: yes
     */
    function getStoreByAddress(address _storeOwnerAddress) public view whenNotPaused returns(string, bool, address) {
        require(_storeOwnerAddress != address(0));
        require(store_owners[_storeOwnerAddress].flag);
        return(store_owners[_storeOwnerAddress].store_name, store_owners[_storeOwnerAddress].isApproved, store_owners[_storeOwnerAddress].approvedBy);
    }
    /**
     * @dev this function can be used for validating store owner but not using since public variable does this job
     *function IsValidStoreOwner(address _storeOwnerAddress) public constant returns(bool) {
     *   require(_storeOwnerAddress!=address(0));
     *   return(store_owners[_storeOwnerAddress].flag);
     *}
     */
    /**
     * @dev Throws if called by any account other than the store owner. Modifier for only store owner
     */
    modifier onlyStoreOwner() {
        require(store_owners[msg.sender].flag==true);
        _;
    }

    /**
     * @dev calls this method when admin approves store
     * params: store owner address
     * pausable: yes
     */
    function approveStoreByAdmin(address _storeOwnerAddress) public onlyAdmin whenNotPaused {
        require(_storeOwnerAddress != address(0));
        require(admins[msg.sender]);    //should be in admin List
        store_owners[_storeOwnerAddress].isApproved=true;
        store_owners[_storeOwnerAddress].approvedBy=msg.sender;
        emit approveStoreApplicationEvent(_storeOwnerAddress, store_owners[_storeOwnerAddress].store_name, true);
    }
    /**
     * @dev To withdraw amount by store owner to their wallet address from contract balance
     * params: store owner address
     * pausable: yes
     */
    function withdrawAmount(uint _amountToWithdraw) public onlyStoreOwner whenNotPaused {
        require(address(this).balance >= _amountToWithdraw);
        require(store_owner_balances[msg.sender] >= _amountToWithdraw);
        //Checking underflow and overflow
        if(address(msg.sender).balance + _amountToWithdraw >= address(msg.sender).balance  && address(msg.sender).balance - _amountToWithdraw <= address(msg.sender).balance) { 
            //To avoid Reentrancy, the below line should be before transfering actual amount
            store_owner_balances[msg.sender] -= _amountToWithdraw;
            address(msg.sender).transfer(_amountToWithdraw);
            emit amountWithdrawn(msg.sender, _amountToWithdraw);
        }
    }
    function getStoreOwnerBalance() public view onlyStoreOwner returns(uint) {
       return address(msg.sender).balance;
    }  
    /**
     * @dev delete store can be implemented if needed but need further attention
     *function deleteStore(address _storeOwnerAddress) public onlyAdmin whenNotPaused {
     *   require(_storeOwnerAddress != address(0));
     *   require(admins[msg.sender]);    //should be in admin List
     *   delete store_owners[_storeOwnerAddress];
     *}
     */
    /**
     * @dev To get max amount that store owner can transfer to their wallet. accessible only for store owner
     * pausable: yes
     */
    function getMaxAmountCanWithdraw() public view onlyStoreOwner whenNotPaused returns (uint) {
        return store_owner_balances[msg.sender];
    }
    
   
   /** enum USER_TYPE returns 
     * 0 for CONTRACT_OWNER, 
     * 1 for ADMIN, 
     * 2 for STORE_OWNER 
     * 3 for USER
     */
    enum USER_TYPE { CONTRACT_OWNER, ADMIN, STORE_OWNER, USER }
    /**
     * @dev To get the currently logon user getUserType.
     * returns 0, 1, 2 or 3
     */
    function getUserType() public constant returns(USER_TYPE)
    {
        if(msg.sender == owner)
            return USER_TYPE.CONTRACT_OWNER;
        if(admins[msg.sender])
            return USER_TYPE.ADMIN;
        if(store_owners[msg.sender].flag)
            return USER_TYPE.STORE_OWNER;
        else
            return USER_TYPE.USER;
    }
}
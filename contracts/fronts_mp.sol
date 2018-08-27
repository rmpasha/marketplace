pragma solidity ^0.4.24;

import './stores_mp.sol';
/**
 * author: Rajenda Maharjan
 * @title fronts_mp
 * @dev The fronts_mp contract is for all fronts and inherits the store. It has Front struct, add new fronts method().
 */
contract fronts_mp is stores_mp {
    /**
    * @dev using SafeMath
    */
    using SafeMath for uint256;
    /**
    * @dev Sturct for fronts. 
    * It might be only one variable for now but can be extend later front_name is Store front name
    */
    struct Front {
        string front_name;
    }
    
    //Mapping variable for store fronts: store owner => front id => Front struct
    mapping (address => mapping(uint => Front)) public fronts;
    //Mapping variable for store front count
    mapping (address => uint) public frontCount;

    //Event for new store front inserted
    event newStorefrontInserted(address store_owner, string front_name);
    //Event for Empty StoreFront Name
    event emptyStoreFrontName(address store_owner);
    /**
     * @dev To add new store front. Only store owner can add their store fronts 
     * parameter: store front Name
     * pausable: Yes
     */
    function addStorefront(string _front_name) public onlyStoreOwner whenNotPaused {
        //Check Storeowner is approved by admin or not
        require(store_owners[msg.sender].isApproved == true);
        //check storefront is empty or not
        if(library_mp.IsEmptyString(_front_name))
        {
            emit emptyStoreFrontName(msg.sender);
            return;
        }
        //check storefront is duplicate or not: check this only from frontend to avoid looping here
        fronts[msg.sender][frontCount[msg.sender]++] = Front({front_name: _front_name});
        emit newStorefrontInserted(msg.sender, _front_name);
    }
    /**
     * @dev To get store owner front count. Accessible for all
     * parameter: store owner address
     * pausable: No
     */
    function getFrontCountByOwner(address _storeOwnerAddress) public view returns(uint) {
        require(_storeOwnerAddress != address(0));
        require(store_owners[_storeOwnerAddress].isApproved);
        return frontCount[_storeOwnerAddress];
    }
    /**
     * @dev To get store front details. Accessible for all
     * parameter: store owner address, front_id
     * pausable: No
     */
    function getFrontDetailsByOwner(address _storeOwnerAddress, uint _front_index) public view returns(string, uint)
    {
        require(_storeOwnerAddress != address(0));
        require(store_owners[_storeOwnerAddress].flag);
        return(fronts[_storeOwnerAddress][_front_index].front_name, _front_index);
    }
}
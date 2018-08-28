pragma solidity ^0.4.24;

import './fronts_mp.sol';

/**
 * author: Rajenda Maharjan
 * @title marketplace
 * @dev marketplace contract has all product information and order functions.
 */
contract marketplace is fronts_mp {
   /**
    * @dev using SafeMath
    */
    using SafeMath for uint256;
    /**
     * @dev marketplace constructor
     * This constructor can be use if contractor want to assign admin while deploying contract
     */
    /*
    constructor(address _adminAddress) public {
        if(_adminAddress != address(0))
            addNewAdmin(_adminAddress);
    }    
    */
    /**
     * @dev Product structure
     * The struct has seller address, product name, product detail, product unit price, quantity available and ipfs image link
     */
    struct Product {
        address seller;
        string name;
        string p_detail;
        uint unit_price;
        uint quantity;
        string image_link_ipfs;      //IPFS Image link
    }
    /**
     * @dev mapping for the products from store owner address-> front id -> product id
     */
    mapping (address => mapping(uint => mapping(uint => Product))) public products;
    
    /**
     * @dev mapping for the product count from store owner address -> front id
     */
    mapping (address => mapping(uint => uint)) public productCount;
    
    /**
     * @dev insert product event
     */
    event newProductInserted(address store_owner, string storefront_name, string product_name, string p_detail,
    uint unit_price, uint quantity, string image_link_ipfs);
    
    /**
     * @dev log empty product name while inserting
     */
    event emptyProductNameOnInsert(address store_owner, uint front_id);
    
    /**
     * @dev update product event
     */
    event productUpdate(address store_owner, uint front_id, uint product_id, string name, string p_detail,
    uint unit_price, uint quantity, string image_link_ipfs);
    
    /**
     * @dev product doesn't exist
     */
    event productNotExist(address store_owner, uint front_id, uint product_id, string name);        
    
    /**
     * @dev product delete event
     */
    event deleteAProduct(address store_owner, uint front_id, uint product_id);
    
    /**
     * @dev log empty product name while product update
     */
    event emptyProductNameOnUpdate(address store_owner, uint front_id, uint product_id);
    
    /**
     * @dev add new product method. Only seller/store owner can add
     * params: _front_id:front id, _name:product name, _p_detail:product detail,
     *  _unit_price: product unit price, _quantity: product quantity available for sale,
     *  _image_link_ipfs: ipfs image link
     */
    function addNewProduct(uint _front_id, string _name, string _p_detail,
        uint _unit_price, uint _quantity, string _image_link_ipfs) public onlyStoreOwner whenNotPaused
    {
        //Make sure store owner is valid and approved
        require(store_owners[msg.sender].isApproved == true);
        //Check for empty product name
        if(library_mp.IsEmptyString(_name))
        {
            emit emptyProductNameOnInsert(msg.sender, _front_id);
            return;
        }
        //unit price should be greater than 0
        require(_unit_price>=1);
        //quantity should be greater than 0
        require(_quantity>=1);
        products[msg.sender][_front_id][productCount[msg.sender][_front_id]++] =
            Product(msg.sender,_name, _p_detail, _unit_price, _quantity, _image_link_ipfs);
        
        emit newProductInserted(msg.sender, fronts[msg.sender][_front_id].front_name, _name, _p_detail,
                _unit_price, _quantity, _image_link_ipfs);
    }
    
    /**
     * @dev update product information and product price. Only seller/store owner can update their stuffs
     * params: _front_id:front id, _product_id: product id, _name: product name, _p_detail:product detail,
     *  _unit_price: product unit price, _quantity: product quantity available for sale,
     *  _image_link_ipfs: ipfs image link
     */
    //Update Product information with _unit_price
    function updateProduct(uint _front_id, uint _product_id, string _name, string _p_detail,
            uint _unit_price, uint _quantity, string _image_link_ipfs) public onlyStoreOwner {
            //Make sure store owner is valid and approved
            require(store_owners[msg.sender].isApproved == true);
            //Make sure product name is not empty
            if(library_mp.IsEmptyString(_name)==true)
            {
                emit emptyProductNameOnUpdate(msg.sender, _front_id, _product_id);
                return;
            }
            //Count Product count should not be 0
            require(productCount[msg.sender][_front_id] != 0);
            //unit price should be greater than 0
            require(_unit_price>=1);
            //quantity should be greater than 0
            require(_quantity>=1);

            products[msg.sender][_front_id][_product_id].name = _name;
            products[msg.sender][_front_id][_product_id].p_detail = _p_detail;
            products[msg.sender][_front_id][_product_id].unit_price = _unit_price;
            products[msg.sender][_front_id][_product_id].quantity = _quantity;
            products[msg.sender][_front_id][_product_id].image_link_ipfs = _image_link_ipfs;
            //product update event
            emit productUpdate(msg.sender, _front_id, _product_id, _name, _p_detail,
                    _unit_price, _quantity, _image_link_ipfs);
    }
    /**
     * @dev delete product information. Only seller/store owner can delete their stuffs
     * params: _front_id:front id, _product_id: product id
     */
    function deleteProduct(uint _front_id, uint _product_id) public onlyStoreOwner whenNotPaused  {
        //Make sure store owner is valid and approved
        require(store_owners[msg.sender].isApproved == true);
        //Make sure product count is not 0
        require(productCount[msg.sender][_front_id] != 0);
        /**
         * @dev Delete operation
         * Applying delete operation as sample code I created at 
         * https://github.com/rmpasha/delete-struct-mapping/blob/master/soldity_delete_code
         */
        //First move lastIndex item to the deleting item index to replace it.
        uint lastIndex=productCount[msg.sender][_front_id]-1;
        products[msg.sender][_front_id][_product_id].name = products[msg.sender][_front_id][lastIndex].name;
        products[msg.sender][_front_id][_product_id].p_detail = products[msg.sender][_front_id][lastIndex].p_detail;
        products[msg.sender][_front_id][_product_id].unit_price = products[msg.sender][_front_id][lastIndex].unit_price;
        products[msg.sender][_front_id][_product_id].quantity = products[msg.sender][_front_id][lastIndex].quantity;
        products[msg.sender][_front_id][_product_id].image_link_ipfs = products[msg.sender][_front_id][lastIndex].image_link_ipfs;
        //Delete last item
        delete products[msg.sender][_front_id][lastIndex];
        //Decrease product count by 1
        productCount[msg.sender][_front_id]--;
        //event for delete product notice
        emit deleteAProduct(msg.sender, _front_id, _product_id);
    }
    /**
     * @dev To get product count by store front and store owner
     * params: _front_id:front id and store owner will be pass by default
     */
    function getProductCountByFront(address _storeOwnerAddress, uint _front_id) public view returns(uint) {
        return productCount[_storeOwnerAddress][_front_id];
    }
    /**
     * @dev To get product details by store owner, store front id and product id
     * params: _storeOwnerAddress: store owner address, _front_id: front id, _product_id: product id
     * returns: product row
     */
    function getEachProductByOwner(address _storeOwnerAddress, uint _front_id, uint _product_id) public view
        returns(string, string, uint, uint, string)
    {
        require(_storeOwnerAddress!=address(0));
        //require(store_owners[_storeOwnerAddress].flag);
        require(store_owners[_storeOwnerAddress].isApproved == true);

        return(products[_storeOwnerAddress][_front_id][_product_id].name,
                products[_storeOwnerAddress][_front_id][_product_id].p_detail,
                products[_storeOwnerAddress][_front_id][_product_id].unit_price,
                products[_storeOwnerAddress][_front_id][_product_id].quantity,
                products[_storeOwnerAddress][_front_id][_product_id].image_link_ipfs);
    }

    /**
     * @dev Order transactions structure
     * The struct has buyer address, store front id, product id, unit price and quantity
     */
    struct OrderTrans {
        address buyer;
        //address seller;
        uint front_id;
        uint product_id;
        uint unit_price;
        uint quantity;
    }
    /**
     * @dev mapping to track the orders. mapping from seller=> OrderTrans struct
     */
    mapping (address => mapping(uint => OrderTrans)) public orders;
    
    /**
     * @dev mapping to track the order count by seller
     */
    mapping (address => uint) public orderCount;
    
    //new order transaction event
    event newOrder(address buyer, address seller, uint front_id, uint product_id, uint unit_price, uint quantity);
    /**
     * @dev order any item. anybody can order. 
     *      the amount will transfer to contract address.
     *      the ordered count will deduct from the inventory.
     * params: seller: store owner address, _front_id:front id, _product_id:product id
     *  _unit_price:product unit price, _quantity: order quantity
     */
    function orderItems(address _seller, uint _front_id, uint _product_id, uint _unit_price, 
        uint _order_quantity) public payable whenNotPaused {
            //make sure valid seller address
            require(_seller != address(0));
            //make sure seller address has been approved to start the store
            require(store_owners[_seller].isApproved==true);
            //make sure the item belongs to this seller or not
            require(products[_seller][_front_id][_product_id].seller == _seller);
            //make sure minimum order quantity is 1 or more
            require(_order_quantity >= 1);
            //Order quantity should be greater or equal to availabe quantity
            products[_seller][_front_id][_product_id].quantity >= _order_quantity;
            //make sure the user send the ether that is same the value of price x ordered quantity
            require(_unit_price * _order_quantity == msg.value);
            //insert order transaction
            orders[_seller][orderCount[_seller]++] = OrderTrans(msg.sender, _front_id, _product_id, _unit_price, _order_quantity);
            //By default all sold amount will deposit in contract account. But we make sure how much amount sold by the seller.
            store_owner_balances[_seller] += msg.value;
            //If we change to send the amount directly to the seller from the begining use following commented code
            //_seller.transfer(msg.value);
            //deduct the number of sold quantity from inventory
            products[_seller][_front_id][_product_id].quantity -= _order_quantity;
            //event for new order notice
            emit newOrder(msg.sender, _seller, _front_id, _product_id, _unit_price, _order_quantity);
    }
    /**
     * @dev To get oder row by the seller
     * params: order_id
     * returns: buyer address, front_id, product_id, name(product name), unit_price, order quantity
     *      If I return front name, it will have "Stack too deep error", so, not returning front name
     */    
    function getOrdersBySeller(uint order_id) public view onlyStoreOwner 
        returns(address, uint, uint, string, uint, uint) {
            uint _front_id = orders[msg.sender][order_id].front_id;
            uint _product_id = orders[msg.sender][order_id].product_id;
            return(orders[msg.sender][order_id].buyer, 
                orders[msg.sender][order_id].front_id, 
                //fronts[msg.sender][_front_id].front_name,
                orders[msg.sender][order_id].product_id,
                products[msg.sender][_front_id][_product_id].name,
                orders[msg.sender][order_id].unit_price, 
                orders[msg.sender][order_id].quantity);
    }
    /**
     * @dev To get order count by seller
     * returns: order count of current seller
     */  
    function getOrderCountBySeller() public view onlyStoreOwner returns(uint)
    {
        return orderCount[msg.sender];
    }
}
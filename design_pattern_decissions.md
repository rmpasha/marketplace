## Design pattern decissions

I have used many solidity design patterns in this smart contract which are described as follows.

##### 1.	Ownership transfer

I have implemented OpenZeppelins-solidity Ownable contract to allow owner to transfer ownership. https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol 

##### 2.	Transfer all amount

All payments deposit in the contract account to be in safe place. There might be many store owners but all payments goes to contract account. If something happened, the contract owner can simply transfer all balance to the new address.

##### 3.	Contract Destruction (Mortal)

I have implemented Kill () method to destruct smart contract permanently. Only contract owner can call this method and will be able to kill the contract. Before killing the contract, the owner should transfer all amount to his/her new account address, for this purpose, owner can use transferAllAmount method.

##### 4.	SafeMath

I have implemented SafeMath library from open zeppelin-solidity. It is specially designed to support safe math operations. Safe means that it prevents overflow when working with uint. You can find it in https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol

##### 5.	Circuit Breaker

I have implemented Pausable.sol contract from open Zeppelin. This will allow owner to pause and unpause the whole contract. If pause, the main transaction like withdraw, approve store are not allowed which are more critical but I am not pausing for get methods which are not critical. This way, the web app still can be in operation.

##### 6.	Mapping Iterator

I have totally avoid looping in the smart contract. I used mappings and count pattern to avoid iteration in smart contract. Since it has many layers of parent child, I went upto 3rd deep for mappings. 
```javascript
mapping (address => mapping(uint => mapping(uint => Product))) public products;
```
Above mapping is for Store Owner address linking to Store Front Id linking to Product Id and Product Id links to Product struct. This way it gives the products of each seller.
 ```javascript
mapping (address => mapping(uint => uint)) public productCount;
```
Above mapping is for Store Owner address linking to Front Id linking Products. This way, we can easily find out how many products count available for specific Store Owner and Front Id. There is no need looping for searching and counting.

##### 7.	Restricting Access

To restrict access on smart contract and its methods, I have used many require and modifiers. The main modifiers are onlyOwner, onlyAdmins, onlyStoreOwner. This way I am giving the rights to execute the methods. If there has used onlyAdmins and any other than admins tries to call the method, it simply throws the error and never get success.

There are many require statements. Below is I am checking before transferring amount from contract account to the store account. This is to block store owner to transfer more than their sales amount. Here store_owner_blances means the total of sales amount not the balance of the account.
 ```javascript
require(store_owner_balances[msg.sender] >= _amountToWithdraw);
```
Below is another require statement that is I am using for orderItems() method to block user to order if the seller address sent from outside/front end is not matched with the owner of that product in the smart contract.
 ```javascript
require(products[_seller][_front_id][_product_id].seller == _seller);
```
##### 8.	Limiting Store Owner max transfer

Store owner can transfer only up to the total amount that they made it from their sales. Let’s say Store Owner A made 20 ether and Store Owner B made 30 ether from their sales. The total will be 50 ether which deposits in the contract account. If Store A transfers, it will allow only upto 20 ether and same for Store B, it will allow only upto 30 ether. Here store_owner_blances means the total of sales amount not the balance of the account.
 ```javascript
require(store_owner_balances[msg.sender] >= _amountToWithdraw);
```
##### 9.	Auto Deprecation: 
Not used because no needed.

##### 10.	Speed Bump: 

I can see, this can be used in this smart contract for transferring amount from contract account to the store account. But right now I am not implementing this because of lack of time and testing.


## Online Marketplace

Online marketplace is a web application using solidity smart contract where store owner can put their products for sale and buyer can order paying using ether price. There can be multiple admins who control the application such as approving the store owner application. Store owner can be anybody who applies and approved by admin. 

All payments goes to the contract account. Store owner can withdraw their total amount of sales anytime.

All information of all participants of this web application, products information, store's inventory and order information are stored in the ethereum blockchain. The picture of the products store in ipfs network and display from ipfs network.

Below screen shot is just for an idea before reading all details.

<img src="imagesForDocument/15 user3.JPG" width="600">

### What this project does?

This project has been developed mainly focusing to submit to Consensys as the part of the development program for 2018. So, this is just for the proof of concept and it has many limitations for now but can be extended later.
This project provides many features for the online marketplace.
1.	Anybody who deploys this smart contract will become contract owner and will be able to host this marketplace app.
2.	Contract owner creates some admins entering their wallet address. This will give those admins a right to control the system like approve store owner feature.
3.	Anybody can apply for the store owner and start new online store. They just need to apply filling the store application form.
4.	One of the admin can approve the store owner application. Without admin approves, store owner cannot do anything.
5.	After approve of store, now the store owner can add their store fronts and products. The all products information saves in solidity smart contract in Ethereum network and the pictures of the product uploads in IPFS.
6.	Store owner can specify their product price in ether but the value always save in wei in the smart contract.
7.	Store owner can change their product price and quantity anytime. Also it provides them to change Name and Description as well. 
8.	Store owner can delete their product anytime.
9.	Shopper can view all store fronts of all stores can will be able to view all products of each front one at a time.
10.	Shopper can buy multiple quantity of a product using ether price. The quantity will deduct from the respective store inventory.
11.	All payments by shoppers deposit on contract account. It also records that how much the total amount of products is sold by each store.
12.	Store owner can withdraw their deposited amount from contract account to their account. They can withdraw only the total amount from their sales.
13.	It keeps all sales records in the smart contract.

### The participants, process flow and relations

The participants are contract owner, admins, store owner and buyers. All have unique activities in this web app. The following diagram shows the best flow and their connections.

<img src="imagesForDocument/00 Flow Diagram.JPG" width="600">

### How to setup to run this project in your local computer?

There are many programs/tools/framework might need to install before run this web app. Here is the prerequisites you need to install if you don’t have already installed.

##### 1. NodeJs

If your computer has just setup OS and nothing installed yet, you need to install NodeJS first. How it can be setup so that you get the latest or required version, please follow this github tutorial that I have written 3 months ago. https://github.com/rmpasha/eth-cert-assignments/blob/master/4%20Advanced%20Solidity.pdf 

##### 2. Ganache cli install. For details https://github.com/trufflesuite/ganache-cli
```javascript
npm install -g ganache-cli
```
##### 3. Truffle install. For details https://github.com/trufflesuite/truffle
```javascript
npm install -g truffle
```
##### 4. MetaMask install

Install MetaMask from https://metamask.io/ 

There are many other dependencies to be installed to run this web app. Those will be mentioned just before project run since those are only for the project related dependencies. Here are the step by step setup.

##### Run ganache-cli

1.	Open new terminal and run command
```javascript
    ganache-cli
```    
Save all contents of this terminal since we need the test address and mnemonic to use in MetaMask.

2.	Copy mnemonic

##### Metamask Setup

1.	Open Metamask in Chrome browser or other browser that support MetaMask.
2.	Make sure you connected Metamask on localhost:8545
3.	Click Restore from Seed Phrase
4.	Paste copied mnemonic and paste in Wallet Seed, enter password and confirm password, hit OK
5.	Create Account up to 10 accounts
6.	Open new terminal and change directory to marketplace

##### Project Setup for backend deployment and testing

###### Please note that the frond end app is in sub folder called Presentation. Install npm under Presentation folder only.

1.	Download or copy the files and folders of this project.
2.	Give the root folder of this project name as marketplace if the downloaded folder name is different.
3.	Open new terminal and change directory to marketplace.
4.	Do not run 'npm install' command here since this project front end app is in the sub folder called Presentation
5.	Run command truffle compile to see if all smart contract succeffully compiled.
```javascript
truffle compile
```  
6.	Run command truffle test to test all testing code
```javascript
truffle test
```  
7.	Run command truffle migrate to deploy the smart contract.
```javascript
truffle migrate
or
truffle migrate --reset
```  

##### Project setup for front-end and testing

1.	Change directory to marketplace/Presentation in the terminal

2.	Run command npm install to install all required dependencies in node_module folder
```javascript
npm install
```
3.	Run command npm install -g @angular/cli to install angular cli
```javascript
install -g @angular/cli
```
4.	Run command ng serve to start local web server
```javascript
ng serve
```  
5.	Open browser (chrome) and browse local url: http://localhost:4200 

### Smart contract details

It has 6 main smart contract, 2 library and 1 Migration.sol from truffle project. 2 smart contract and 1 library are copied from OpenZeppelin for re-use since they are more reliable, secure, and fully tested smart contracts and libraries.

##### Smart contract Relation diagram

<img src="imagesForDocument/00 Smart Contracts.JPG" width="600">

##### A.	SafeMath.sol

This is a library file that I used from open zeppelin-solidity. It is specially designed to support safe math operations. Safe means that it prevents overflow when working with uint. You can find it in https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol .

##### B.	Library_mp.sol

This is a library file that I created something for using shared method in many smart contracts. I has a method called IsEmptyString(param string) to check whether the parameter is empty or not. If empty it returns true and false otherwise.

##### C.	Ownable.sol

When smart contract deploys, it use first address as the contract owner and assigned owner variable. This smart contract has copied from OpenZeppelin but I added one method to get the total contract balance. It has a method for transfer ownership and kill this whole contract.

##### D.	Pausable.sol

It has also copied from OpenZeppelin. It has pause() and unpause() methods to pause the smart contract by owner in emergency case. WhenNotPaused() modifier make sure to run other smart contract methods only if not paused.

##### E.	admins_mp.sol

It gives the methods for contract owner to add new admin. This smart contract stores all admins information.

##### F.	stores_mp.sol

It stores all store information including store name and store owner address. It has methods like add new store admin approves the stores, store owner withdraws their total sales amount.

##### G.	fronts_mp.sol

Only store owner adds the store front name. It stores all store fronts information.

##### H.	marketplace.sol

This is last but not the least smart contract. It stores product details and orders information. It has methods for store owner to add new product, update existing product, delete product. It has also the methods for users to order an item and do the payment.
 
### Smart contract testing details

There are 41 automated test codes for all smart contracts including OpenZeppelin copied smart contracts. I have not written at least 5 smart contracts for OpenZeppelin contracts since I think they are more secure and well tested already but still I have done few main testing for those contracts. The details of the testing are as below

1.	Deploy the marketplace smart contract: 

To catch the instance of smart contract deployment. Error if not successfully deployed.

##### Ownable.sol (OpenZeppelin)

2.	Test for valid contract owner: 

In truffle, by default the contract owner is first address from the 10 testing addresses. After contract deployment, the owner should return the first address.

3.	Test for no other than contract owner can transfer ownership:

If other than contract owner tries to transfer ownership, it should throw an error and never success.

4.	Test for contract owner should be able to transfer ownership:

If contract owner transfer the ownership of the contract, it should be allowed.

##### Pausable.sol (OpenZeppelin)

5.	Test whether owner can pause the contract or not: 

The owner should have ability to pause the contract in emergency case. Also owner should be able to unpause.

6.	Test for no other than contract owner can pause: 

If other than contract owner tries to pause, it should throw an error and never success.

7.	Test for no other than contract owner can unpause:

If other than contract owner tries to unpause, it should throw an error and never success.
 	
##### admins_mp.sol

8.	Test for contract owner should be able to add admin:

Contract owner should be able to add new admin. 

9.	Test for no other than contract owner, can add an admin:

If other than contract owner tries to add new admin, it should throw an error and never get success.

10.	Test for contract owner should be able to add more admin:

Contract owner should be able to add more than one admins since there can be the group of admin who controls the web app.

11.	Test for getAdmins(), it should return admins:

It should return the group of admins those added by contract owner till now.

12.	Test for duplicate admin should not be allowed:

It should not be allowed to add duplicate admin account. It should just give the same previous admins count even tries to add duplicate admin.

##### stores_mp.sol

13.	Test for anybody can register a new store:

Anybody who wants to be a store owner and open a new store, should be able to register a store. 

14.	Test for 2nd store registration:

The web app should be allowed more than one store registration from different users.

15.	Test for admin should be able to approve a new store:

Without approve store from admin, it will be worthless. So, admin should be able to approve store owner.

16.	Test for admin should be able to approve more than one store:

There will be more than one store, so admin should be able to approve more than one store

17.	Test for User Type return, Contract owner call should be returned 0:

If the contract owner login this web app, the user type enum variable value should return 0. 0 means Contract Owner in enum variable.

18.	Test for User Type return, admin call should be returned 1:

User Type returned value 1 represents for admin. So, if admin calls getUserType method, it should return 1.

19.	Test for User Type return, store owner call should be returned 2:

User Type returned value 2 represents for store owner. So, if store owner calls this method, it should return 2.

20.	Test for User Type return, user call should be returned 3:

User Type returned value 3 represents for all other users. When anybody who are not a contract owner and not in admins and store owner groups, calls this method, it should return 3.

##### fronts_mp.sol

21.	Test for store owner should be able to add new store front:

Store owner should be able to add new store front.

22.	Test for getFrontCountByOwner(), it should return a count of store fronts:

This method should return number of store counts those added by store owner till now.

23.	Test for getFrontCountByOwner(), it should return the count only of store owner that passed as parameter:

It should return only the count those owns by particular store owner. Let’s say Store1 has 5 store fronts and Store2 has 3 store fronts. If Store1 passed as parameter, the method should return 5 only.

24.	Test for getFrontDetailsByOwner(), it should return the Front name:

Store owner address and front id use as the parameters for this method and it should return the front name according to the parameters.

25.	Test for no other than store owner can add store front:

If other than store owner tries to add new store front, it should throw an error and never get success.

##### marketplace.sol

26.	Test for no other than store owner can add product:

If other than store owner tries to add new product, it should throw an error and never get success.

27.	Test for store owner should be able to add new product:

Store owner should be able to add new product.

28.	Test for many products adding by store owner:

Store owner should be able to add multiple products and they should be able to add again and again.

29.	Test for other store owner should be able to add a product:

Since this application can have many store owners, all store owner should be able to add their products

30.	Test for getProductCountByFront(), it should return the count of the products those linked with store front:

Since there is a parent child relation between store front and the products, it should return only the count of products those linked with the parent store front.

31.	Test getEachProductByOwner(), it should return the product row:

Store owner, front id and product id are use as the parameter and it should return the product details accordingly.

32.	Test for store owner should be able to update a product:

Store owner should be able to change their product information like product name, description, price and quantity.

33.	Test for store owner should be able to delete a product:

Store owner should be able to delete a product anytime.

34.	Test for user should be able to order a product:

Any user should be able to order a product and there should not be any error.

35.	Test for quantity available in inventory should be deducted:

After order, quantity available in inventory should be deducted by ordered quantity.

36.	Test for getOrdersBySeller() should give order details:

Seller (store owner) calls this method. It should give the order details for particular order id.

37.	Test for getOrderCountBySeller() should give total order by seller:

It should return the count of the orders for particular seller.

38.	Test for other user should be able to make an order.

Not only one user but many other users also should able to order the products from different sellers.
stores_mp.sol test for winthdraw cases

39.	Test for store owner should be able to withdraw:

Since all payments deposit to contract account, store owner should be able to withdraw their sales amount from contract account. This test case need web3.min.js in the root folder. If this file is not there, it will be failed since I am taking the balance of store owner using web3.

40.	Test for no store owner can withdraw more than their sales amount:

Store owner should be able to withdraw but no more than their sales amount. Since contract account will have all sellers sales amount deposited, store owner should be allowed to withdraw only their shares.

##### Ownable.sol for transfer all amount

41.	Test for contract owner should be able to transfer all amount:

In the emergency case and if owner need to kill the smart contract, there should be feature to get all contract account balance transferred in owner other personal account. This test make sure that it will work.


### Front-End manual testing/User tutorial
I have created separate document for front-end manual testing. Please refer the file from \marketplace\documents\Frontend manual testing.pdf or click simply go here https://github.com/rmpasha/rajmahar_mp1/blob/master/marketplace/documents/Frontend%20manual%20testing.pdf

### Quick screen shots of front-end for quick understanding

##### 1. Contract Owner adds admin

<img src="imagesForDocument/02 Contract Owner Add Admin.JPG" width="600">

##### 2. Registration page for store owner

<img src="imagesForDocument/03 Store Application.JPG" width="600">

##### 3. Admin approves store

<img src="imagesForDocument/05 admin Approve2.JPG" width="600">

##### 4. Store Owner adds store front

<img src="imagesForDocument/07 store Fronts1.JPG" width="600">

##### 5. Store Owner adds product

<img src="imagesForDocument/08 addProduct1.JPG" width="600">

<img src="imagesForDocument/09 addProduct2.JPG" width="600">

##### 6. Store Owner edit product

<img src="imagesForDocument/12 editProduct.JPG" width="600">

##### 7. Buyer order product

<img src="imagesForDocument/13 user1.JPG" width="600">

<img src="imagesForDocument/15 user3.JPG" width="600">

<img src="imagesForDocument/16 user4.JPG" width="600">

##### 8. Store owner withdraws

<img src="imagesForDocument/17 Store owner withdraw.JPG" width="600">


### Issue, Bugs and solidity limitations

During the project work development, I found two main issues with smart contract.

1. If I use more layer like users account and use inheritance, the products mappings give no error but never able to deploy the 
contract. The code looks fine, it compiles fine from remix and from truffle as well but never get success. It always shows the max gas overflow no matter how much I use the gas. I even testes with 2000 million on remix which is not possible in my case since after removing those codes, it just comsume around 500K gas to deploy.

2. In products information, I wanted to use more variables to store more information like order date, product category etc., but due to weired stack error, I removed extra fields. The error occurred when I use more than 14 to 16 fields in one method as parameters and returns. I mean, if the sum of total of number of parameters and total number of returning fields is more than 14, it gives stack error.


### Technologies used
###### Ganache-cli              https://github.com/trufflesuite/ganache-cli
###### Truffle framework        https://truffleframework.com/
###### OpenZeppelin-Solidity    https://github.com/OpenZeppelin/openzeppelin-solidity
###### Web3js                   https://github.com/ethereum/web3.js/
###### ipfs-api                 https://github.com/ipfs/js-ipfs-api
###### Angular6                 https://angular.io/
###### Remix                    http://remix.ethereum.org/
###### Visual Studio Code       https://code.visualstudio.com/


### Author

RAJENDRA MAHARJAN
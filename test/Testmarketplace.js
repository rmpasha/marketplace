var marketplace = artifacts.require("./marketplace.sol");

const ownerAccount = web3.eth.accounts[0];
const ownerPersonalAccount = web3.eth.accounts[3];

const admin1 = web3.eth.accounts[1];
const admin2 = web3.eth.accounts[2];


const store1 = web3.eth.accounts[4];
const store2 = web3.eth.accounts[5];
const store3 = web3.eth.accounts[6];

const storeName1 = "Target Inc.";
const storeName2 = "Macys";

const user1 = web3.eth.accounts[7];
const user2 = web3.eth.accounts[8];
const user3 = web3.eth.accounts[9];

const store1Front1 = "Target Jewellery Section";
const store1Front2 = "Target Toyes Section";
const store2Front1 = "Macys Jewellery Section";
const store2Front2 = "Macys Toys Section";

const front1Id = 0;
const front2Id = 1;

//for 1st product add test
const product1 = "Wrist Watch";
const product1Detail = "Women diamond Eco-drive wrist watch.";
const product1Price = 2.5;
const product1Quantity = 20;
const Product1ipfs_link = "https://ipfs.io/ipfs/QmXAZDtoYpCQRZUWHHc2NByjiYniJpLsMPiasrTnhUubB9";
//for product update test
const product1Id = 0;
const update1 = "Women Watch";
const update1Detail = "Medium size Women diamond Eco-drive wrist watch.";
var update1Price = 2.2;
const update1Quantity = 15;
const update1ipfs_link = "https://ipfs.io/ipfs/QmXAZDtoYpCQRZUWHHc2NByjiYniJpLsMPiasrTnhUubB9";

//for 2nd product add test
const product2Id = 1;
const product2 = "Diamond Ring";
const product2Detail = "Pure level 3.2, 75 cut";
const product2Price = 6.3;
const product2Quantity = 16;
const Product2ipfs_link = "https://ipfs.io/ipfs/Qma5FnEeoX4pYQQuxwFCD7wMrrNVGgjWSRaozdrnZkoWEW";

//2nd store add product test
const store2Front1Id = 0;
const store2Product1Id = 0;
const store2product1 = "Wrist Watch";
const store2product1Detail = "Women diamond Eco-drive wrist watch.";
const store2product1Price = 1.5;
const store2product1Quantity = 18;
const store2Product1ipfs_link = "https://ipfs.io/ipfs/QmfD3tGfBYZ3GwfesRiMUA9Vt9YuVZ5FCd962kCkdiT5sW";

//for order test
var orderQtyProduct1 = 3;
const orderIdProduct1 = 0;
var order1Amount = 6.6;   //update1Price*orderQtyProduct1;
//for withdraw test
var amountToWithdraw = 3;

//Order test from store2 products
const orderQtyStore2Product1 = 4;
const orderIdStore2Product1 = 0;
const orderAmountStore2Product1 = 6; //store2product1Price*orderQtyStore2Product1

// Marketplace contract instance
contract('marketplace', function (accounts) {
    describe("Deploy the marketplace smart contract", function () {
        it("Catch an instance of marketplace contract", function () {
            return marketplace.new().then(function (instance) {
                marketInstance = instance;
            });
        });
    });
    //Testing Contract owner and Pausable
    describe("Test Ownable.sol, Pausable.sol", function () {
        it("Test for valid contract owner.", function () {
            return (marketInstance.owner.call({ from: accounts[0] })).then(function (data) {
                // console.log("Owner from contract: " + data);
                // console.log ("Owner Account is : " + ownerAccount);
                assert.equal(data.valueOf(), ownerAccount, "Return value should be matched with contract owner");
            });
        });
        it("Test whether owner can pause the contract or not.", function () {
            //first pause the contract by owner
            return (marketInstance.pause({ from: ownerAccount })).then(function (data) {
                return (marketInstance.paused.call()).then(function (data1) {
                    //console.log("Pause test1:" + data1);
                    assert.equal(data1.valueOf(), true, "paused variable should be true.");
                    //Unpause after called pause() to run all others below testings
                    marketInstance.unpause({ from: ownerAccount });
                    //Try accessing any method that been using pause modifier. It fails- Tested
                    /*
                    return marketInstance.addNewAdmin.call(admin1, {from:accounts[0]}).then(function(response) {
                        console.log("Pause test: " + response);
                    });
                    */
                });
            });
        });
        it("Test for no other than contract owner can pause.", function () {
            return (marketInstance.pause({ from: user2 }))
                .then(assert.fail)
                .catch(function (error) {
                    //console.log(error);
                });
        });
        it("Test for no other than contract owner can unpause.", function () {
            return (marketInstance.unpause({ from: user3 }))
                .then(assert.fail)
                .catch(function (error) {
                    //console.log(error);
                });
        });
        it("Test for no other than contract owner can transfer ownership.", function () {
            return (marketInstance.transferOwnership(user1, { from: user3 }))
            .then(assert.fail)
            .catch(function (error) {
                //console.log(error);
            });
        });
        it("Test for contract owner should be able to transfer ownership.", function () {
            return (marketInstance.transferOwnership(user1, { from: ownerAccount })).then(function (data) {
                return (marketInstance.owner.call({ from: user1 })).then(function (data1) {
                    assert.equal(data1.valueOf(), user1, "Return value should be matched with new contract owner");
                    //Change it back to previou constract owner
                    marketInstance.transferOwnership(ownerAccount, { from: user1 });
                });
            })
        });
    });
    //admin_mp testing
    describe("Test admins_mp.sol smart contract", function () {
        it("Test for contract owner should be able to add admin.", function () {
            return marketInstance.addNewAdmin(admin1, { from: accounts[0] }).then(function (response) {
                return marketInstance.admins.call(admin1, { from: accounts[0] }).then(function (data) {
                    //console.log("admin entry effect mapping variable: " + data.valueOf());
                    assert.equal(data.valueOf(), true, "admins mapping should be true after admin added");
                });
            });
        });
        it("Test for no other than contract owner, can add an admin.", function () {
            return marketInstance.addNewAdmin(admin2, { from: user1 })
                .then(assert.fail)
                .catch(function (error) {
                    //console.log(error);
                });
        });
        it("Test for contract owner should be able to add more admin.", function () {
            return marketInstance.addNewAdmin(admin2, { from: accounts[0] }).then(function (response) {
                return marketInstance.admins.call(admin2, { from: accounts[0] }).then(function (data) {
                    //console.log("admin entry effect mapping variable: " + data.valueOf());
                    assert.equal(data.valueOf(), true, "admins mapping should be true after admin added again.");
                });
            });
        });
        it("Test for getAdmins(), it should return admins.", function () {
            return marketInstance.getAdmins.call({ from: accounts[0] }).then(function (response) {
                //console.log("checking getAdmins() : " + response.length);
                // var isAdminExists = false;
                // if (response.length > 0)
                //     isAdminExists = true;
                var expected = 2;
                assert.equal(response.length, expected, "There should be 2 admin accounts.");
            });
        });
        it("Test for duplicate admin should not be allowed.", function () {
            return marketInstance.addNewAdmin(admin2, { from: accounts[0] }).then(function (response) {
                return marketInstance.getAdmins.call({ from: accounts[0] }).then(function (response) {
                    var expected = 2;
                    //console.log("admin entry effect mapping variable: " + data.valueOf());
                    assert.equal(response.length, expected, "There should be still 2 admin account only.");
                });
            });
        });
    });
    //stores_mp testing
    describe("Test store_mp.sol contract", function () {
        it("Test for anybody can register a new store.", function () {
            return marketInstance.getAdmins.call({ from: accounts[0] }).then(function (admins) {
                //console.log("Admins: " + admins.length);
                return marketInstance.addNewStore(storeName1, { from: store1 }).then(function (response) {
                    //console.log("AddNewStore success:" +response);
                    return marketInstance.store_owners.call(store1).then(function (data) {
                        //    console.log("add new store: " + data[0].valueOf());
                        //checking added store with mapping struct value
                        assert.equal(data[0].valueOf(), storeName1, "Passed store name value and store name in struct should match.");
                    });
                });
            });
        });
        it("Test for 2nd store registration.", function () {
            return marketInstance.addNewStore(storeName2, { from: store2 }).then(function (response) {
                //console.log("AddNewStore2 success:" +response);
                return marketInstance.store_owners.call(store2).then(function (data) {
                    //    console.log("add 2nd store: " + data[0].valueOf());
                    //checking added store with mapping struct value
                    assert.equal(data[0].valueOf(), storeName2, "2nd store also should be recorded.");
                });
            });
        });
        it("Test for admin should be able to approve a new store.", function () {
            return marketInstance.approveStoreByAdmin(store1, { from: admin1 }).then(function (data) {
                return marketInstance.store_owners.call(store1).then(function (data1) {
                    //    console.log("Approved Store:" + store1);
                    //    console.log("Is Approved: " + data1.valueOf());
                    //checking approved store with mapping struct value
                    assert.equal(data1[1].valueOf(), true, "isApproved variable value in struct should be true");
                });
            });
        });
        it("Test for admin should be able to approve more than one store.", function () {
            return marketInstance.approveStoreByAdmin(store2, { from: admin1 }).then(function (data) {
                return marketInstance.store_owners.call(store2).then(function (data1) {
                    //console.log("Approved Store2:" + store2);
                    //console.log("Is Approved: " + data1.valueOf());
                    //checking approved store with mapping struct value
                    assert.equal(data1[1].valueOf(), true, "2nd store isApproved variable value should be recorded.");
                });
            });
        });
    });
    describe("Test stores_mp.sol getUserType() method", function () {
        /** enum USER_TYPE returns 
        * 0 for CONTRACT_OWNER, 
        * 1 for ADMIN, 
        * 2 for STORE_OWNER 
        * 3 for USER
        */
        it("Test for User Type return, contract owner call should be returned 0.", function () {
            return marketInstance.getUserType.call({ from: ownerAccount }).then(function (response) {
                //    console.log("User Type called from contract owner: " + response.valueOf());
                //checking approved store with mapping struct value
                assert.equal(response.valueOf(), 0, "It should be match with 0.");
            });
        });
        it("Test for User Type return, admin call should be returned 1.", function () {
            return marketInstance.getUserType.call({ from: admin1 }).then(function (response) {
                //    console.log("User Type called from admin: " + response.valueOf());
                //checking approved store with mapping struct value
                assert.equal(response.valueOf(), 1, "It should be match with 1.");
            });
        });
        it("Test for User Type return, store owner call should be returned 2.", function () {
            return marketInstance.getUserType.call({ from: store1 }).then(function (response) {
                //    console.log("User Type called from store owner: " + response.valueOf());
                //checking approved store with mapping struct value
                assert.equal(response.valueOf(), 2, "It should be match with 2.");
            });
        });
        it("Test for User Type return, user call should be returned 3.", function () {
            return marketInstance.getUserType.call({ from: user1 }).then(function (response) {
                //    console.log("User Type called from any user: " + response.valueOf());
                //checking approved store with mapping struct value
                assert.equal(response.valueOf(), 3, "It should be match with 3.");
            });
        });
    });
    //fronts_mp testing
    describe("Test fronts_mp.sol contract", function () {
        it("Test for store owner should be able to add new store front.", function () {
            return marketInstance.addStorefront(store1Front1, { from: store1 }).then(function (data) {
                return marketInstance.fronts.call(store1, 0).then(function (data1) {
                    //console.log("Fronts: " + data1.valueOf());
                    assert.equal(data1.valueOf(), store1Front1, "added front name should be recorded in struct.");
                });
            });
        });
        it("Test for getFrontCountByOwner(), it should return a count of store fronts", function () {
            //Add one more front for store1
            return marketInstance.addStorefront(store1Front2, { from: store1 }).then(function (data) {
                return marketInstance.getFrontCountByOwner.call(store1).then(function (data1) {
                    //console.log("Front count by owner: " + data1.valueOf());
                    assert.equal(data1.valueOf(), 2, "The count should be 2 since two times added.");
                });
            });
        });
        it("Test for getFrontCountByOwner(), it should return the count only of store owner that passed as parameter", function () {
            //Add one front by store2 owner
            return marketInstance.addStorefront(store2Front1, { from: store2 }).then(function (data) {
                return marketInstance.getFrontCountByOwner.call(store2).then(function (data1) {
                    //console.log("Front count by owner: " + data1.valueOf());
                    assert.equal(data1.valueOf(), 1, "Though, 3 fronts have been added but only 1 for this store has added, the return should be 1");
                });
            });
        });
        it("Test for getFrontDetailsByOwner(), it should return the Front name.", function () {
            return marketInstance.getFrontDetailsByOwner.call(store1, 0).then(function (data) {
                //console.log("Return front name: " + data.valueOf());
                assert.equal(data[0].valueOf(), store1Front1, "The first front of first owner should value of store1Front1");
            });
        });
        //Trying to create store front by user
        it("Test for no other than store owner can add store front.", function () {
            return marketInstance.addStorefront(store2Front2, { from: user1 })
            .then(assert.fail)
            .catch(function (error) {
                //console.log(error);
            });
        });
    });
    //Testing for marketplace products
    describe("Test marketplace.sol products", function () {
        //test for failing while adding product if not by owner
        it("Test for no other than store owner can add product.", function () {
            return marketInstance.addNewProduct(front1Id, product1, product1Detail, product1Price, product1Quantity, Product1ipfs_link, { from: user1 })
                .then(assert.fail)
                .catch(function (error) {
                    //console.log(error);
                });
        });
        //test add product
        it("Test for store owner should be able to add new product.", function () {
            return marketInstance.addNewProduct(front1Id, product1, product1Detail, web3.toWei(product1Price, 'ether'), product1Quantity, Product1ipfs_link, { from: store1 })
                .then(function (data) {
                    //Pass store owner address, front id 0 and product id 0
                    return marketInstance.products.call(store1, 0, 0).then(function (data1) {
                        assert.equal(data1[1].valueOf(), product1, "Added product should be recorded in struct");
                    });
                });
        });
        //test for adding 2nd product
        it("Test for many products adding by store owner.", function () {
            return marketInstance.addNewProduct(front1Id, product2, product2Detail, web3.toWei(product2Price, 'ether'), product2Quantity, Product2ipfs_link, { from: store1 })
                .then(function (data) {
                    //Pass store owner address, front id 0 and product id 1
                    return marketInstance.products.call(store1, front1Id, product2Id).then(function (data1) {
                        //    console.log("Again add:"+ data1);
                        assert.equal(data1[1].valueOf(), product2, "2nd product also should be recorded in struct");
                    });
                });
        });
        //test for adding product by another store owner
        it("Test for other store owner should be able to add a product.", function () {
            return marketInstance.addNewProduct(store2Front1Id, store2product1, store2product1Detail, web3.toWei(store2product1Price, 'ether'), store2product1Quantity, store2Product1ipfs_link, { from: store2 })
                .then(function (data) {
                    //Pass store owner address, front id 0 and product id 1
                    return marketInstance.products.call(store2, store2Front1Id, store2Product1Id).then(function (data1) {
                        //    console.log("Again add:"+ data1);
                        assert.equal(data1[1].valueOf(), store2product1, "2nd product also should be recorded in struct");
                    });
                });
        });
        //test for getProductCountByFront
        it("Test for getProductCountByFront(), it should return the count of the products those linked with store front.", function () {
            return marketInstance.getProductCountByFront.call(store1, front1Id).then(function (data) {
                var expected = 2; //so far only two project inserted for this front id, so expected should be 2
                assert.equal(data.valueOf(), expected, "Product count should be matched with inserted counts");
            });
        });
        //test for getting product details by owner
        it("Test getEachProductByOwner(), it should return the product row.", function () {
            return marketInstance.getEachProductByOwner.call(store1, front1Id, product1Id).then(function (data) {
                assert.equal(data[0].valueOf(), product1, "Product name should be the 1st product");
                assert.equal(data[1].valueOf(), product1Detail, "Product details should be matched");
                assert.equal(web3.fromWei(data[2].valueOf(), 'ether'), product1Price, "Product price should be matched");
                assert.equal(data[3].valueOf(), product1Quantity, "Product quantity should be matched");
                assert.equal(data[4].valueOf(), Product1ipfs_link, "Product link should be matched");
            });
        });
        //test update product
        it("Test for store owner should be able to update a product.", function () {
            return marketInstance.updateProduct(front1Id, product1Id, update1, update1Detail, web3.toWei(update1Price, 'ether'), update1Quantity, update1ipfs_link, { from: store1 })
            .then(function (data) {
                //Pass store owner address, front id 0 and product id 0
                return marketInstance.products.call(store1, front1Id, product1Id).then(function (data1) {
                    //console.log("updated price is " + web3.fromWei(data1[3],'ether'));
                    assert.equal(data1[1].valueOf(), update1, "Updated product name should be recorded in struct");
                    assert.equal(data1[2].valueOf(), update1Detail, "Updated product details should be recorded in struct");
                    assert.equal(web3.fromWei(data1[3].valueOf(), 'ether'), update1Price, "Updated product price should be recorded in struct");
                    assert.equal(data1[4].valueOf(), update1Quantity, "Updated product quantity should be recorded in struct");
                    assert.equal(data1[5].valueOf(), update1ipfs_link, "Updated product image link should be recorded in struct");
                });
            });
        });
        //test delete product
        it("Test for store owner should be able to delete a product.", function () {
            return marketInstance.productCount.call(store1, front1Id).then(function (data) {
                var previousCount = data.valueOf();
                //console.log(previousCount);
                return marketInstance.deleteProduct(front1Id, product2Id, { from: store1 }).then(function (data1) {
                    return marketInstance.productCount.call(store1, front1Id).then(function (data2) {
                        var result = false;
                        if (data2.valueOf() == previousCount - 1)
                            result = true;
                        assert.equal(result, true, "The deleteProduct should decrease the count by 1");
                    });
                });
            });
        });
    });
    describe("Test marketplace.sol Orders", function () {
        it("Test for user should be able to order a product.", function () {
            return marketInstance.orderItems(store1, front1Id, product1Id, web3.toWei(update1Price, 'ether'), orderQtyProduct1,
                { from: user1, value: web3.toWei(order1Amount, 'ether') }).then(function (data) {
                    //console.log("ORder got success.")
                    return marketInstance.orders.call(store1, orderIdProduct1).then(function (data1) {
                        assert.equal(data1[0].valueOf(), user1, "buyer address should be recorded");
                        assert.equal(data1[1].valueOf(), front1Id, "frontId should be recorded");
                        assert.equal(data1[2].valueOf(), product1Id, "productId should be recorded");
                        assert.equal(web3.fromWei(data1[3].valueOf(), 'ether'), update1Price, "product price should be recorded");
                        assert.equal(data1[4].valueOf(), orderQtyProduct1, "buyer address should be recorded");
                    });
                });
        });
        it("Test for quantity available in inventory should be deducted.", function () {
            return marketInstance.products.call(store1, front1Id, product1Id).then(function (data) {
                var expected = update1Quantity - orderQtyProduct1;
                assert.equal(data[4].valueOf(), expected, "Store inventory should be reduced");
            });
        });
        it("Test for getOrdersBySeller() should give order details", function () {
            return marketInstance.getOrdersBySeller.call(orderIdProduct1, { from: store1 }).then(function (data) {
                assert.equal(data[0].valueOf(), user1, "buyer address should be returned");
                assert.equal(data[1].valueOf(), front1Id, "frontId should be returned");
                assert.equal(data[2].valueOf(), product1Id, "productId should be returned");
                assert.equal(data[3].valueOf(), update1, "product name should be returned");
                assert.equal(web3.fromWei(data[4].valueOf(), 'ether'), update1Price, "product price should be returned");
                assert.equal(data[5].valueOf(), orderQtyProduct1, "Ordered quantity should be returned");
            });
        });
        it("Test for getOrderCountBySeller() should give total order by seller.", function () {
            return marketInstance.getOrderCountBySeller.call({ from: store1 }).then(function (data) {
                assert.equal(data.valueOf(), 1, "Total order till now is 1");
            });
        });
        it("Test for other user should be able to make an order.", function () {
            return marketInstance.orderItems(store2, store2Front1Id, store2Product1Id, web3.toWei(store2product1Price, 'ether'), orderQtyStore2Product1,
                { from: user2, value: web3.toWei(orderAmountStore2Product1, 'ether') }).then(function (data) {
                    //console.log("ORder got success.")
                    return marketInstance.orders.call(store2, orderIdStore2Product1).then(function (data1) {
                        assert.equal(data1[0].valueOf(), user2, "buyer address should be recorded");
                        assert.equal(data1[1].valueOf(), store2Front1Id, "frontId should be recorded");
                        assert.equal(data1[2].valueOf(), store2Product1Id, "productId should be recorded");
                        assert.equal(web3.fromWei(data1[3].valueOf(), 'ether'), store2product1Price, "product price should be recorded");
                        assert.equal(data1[4].valueOf(), orderQtyStore2Product1, "buyer address should be recorded");
                    });
                });
        });
    });
    describe("Test store_mp.sol for Withdraw", function () {
        it("Test for store owner should be able to withdraw.", function () {
            //Total deposited amount in contract = 6.6
            //amountToWithdraw = 5
            //First get previous balance of store owner
            var store1PreviousBalance = +web3.fromWei(web3.eth.getBalance(store1), 'ether');
            console.log("Previous: " + store1PreviousBalance)
            return marketInstance.withdrawAmount(web3.toWei(amountToWithdraw), { from: store1 }).then(function (data) {
                var store1CurrentBalance = +web3.fromWei(web3.eth.getBalance(store1), 'ether');
                //console.log("current: " + store1CurrentBalance)
                var expected = false;
                if (store1CurrentBalance > store1PreviousBalance) {
                    expected = true;
                    //console.log("check: "+ expected);
                }else
                expected = false;
                assert.equal(expected, true, "Store1 current balance should be more that previous balance after withdrawn from contract balance.");
            });
        });

        it("Test for no store owner can withdraw more than their sales amount.", function () {
            //Get max amount can withdraw from store2
            return marketInstance.getMaxAmountCanWithdraw.call({ from: store2 }).then(function (maxStore2Value) {
                var moreThanMaxValue = +web3.fromWei(maxStore2Value.valueOf(), 'ether') + 1; //Add 1 Ether
                //It should fail
                return marketInstance.withdrawAmount(web3.toWei(moreThanMaxValue), { from: store2 })
                .then(assert.fail)
                .catch(function (error) {
                    //console.log(error);
                });
            })
        });
    });
    describe("Test Ownable.sol for transfer all.", function () {
        it("Test for contract owner should be able to transfer all amount.", function () {
            previousBalance = web3.fromWei(web3.eth.getBalance(ownerPersonalAccount), 'ether');
            //console.log("previous balance:"+previousBalance);
            return marketInstance.transferAllFunds(ownerPersonalAccount, { from: ownerAccount }).then(function (result) {
                currentBalance = web3.fromWei(web3.eth.getBalance(ownerPersonalAccount), 'ether');
                var expected = false;
                if (currentBalance > previousBalance) {
                    expected = true;
                }
                //console.log("currentBalance:"+currentBalance);
                assert.equal(expected, true, "Owner personal account should be increased.");
                //Get contract Balance, it should be 0
                return marketInstance.getContractBalance({ from: ownerAccount }).then(function (result) {
                    //console.log("contract balance: " + result)
                    assert.equal(result.valueOf(), 0, "Contract account balance should be 0 after all transferred.");
                });
            });
        });
    });
});
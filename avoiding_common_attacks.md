## Avoiding_common _attacks

##### 1. Reentrancy
In this smart contract, it is very possible to arise this issue while transferring amount from contract account to store owner. Initially, I had written the withdrawAmount method as below.

```javascript
function withdrawAmount(uint _amountToWithdraw) public onlyStoreOwner whenNotPaused returns(bool) {
        require(address(this).balance >= _amountToWithdraw);
        require(store_owner_balances[msg.sender] >= _amountToWithdraw);
        address(msg.sender).transfer(_amountToWithdraw);
        store_owner_balances[msg.sender] -= _amountToWithdraw;
        emit amountWithdrawn(msg.sender, _amountToWithdraw);
        return true;
    }
```

In above code, the issue is, if a store owner calls continuously and very quicker way, while one transaction just reach at transfer statement but didn’t transfer yet and there is a second transaction already reached in 2nd line of the method, then it will allow from the require statement and pass to 3rd statement to transfer again since it never deducted desired transfer amount from store_owner_balance (it is store owner total amount of sales but not the actual account balance).
So, the 4th line of code should be put before the transfer statement to avoid Reentrancy error.

```javascript
function withdrawAmount(uint _amountToWithdraw) public onlyStoreOwner whenNotPaused returns(bool) {
        require(address(this).balance >= _amountToWithdraw);
        require(store_owner_balances[msg.sender] >= _amountToWithdraw);
        //To avoid Reentrancy, the below line should be before transfering actual amount
        store_owner_balances[msg.sender] -= _amountToWithdraw;
        address(msg.sender).transfer(_amountToWithdraw);
        emit amountWithdrawn(msg.sender, _amountToWithdraw);
        return true;
    }
```

##### 2. Cross-function Race Condition	
        - Not application

##### 3. Integer Overflow and Underflow

In the case of transfer amount, I have taken care of integer overflow and underflow attacks. 

```javascript
function withdrawAmount(uint _amountToWithdraw) public onlyStoreOwner whenNotPaused {
        require(address(this).balance >= _amountToWithdraw);
        require(store_owner_balances[msg.sender] >= _amountToWithdraw);
        //Checking underflow and overflow
        if(address(msg.sender).balance + _amountToWithdraw >= address(msg.sender).balance
            && address(msg.sender).balance - _amountToWithdraw <= address(msg.sender).balance) { 
            //To avoid Reentrancy, the below line should be before transfering actual amount
            store_owner_balances[msg.sender] -= _amountToWithdraw;
            address(msg.sender).transfer(_amountToWithdraw);
            emit amountWithdrawn(msg.sender, _amountToWithdraw);
        }
    }
```

Here, the line of code
```javascript
address(msg.sender).balance + _amountToWithdraw >= address(msg.sender).balance
```
make sure for the integer overflow and the line of code 
```javascript
address(msg.sender).balance - _amountToWithdraw <= address(msg.sender).balance
```
make sure for integer underflow.

##### 4. DoS with Block Gas Limit
This smart contract doesn’t transfer to do payment by owner at all but store owner can withdraws their sales amount by themselves. So, there no bulk payment. This avoid the looping and avoid the Gas Limit problem. Again I have not written any code that goes in loop to get any records. The using of mappings and the count are the remedies for using array and loop.

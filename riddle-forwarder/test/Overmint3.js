const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "Overmint3";

describe(NAME, function () {
  async function setup() {
    const [owner, attackerWallet, ...extras] = await ethers.getSigners();

    const VictimFactory = await ethers.getContractFactory(NAME);
    const victimContract = await VictimFactory.deploy();

    return { victimContract, attackerWallet, extras };
  }

  describe("exploit", async function () {
    let victimContract, attackerWallet;
    before(async function () {
      ({ victimContract, attackerWallet } = await loadFixture(setup));
    });

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

    after(async function () {
      expect(
        await victimContract.balanceOf(attackerWallet.address)
      ).to.be.equal(5); // Check if the attacker has 5 NFTs
      expect(
        await ethers.provider.getTransactionCount(attackerWallet.address)
      ).to.equal(1, "must exploit one transaction"); // Verify that the exploit was done in one transaction
    });
  });
});

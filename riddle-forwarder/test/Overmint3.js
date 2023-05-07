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
    const [owner, attackerWallet] = await ethers.getSigners();

    const VictimFactory = await ethers.getContractFactory(NAME);
    const victimContract = await VictimFactory.deploy();

    return { victimContract, attackerWallet };
  }

  describe("exploit", async function () {
    let victimContract, attackerWallet;
    before(async function () {
      ({ victimContract, attackerWallet } = await loadFixture(setup));
    });

    it("conduct your attack here", async function () {
      for (let i = 0; i < 5; i++) {
        await victimContract.mint({ from: attackerWallet.address });
        amountMinted[attackerWallet.address] =
          amountMinted[attackerWallet.address].add(1);
      }
      const balance = ethers.utils.bigNumberify(
        await victimContract.balanceOf(attackerWallet.address)
      );
      expect(balance).to.be.equal(5);
      expect(amountMinted[attackerWallet.address]).to.be.equal(5);
    });

    after(async function () {
      expect(
        await victimContract.balanceOf(attackerWallet.address)
      ).to.be.equal(5);
      expect(
        await ethers.provider.getTransactionCount(attackerWallet.address)
      ).to.equal(1, "must exploit one transaction");
    });
  });
});

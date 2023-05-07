const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "AssignVotes";

describe(NAME, function () {
  async function setup() {
    const [owner, assignerWallet, attackerWallet] = await ethers.getSigners();

    const VictimFactory = await ethers.getContractFactory(NAME);
    const victimContract = await VictimFactory.deploy({
      value: ethers.utils.parseEther("1"),
    });

    return { victimContract, assignerWallet, attackerWallet };
  }

  describe("exploit", async function () {
    let victimContract, assignerWallet, attackerWallet;
    before(async function () {
      ({ victimContract, assignerWallet, attackerWallet } = await loadFixture(
        setup
      ));
    });

    // you may only use the attacker wallet, and no other wallet
    it("conduct your attack here", async function () {
      // Deploy the Attacker contract
      const AttackerFactory = await ethers.getContractFactory(
        "MaliciousContract"
      );
      const attackerContract = await AttackerFactory.deploy(
        victimContract.address
      );
    });

    after(async function () {
      expect(
        await ethers.provider.getBalance(victimContract.address)
      ).to.be.equal(0);
      expect(
        await ethers.provider.getTransactionCount(attackerWallet.address)
      ).to.equal(0, "must exploit zero transactions");
    });
  });
});

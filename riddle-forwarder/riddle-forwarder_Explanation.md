# Vulnerability and Exploit in Forwarder and Wallet Contracts

## Vulnerability Description

The vulnerability exists because the Forwarder contract's `functionCall` method can forward any function call to any address without limitations. This lets an attacker use the Forwarder contract to bypass the Wallet contract's access control and call the `sendEther` function.

## Exploit Description

The exploit occurs when the attacker creates a malicious data input, containing the necessary information for the `sendEther` function, and uses the Forwarder contract's `functionCall` method to pass this data to the Wallet contract. As a result, the Wallet contract sends 1 ether to the attacker's wallet.

## Takeaways

1. Always implement proper access control and restrictions in your smart contracts to prevent unauthorized function calls.
2. Be cautious when using low-level functions like `call` and `delegatecall`, as they can expose your contract to potential vulnerabilities.

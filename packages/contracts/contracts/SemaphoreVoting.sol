// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {ISemaphore} from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import {ISemaphoreVoting} from "./interfaces/ISemaphoreVoting.sol";

/// @title Semaphore Voting contract.
/// @notice It allows users to vote anonymously in a poll.
/// @dev The following code allows you to create polls, add voters and allow them to vote anonymously.
contract SemaphoreVoting is ISemaphoreVoting {
    ISemaphore public semaphore;

    /// @dev Gets a poll id and returns the poll data.
    mapping(uint256 => Poll) internal polls;

    /// @dev Checks if the poll coordinator is the transaction sender.
    /// @param pollId: Id of the poll.
    modifier onlyCoordinator(uint256 pollId) {
        if (polls[pollId].coordinator != msg.sender) {
            revert SemaphoreVoting__CallerIsNotThePollCoordinator();
        }

        _;
    }

    /// @dev Initializes the Semaphore group used to verify the user's ZK proofs.
    /// @param _semaphore: Semaphore group address.
    constructor(ISemaphore _semaphore) {
        semaphore = _semaphore;
    }

    /// @dev See {ISemaphoreVoting-createPoll}.
    function createPoll(address coordinator) public {
        uint256 groupId = semaphore.createGroup();

        polls[groupId].coordinator = coordinator;
        polls[groupId].state = PollState.Created;

        emit PollCreated(groupId, coordinator);
    }

    /// @dev See {ISemaphoreVoting-addVoter}.
    function addVoter(uint256 pollId, uint256 identityCommitment) public onlyCoordinator(pollId) {
        if (polls[pollId].state != PollState.Created) {
            revert SemaphoreVoting__PollHasAlreadyBeenStarted();
        }

        semaphore.addMember(pollId, identityCommitment);
    }

    /// @dev See {ISemaphoreVoting-startPoll}.
    function startPoll(uint256 pollId, uint256 encryptionKey) public override onlyCoordinator(pollId) {
        if (polls[pollId].state != PollState.Created) {
            revert SemaphoreVoting__PollHasAlreadyBeenStarted();
        }

        polls[pollId].state = PollState.Ongoing;

        emit PollStarted(pollId, msg.sender, encryptionKey);
    }

    /// @dev See {ISemaphoreVoting-castVote}.
    function castVote(
        uint256 vote,
        uint256 pollId,
        uint256 merkleTreeDepth,
        uint256 nullifier,
        uint256 merkleTreeRoot,
        uint256[8] calldata proof
    ) public {
        if (polls[pollId].state != PollState.Ongoing) {
            revert SemaphoreVoting__PollIsNotOngoing();
        }

        ISemaphore.SemaphoreProof memory semaphoreProof = ISemaphore.SemaphoreProof({
            merkleTreeDepth: merkleTreeDepth,
            merkleTreeRoot: merkleTreeRoot,
            nullifier: nullifier,
            message: vote,
            scope: pollId,
            points: proof
        });

        semaphore.validateProof(pollId, semaphoreProof);
        polls[pollId].nullifiers[nullifier] = true;
        emit VoteAdded(pollId, vote);
    }

    /// @dev See {ISemaphoreVoting-endPoll}.
    function endPoll(uint256 pollId, uint256 decryptionKey) public override onlyCoordinator(pollId) {
        polls[pollId].state = PollState.Ended;

        emit PollEnded(pollId, msg.sender, decryptionKey);
    }
}

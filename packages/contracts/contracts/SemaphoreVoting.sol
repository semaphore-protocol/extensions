// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {ISemaphore} from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import {ISemaphoreVoting} from "./interfaces/ISemaphoreVoting.sol";
import {SemaphoreGroups} from "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";

/// @title Semaphore Voting contract.
/// @notice It allows users to vote anonymously in a poll.
/// @dev The following code allows you to create polls, add voters and allow them to vote anonymously.
contract SemaphoreVoting is ISemaphoreVoting, SemaphoreGroups {
    ISemaphore public group;

    /// @dev Gets a poll id and returns the poll data.
    mapping(uint256 => Poll) internal polls;

    /// @dev Checks if the poll coordinator is the transaction sender.
    /// @param pollId: Id of the poll.
    modifier onlyCoordinator(uint256 pollId) {
        if (polls[pollId].coordinator != msg.sender) {
            revert Semaphore__CallerIsNotThePollCoordinator();
        }

        _;
    }

    /// @dev Initializes the Semaphore group used to verify the user's ZK proofs.
    /// @param _group: Semaphore group address.
    constructor(ISemaphore _group) {
        group = _group;
    }

    /// @dev See {ISemaphoreVoting-createPoll}.
    function createPoll(uint256 pollId, address coordinator) public override {
        uint256 groupId = group.createGroup();

        polls[pollId].coordinator = coordinator;
        polls[pollId].groupId = groupId;

        emit PollCreated(pollId, coordinator);
    }

    /// @dev See {ISemaphoreVoting-addVoter}.
    function addVoter(uint256 pollId, uint256 identityCommitment) public override onlyCoordinator(pollId) {
        if (polls[pollId].state != PollState.Created) {
            revert Semaphore__PollHasAlreadyBeenStarted();
        }

        group.addMember(polls[pollId].groupId, identityCommitment);
    }

    /// @dev See {ISemaphoreVoting-startPoll}.
    function startPoll(uint256 pollId, uint256 encryptionKey) public override onlyCoordinator(pollId) {
        if (polls[pollId].state != PollState.Created) {
            revert Semaphore__PollHasAlreadyBeenStarted();
        }

        polls[pollId].state = PollState.Ongoing;

        emit PollStarted(pollId, msg.sender, encryptionKey);
    }

    /// @dev See {ISemaphoreVoting-castVote}.
    function castVote(uint256 vote, uint256 nullifierHash, uint256 pollId, uint256[8] calldata proof) public override {
        if (polls[pollId].state != PollState.Ongoing) {
            revert Semaphore__PollIsNotOngoing();
        }

        if (polls[pollId].nullifierHashes[nullifierHash]) {
            revert Semaphore__YouAreUsingTheSameNullifierTwice();
        }

        uint256 merkleTreeRoot = getMerkleTreeRoot(polls[pollId].groupId);

        ISemaphore.SemaphoreProof memory semaphoreProof = ISemaphore.SemaphoreProof({
            merkleTreeDepth: 32,
            merkleTreeRoot: merkleTreeRoot,
            nullifier: nullifierHash,
            message: vote,
            scope: pollId,
            points: proof
        });

        group.verifyProof(polls[pollId].groupId, semaphoreProof);

        polls[pollId].nullifierHashes[nullifierHash] = true;

        emit VoteAdded(pollId, vote);
    }

    /// @dev See {ISemaphoreVoting-endPoll}.
    function endPoll(uint256 pollId, uint256 decryptionKey) public override onlyCoordinator(pollId) {
        if (polls[pollId].state != PollState.Ongoing) {
            revert Semaphore__PollIsNotOngoing();
        }

        polls[pollId].state = PollState.Ended;

        emit PollEnded(pollId, msg.sender, decryptionKey);
    }

    function createPoll(uint256 pollId, address coordinator, uint256 merkleTreeDepth) external {}
}

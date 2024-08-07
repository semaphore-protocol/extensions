//SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/// @title SemaphoreVoting contract interface.
interface ISemaphoreVoting {
    error SemaphoreVoting__CallerIsNotThePollCoordinator();
    error SemaphoreVoting__MerkleTreeDepthIsNotSupported();
    error SemaphoreVoting__PollHasAlreadyBeenStarted();
    error SemaphoreVoting__PollIsNotOngoing();
    error SemaphoreVoting__YouAreUsingTheSameNullifierTwice();

    enum PollState {
        Created,
        Ongoing,
        Ended
    }

    struct Poll {
        address coordinator;
        PollState state;
        mapping(uint256 => bool) nullifiers;
        uint256 groupId;
    }

    /// @dev Emitted when a new poll is created.
    /// @param pollId: Id of the poll.
    /// @param coordinator: Coordinator of the poll.
    event PollCreated(uint256 pollId, address indexed coordinator);

    /// @dev Emitted when a poll is started.
    /// @param pollId: Id of the poll.
    /// @param coordinator: Coordinator of the poll.
    /// @param encryptionKey: Key to encrypt the poll votes.
    event PollStarted(uint256 pollId, address indexed coordinator, uint256 encryptionKey);

    /// @dev Emitted when a user votes on a poll.
    /// @param pollId: Id of the poll.
    /// @param vote: User encrypted vote.
    event VoteAdded(uint256 indexed pollId, uint256 vote);

    /// @dev Emitted when a poll is ended.
    /// @param pollId: Id of the poll.
    /// @param coordinator: Coordinator of the poll.
    /// @param decryptionKey: Key to decrypt the poll votes.
    event PollEnded(uint256 pollId, address indexed coordinator, uint256 decryptionKey);

    /// @dev Creates a poll and the associated Merkle tree/group.
    /// @param coordinator: Coordinator of the poll.
    function createPoll(address coordinator) external;

    /// @dev Adds a voter to a poll.
    /// @param pollId: Id of the poll.
    /// @param identityCommitment: Identity commitment of the group member.
    function addVoter(uint256 pollId, uint256 identityCommitment) external;

    /// @dev Starts a pull and publishes the key to encrypt the votes.
    /// @param pollId: Id of the poll.
    /// @param encryptionKey: Key to encrypt poll votes.
    function startPoll(uint256 pollId, uint256 encryptionKey) external;

    /// @dev Casts an anonymous vote in a poll.
    /// @param vote: Encrypted vote.
    /// @param pollId: Id of the poll.
    function castVote(
        uint256 vote,
        uint256 pollId,
        uint256 nullifier,
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256[8] calldata proof
    ) external;

    /// @dev Ends a pull and publishes the key to decrypt the votes.
    /// @param pollId: Id of the poll.
    /// @param decryptionKey: Key to decrypt poll votes.
    function endPoll(uint256 pollId, uint256 decryptionKey) external;
}

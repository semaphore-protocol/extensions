//SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";
import "@semaphore-protocol/contracts/interfaces/ISemaphoreGroups.sol";
import "../interfaces/ISemaphoreWhistleblowing.sol";

/// @title Semaphore whistleblowing contract.
/// @notice It allows users to leak information anonymously .
/// @dev The following code allows you to create entities for whistleblowers (e.g. non-profit
/// organization, newspaper) and allow them to leak anonymously.
/// Leaks can be IPFS hashes, permanent links or other kinds of references.
contract SemaphoreWhistleblowing is ISemaphoreWhistleblowing, SemaphoreGroups {
    ISemaphoreGroups public group;

    /// @dev Gets an entity id and return its editor address.
    mapping(uint256 => address) private entities;

    /// @dev Checks if the editor is the transaction sender.
    /// @param entityId: Id of the entity.
    modifier onlyEditor(uint256 entityId) {
        if (entities[entityId] != msg.sender) {
            revert Semaphore__CallerIsNotTheEditor();
        }

        _;
    }

    /// @dev Initializes the Semaphore group used to verify the user's ZK proofs.
    /// @param _group: Semaphore group address.
    constructor(ISemaphoreGroups _group) {
        group = _group;
    }

    /// @dev See {ISemaphoreWhistleblowing-createEntity}.
    function createEntity(uint256 entityId, address editor, uint256 merkleTreeDepth) public override {
        if (merkleTreeDepth < 16 || merkleTreeDepth > 32) {
            revert Semaphore__MerkleTreeDepthIsNotSupported();
        }

        group.createGroup(entityId, merkleTreeDepth);

        entities[entityId] = editor;

        emit EntityCreated(entityId, editor);
    }

    /// @dev See {ISemaphoreWhistleblowing-addWhistleblower}.
    function addWhistleblower(uint256 entityId, uint256 identityCommitment) public override onlyEditor(entityId) {
        group.addMember(entityId, identityCommitment);
    }

    /// @dev See {ISemaphoreWhistleblowing-removeWhistleblower}.
    function removeWhistleblower(
        uint256 entityId,
        uint256 identityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) public override onlyEditor(entityId) {
        group.removeMember(entityId, identityCommitment, proofSiblings, proofPathIndices);
    }

    /// @dev See {ISemaphoreWhistleblowing-publishLeak}.
    function publishLeak(
        uint256 leak,
        uint256 nullifierHash,
        uint256 entityId,
        uint256[8] calldata proof
    ) public override {
        uint256 merkleTreeDepth = group.getMerkleTreeDepth(entityId);
        uint256 merkleTreeRoot = group.getMerkleTreeRoot(entityId);

        group.verifyProof(merkleTreeRoot, nullifierHash, leak, entityId, proof, merkleTreeDepth);

        emit LeakPublished(entityId, leak);
    }
}

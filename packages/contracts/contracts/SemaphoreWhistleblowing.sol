// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {ISemaphore} from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import {ISemaphoreWhistleblowing} from "./interfaces/ISemaphoreWhistleblowing.sol";

/// @title SemaphoreWhistleblowing
/// @dev This contract uses the Semaphore base contracts to allow whistleblowers to leak information anonymously
/// Leaks can be IPFS hashes, permanent links or other kinds of references.
contract SemaphoreWhistleblowing is ISemaphoreWhistleblowing {
    ISemaphore public semaphore;

    /// @dev Gets an entity id and return its editor address.
    mapping(uint256 => address) private entities;

    /// @dev Checks if the editor is the transaction sender.
    /// @param entityId: Id of the entity.
    modifier onlyEditor(uint256 entityId) {
        if (entities[entityId] != msg.sender) {
            revert SemaphoreWhistleblowing__CallerIsNotTheEditor();
        }

        _;
    }

    /// @dev Initializes the Semaphore group used to verify the user's ZK proofs.
    /// @param _semaphore: Semaphore group address.
    constructor(ISemaphore _semaphore) {
        semaphore = _semaphore;
    }

    /// @dev See {ISemaphoreWhistleblowing-createEntity}.
    function createEntity(address editor) external {
        uint256 groupId = semaphore.createGroup(editor);
        entities[groupId] = editor;
        emit EntityCreated(groupId, editor);
    }

    /// @dev See {ISemaphoreWhistleblowing-addWhistleblower}.
    function addWhistleblower(uint256 entityId, uint256 identityCommitment) external override onlyEditor(entityId) {
        semaphore.addMember(entityId, identityCommitment);
    }

    /// @dev See {ISemaphoreWhistleblowing-removeWhistleblower}.
    function removeWhistleblower(
        uint256 entityId,
        uint256 identityCommitment,
        uint256[] calldata proofSiblings
    ) external onlyEditor(entityId) {
        semaphore.removeMember(entityId, identityCommitment, proofSiblings);
    }

    /// @dev See {ISemaphoreWhistleblowing-publishLeak}.
    function publishLeak(
        uint256 leak,
        uint256 nullifier,
        uint256 entityId,
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256[8] calldata proof
    ) external {
        ISemaphore.SemaphoreProof memory semaphoreProof = ISemaphore.SemaphoreProof({
            merkleTreeDepth: merkleTreeDepth,
            merkleTreeRoot: merkleTreeRoot,
            nullifier: nullifier,
            message: leak,
            scope: entityId,
            points: proof
        });

        semaphore.validateProof(entityId, semaphoreProof);

        emit LeakPublished(entityId, leak);
    }

    function removeWhistleblower(
        uint256 entityId,
        uint256 identityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external override {}
}

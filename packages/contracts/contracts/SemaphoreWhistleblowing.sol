// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {ISemaphore} from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import {ISemaphoreWhistleblowing} from "./interfaces/ISemaphoreWhistleblowing.sol";
import {SemaphoreGroups} from "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";

/// @title SemaphoreWhistleblowing
/// @dev This contract uses the Semaphore base contracts to allow whistleblowers to leak information anonymously
/// Leaks can be IPFS hashes, permanent links or other kinds of references.
contract SemaphoreWhistleblowing is ISemaphoreWhistleblowing, SemaphoreGroups {
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
        uint256 nullifierHash,
        uint256 entityId,
        uint256[8] calldata proof
    ) external override {
        uint256 merkleTreeRoot = getMerkleTreeRoot(entityId);

        ISemaphore.SemaphoreProof memory semaphoreProof = ISemaphore.SemaphoreProof({
            merkleTreeDepth: 32,
            merkleTreeRoot: merkleTreeRoot,
            nullifier: nullifierHash,
            message: leak,
            scope: entityId,
            points: proof
        });

        semaphore.verifyProof(entityId, semaphoreProof);

        emit LeakPublished(entityId, leak);
    }

    function groupCounter() external view override returns (uint256) {}

    function createGroup() external override returns (uint256) {}

    function createGroup(address admin) external override returns (uint256) {}

    function createGroup(address admin, uint256 merkleTreeDuration) external override returns (uint256) {}

    function updateGroupAdmin(uint256 groupId, address newAdmin) external override {}

    function acceptGroupAdmin(uint256 groupId) external override {}

    function updateGroupMerkleTreeDuration(uint256 groupId, uint256 newMerkleTreeDuration) external override {}

    function addMember(uint256 groupId, uint256 identityCommitment) external override {}

    function addMembers(uint256 groupId, uint256[] calldata identityCommitments) external override {}

    function updateMember(
        uint256 groupId,
        uint256 oldIdentityCommitment,
        uint256 newIdentityCommitment,
        uint256[] calldata merkleProofSiblings
    ) external override {}

    function removeMember(
        uint256 groupId,
        uint256 identityCommitment,
        uint256[] calldata merkleProofSiblings
    ) external override {}

    function validateProof(uint256 groupId, SemaphoreProof calldata proof) external override {}

    function verifyProof(uint256 groupId, SemaphoreProof calldata proof) external view override returns (bool) {}

    function removeWhistleblower(
        uint256 entityId,
        uint256 identityCommitment,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external override {}

    function createEntity(uint256 entityId, address editor) external override {}
}

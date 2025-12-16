const { MerkleTree } = require('merkletreejs');
const crypto = require('crypto');

/**
 * Merkle Tree Utility for Vote Verification
 * Allows voters to cryptographically prove their vote was included in final results
 */

class MerkleTreeService {
    /**
     * Build Merkle tree from vote hashes
     * @param {Array} voteHashes - Array of vote hash strings
     * @returns {Object} - { tree, root, leaves }
     */
    buildTree(voteHashes) {
        // Convert vote hashes to buffers (leaves)
        const leaves = voteHashes.map(hash => Buffer.from(hash, 'hex'));

        // Create Merkle tree using SHA-256
        const tree = new MerkleTree(leaves, crypto.createHash.bind(crypto, 'sha256'), {
            sortPairs: true
        });

        const root = tree.getRoot().toString('hex');

        return {
            tree,
            root,
            leaves
        };
    }

    /**
     * Generate Merkle proof for a specific vote hash
     * @param {MerkleTree} tree - The Merkle tree
     * @param {string} voteHash - The vote hash to generate proof for
     * @returns {Array} - Array of proof objects
     */
    generateProof(tree, voteHash) {
        const leaf = Buffer.from(voteHash, 'hex');
        const proof = tree.getProof(leaf);

        // Convert proof to serializable format
        return proof.map(p => ({
            position: p.position,
            data: p.data.toString('hex')
        }));
    }

    /**
     * Verify a vote hash is in the Merkle tree
     * @param {string} voteHash - The vote hash to verify
     * @param {Array} proof - The Merkle proof
     * @param {string} root - The Merkle root
     * @returns {boolean} - True if valid
     */
    verifyProof(voteHash, proof, root) {
        const leaf = Buffer.from(voteHash, 'hex');
        const rootBuffer = Buffer.from(root, 'hex');

        // Convert proof back to buffers
        const proofBuffers = proof.map(p => ({
            position: p.position,
            data: Buffer.from(p.data, 'hex')
        }));

        return MerkleTree.verify(
            proofBuffers,
            leaf,
            rootBuffer,
            crypto.createHash.bind(crypto, 'sha256'),
            { sortPairs: true }
        );
    }

    /**
     * Get leaf index for a vote hash
     * @param {Array} leaves - Array of leaf buffers
     * @param {string} voteHash - The vote hash
     * @returns {number} - Index of the leaf, or -1 if not found
     */
    getLeafIndex(leaves, voteHash) {
        const leaf = Buffer.from(voteHash, 'hex');
        return leaves.findIndex(l => l.equals(leaf));
    }
}

module.exports = new MerkleTreeService();

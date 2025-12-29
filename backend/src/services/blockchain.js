const { ethers } = require('ethers');
require('dotenv').config();

// Contract ABIs (simplified - import from artifacts in production)
const VOTE_STORAGE_ABI = [
    "function storeResult(string memory _electionId, bytes32 _resultHash, uint256 _totalVotes) external",
    "function verifyResult(string memory _electionId, bytes32 _resultHash) external view returns (bool)",
    "function getResult(string memory _electionId) external view returns (bytes32 resultHash, uint256 totalVotes, uint256 timestamp, address submitter, bool finalized)",
    "function getElectionCount() external view returns (uint256)",
    "event ResultStored(string indexed electionId, bytes32 resultHash, uint256 totalVotes, uint256 timestamp, address submitter)"
];

class BlockchainService {
    constructor() {
        this.provider = new ethers.JsonRpcProvider(
            process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545'
        );

        this.wallet = new ethers.Wallet(
            process.env.PRIVATE_KEY || ethers.Wallet.createRandom().privateKey,
            this.provider
        );

        this.voteStorageContract = new ethers.Contract(
            process.env.VOTE_STORAGE_ADDRESS || '',
            VOTE_STORAGE_ABI,
            this.wallet
        );
    }

    /**
     * Store election result on blockchain
     */
    async storeElectionResult(electionId, resultHash, totalVotes) {
        try {
            console.log(`Storing result for ${electionId} on blockchain...`);

            // Convert result hash to bytes32
            const hashBytes = ethers.keccak256(ethers.toUtf8Bytes(resultHash));

            // Send transaction
            const tx = await this.voteStorageContract.storeResult(
                electionId,
                hashBytes,
                totalVotes
            );

            console.log(`Transaction sent: ${tx.hash}`);

            // Wait for confirmation
            const receipt = await tx.wait();

            console.log(`✅ Result stored on blockchain. Block: ${receipt.blockNumber}`);

            return {
                success: true,
                txHash: tx.hash,
                blockNumber: receipt.blockNumber
            };

        } catch (error) {
            console.error('Blockchain storage error:', error);
            throw new Error(`Failed to store result on blockchain: ${error.message}`);
        }
    }

    /**
     * Verify election result against blockchain
     */
    async verifyElectionResult(electionId, resultHash) {
        try {
            const hashBytes = ethers.keccak256(ethers.toUtf8Bytes(resultHash));

            const isValid = await this.voteStorageContract.verifyResult(
                electionId,
                hashBytes
            );

            return {
                verified: isValid,
                electionId
            };

        } catch (error) {
            console.error('Blockchain verification error:', error);
            throw new Error(`Failed to verify result: ${error.message}`);
        }
    }

    /**
     * Get election result from blockchain
     */
    async getElectionResult(electionId) {
        try {
            const result = await this.voteStorageContract.getResult(electionId);

            return {
                resultHash: result.resultHash,
                totalVotes: Number(result.totalVotes),
                timestamp: Number(result.timestamp),
                submitter: result.submitter,
                finalized: result.finalized
            };

        } catch (error) {
            console.error('Error fetching blockchain result:', error);
            throw new Error(`Failed to get result: ${error.message}`);
        }
    }

    /**
     * Get total number of elections on blockchain
     */
    async getElectionCount() {
        try {
            const count = await this.voteStorageContract.getElectionCount();
            return Number(count);
        } catch (error) {
            console.error('Error getting election count:', error);
            return 0;
        }
    }

    /**
     * Listen for ResultStored events
     */
    listenForResults(callback) {
        this.voteStorageContract.on('ResultStored', (electionId, resultHash, totalVotes, timestamp, submitter, event) => {
            callback({
                electionId,
                resultHash,
                totalVotes: Number(totalVotes),
                timestamp: Number(timestamp),
                submitter,
                txHash: event.log.transactionHash,
                blockNumber: event.log.blockNumber
            });
        });
    }
}

module.exports = new BlockchainService();

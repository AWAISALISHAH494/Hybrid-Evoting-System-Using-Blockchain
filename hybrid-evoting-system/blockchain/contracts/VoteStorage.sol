// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VoteStorage
 * @dev Store and verify election results on blockchain
 */
contract VoteStorage {
    
    struct ElectionResult {
        string electionId;
        bytes32 resultHash;
        uint256 totalVotes;
        uint256 timestamp;
        address submitter;
        bool finalized;
    }
    
    // Mapping from electionId to result
    mapping(string => ElectionResult) public results;
    
    // Array of all election IDs
    string[] public electionIds;
    
    // Admin addresses
    mapping(address => bool) public admins;
    address public owner;
    
    // Events
    event ResultStored(
        string indexed electionId,
        bytes32 resultHash,
        uint256 totalVotes,
        uint256 timestamp,
        address submitter
    );
    
    event ResultVerified(
        string indexed electionId,
        bool isValid
    );
    
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner, "Only admin can call this");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true;
    }
    
    /**
     * @dev Add a new admin
     */
    function addAdmin(address _admin) external onlyOwner {
        admins[_admin] = true;
        emit AdminAdded(_admin);
    }
    
    /**
     * @dev Remove an admin
     */
    function removeAdmin(address _admin) external onlyOwner {
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }
    
    /**
     * @dev Store election result hash on blockchain
     */
    function storeResult(
        string memory _electionId,
        bytes32 _resultHash,
        uint256 _totalVotes
    ) external onlyAdmin {
        require(
            !results[_electionId].finalized,
            "Result already finalized"
        );
        
        results[_electionId] = ElectionResult({
            electionId: _electionId,
            resultHash: _resultHash,
            totalVotes: _totalVotes,
            timestamp: block.timestamp,
            submitter: msg.sender,
            finalized: true
        });
        
        electionIds.push(_electionId);
        
        emit ResultStored(
            _electionId,
            _resultHash,
            _totalVotes,
            block.timestamp,
            msg.sender
        );
    }
    
    /**
     * @dev Verify if a result hash matches stored hash
     */
    function verifyResult(
        string memory _electionId,
        bytes32 _resultHash
    ) external view returns (bool) {
        return results[_electionId].resultHash == _resultHash;
    }
    
    /**
     * @dev Get result details
     */
    function getResult(string memory _electionId)
        external
        view
        returns (
            bytes32 resultHash,
            uint256 totalVotes,
            uint256 timestamp,
            address submitter,
            bool finalized
        )
    {
        ElectionResult memory result = results[_electionId];
        return (
            result.resultHash,
            result.totalVotes,
            result.timestamp,
            result.submitter,
            result.finalized
        );
    }
    
    /**
     * @dev Get total number of elections
     */
    function getElectionCount() external view returns (uint256) {
        return electionIds.length;
    }
    
    /**
     * @dev Get election ID by index
     */
    function getElectionIdByIndex(uint256 index)
        external
        view
        returns (string memory)
    {
        require(index < electionIds.length, "Index out of bounds");
        return electionIds[index];
    }
}

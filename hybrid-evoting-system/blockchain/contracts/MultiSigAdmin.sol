// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MultiSigAdmin
 * @dev Multi-signature authorization for critical admin actions
 */
contract MultiSigAdmin {
    
    struct Proposal {
        uint256 id;
        string action;
        bytes data;
        uint256 approvals;
        mapping(address => bool) hasApproved;
        bool executed;
        uint256 createdAt;
    }
    
    address[] public admins;
    mapping(address => bool) public isAdmin;
    uint256 public requiredApprovals;
    
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    
    event ProposalCreated(
        uint256 indexed proposalId,
        string action,
        address creator
    );
    
    event ProposalApproved(
        uint256 indexed proposalId,
        address approver,
        uint256 totalApprovals
    );
    
    event ProposalExecuted(
        uint256 indexed proposalId,
        address executor
    );
    
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    
    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Only admin can call this");
        _;
    }
    
    constructor(address[] memory _admins, uint256 _requiredApprovals) {
        require(_admins.length >= _requiredApprovals, "Invalid approval count");
        require(_requiredApprovals > 0, "Required approvals must be > 0");
        
        for (uint256 i = 0; i < _admins.length; i++) {
            address admin = _admins[i];
            require(admin != address(0), "Invalid admin address");
            require(!isAdmin[admin], "Duplicate admin");
            
            admins.push(admin);
            isAdmin[admin] = true;
        }
        
        requiredApprovals = _requiredApprovals;
    }
    
    /**
     * @dev Create a new proposal
     */
    function createProposal(
        string memory _action,
        bytes memory _data
    ) external onlyAdmin returns (uint256) {
        uint256 proposalId = proposalCount++;
        
        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.action = _action;
        proposal.data = _data;
        proposal.approvals = 0;
        proposal.executed = false;
        proposal.createdAt = block.timestamp;
        
        emit ProposalCreated(proposalId, _action, msg.sender);
        
        return proposalId;
    }
    
    /**
     * @dev Approve a proposal
     */
    function approveProposal(uint256 _proposalId) external onlyAdmin {
        Proposal storage proposal = proposals[_proposalId];
        
        require(!proposal.executed, "Proposal already executed");
        require(!proposal.hasApproved[msg.sender], "Already approved");
        
        proposal.hasApproved[msg.sender] = true;
        proposal.approvals++;
        
        emit ProposalApproved(_proposalId, msg.sender, proposal.approvals);
        
        // Auto-execute if threshold reached
        if (proposal.approvals >= requiredApprovals) {
            executeProposal(_proposalId);
        }
    }
    
    /**
     * @dev Execute a proposal (internal)
     */
    function executeProposal(uint256 _proposalId) internal {
        Proposal storage proposal = proposals[_proposalId];
        
        require(!proposal.executed, "Already executed");
        require(proposal.approvals >= requiredApprovals, "Not enough approvals");
        
        proposal.executed = true;
        
        emit ProposalExecuted(_proposalId, msg.sender);
    }
    
    /**
     * @dev Check if proposal is approved
     */
    function isProposalApproved(uint256 _proposalId)
        external
        view
        returns (bool)
    {
        return proposals[_proposalId].approvals >= requiredApprovals;
    }
    
    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 _proposalId)
        external
        view
        returns (
            string memory action,
            uint256 approvals,
            bool executed,
            uint256 createdAt
        )
    {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.action,
            proposal.approvals,
            proposal.executed,
            proposal.createdAt
        );
    }
    
    /**
     * @dev Check if address has approved proposal
     */
    function hasApproved(uint256 _proposalId, address _admin)
        external
        view
        returns (bool)
    {
        return proposals[_proposalId].hasApproved[_admin];
    }
    
    /**
     * @dev Get admin count
     */
    function getAdminCount() external view returns (uint256) {
        return admins.length;
    }
}

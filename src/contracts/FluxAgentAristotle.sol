// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IFlow {
    struct Node {
        bytes32 root;
        uint256 height;
    }
    struct Submission {
        uint256 length;
        address tags;
        Node[] nodes;
    }
    function submit(Submission calldata submission) external payable;
}

contract FluxAgentAristotle {
    address public constant FLOW_ADDRESS = 0x62D4144dB0F0a6fBBaeb6296c785C71B3D57C526;
    
    event AgentRegistered(uint256 indexed agentId, bytes32 indexed dataRoot, address indexed creator);
    
    uint256 private _nextAgentId = 1000;
    mapping(uint256 => bytes32) public agentDataRoots;

    /**
     * @dev One-click function to mint an Agent Identity and submit to 0G Storage.
     * @param dataRoot The Merkle root of the research data.
     * @param length The total length of the data in bytes.
     */
    function registerAgentAndStore(bytes32 dataRoot, uint256 length) external payable {
        // 1. Create the submission for 0G Storage
        IFlow.Node[] memory nodes = new IFlow.Node[](1);
        nodes[0] = IFlow.Node({
            root: dataRoot,
            height: 0
        });

        IFlow.Submission memory submission = IFlow.Submission({
            length: length,
            tags: address(0),
            nodes: nodes
        });

        // 2. Submit to the 0G Flow contract (forwarding the market fee)
        IFlow(FLOW_ADDRESS).submit{value: msg.value}(submission);

        // 3. Register the Agent in our own registry
        uint256 agentId = _nextAgentId++;
        agentDataRoots[agentId] = dataRoot;

        emit AgentRegistered(agentId, dataRoot, msg.sender);
    }

    // Allow owner to withdraw any excess fees (though usually users pay exact amount)
    function withdraw() external {
        payable(msg.sender).transfer(address(this).balance);
    }
}

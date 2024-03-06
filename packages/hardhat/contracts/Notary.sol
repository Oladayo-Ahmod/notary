// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Notary {
    address public owner;

    struct Document {
        uint256 timestamp;
        address owner;
        string hash;
        string metadata; // Additional metadata for the document
        bool revoked;
    }

    mapping(string => Document) public documents;
    mapping(address => string[]) public userDocuments;

    event DocumentNotarized(address indexed owner, string indexed documentHash, uint256 timestamp, string metadata);
    event DocumentRetrieved(address indexed requester, string indexed documentHash, uint256 timestamp);
    event DocumentRevoked(address indexed owner, string indexed documentHash, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    modifier onlyDocumentOwner(string memory _hash) {
        require(documents[_hash].owner == msg.sender, "You are not the owner of this document");
        _;
    }

    modifier documentNotRevoked(string memory _hash) {
        require(!documents[_hash].revoked, "This document has been revoked");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function notarizeDocument(string memory _hash, string memory _metadata) public {
        require(documents[_hash].timestamp == 0, "Document already notarized");

        documents[_hash] = Document({
            timestamp: block.timestamp,
            owner: msg.sender,
            hash: _hash,
            metadata: _metadata,
            revoked: false
        });

        userDocuments[msg.sender].push(_hash);

        emit DocumentNotarized(msg.sender, _hash, block.timestamp, _metadata);
    }

    function retrieveDocument(string memory _hash) public onlyDocumentOwner(_hash) documentNotRevoked(_hash) {
        emit DocumentRetrieved(msg.sender, _hash, block.timestamp);
    }

    function revokeDocument(string memory _hash) public onlyDocumentOwner(_hash) documentNotRevoked(_hash) {
        documents[_hash].revoked = true;
        emit DocumentRevoked(msg.sender, _hash, block.timestamp);
    }

    function getOwnedDocuments() public view returns (string[] memory) {
        return userDocuments[msg.sender];
    }

    function verifyDocument(string memory _hash) public view returns (uint256, address, string memory, bool) {
        return (documents[_hash].timestamp, documents[_hash].owner, documents[_hash].metadata, documents[_hash].revoked);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Notary {
    address public owner;

    // Struct to represent a notarized document
    struct Document {
        uint256 timestamp; // Timestamp when the document was notarized
        address owner; // Address of the owner who notarized the document
        string hash; // Hash of the document content
        string imageURI; // URI to the image associated with the document
        string description; // Description of the document
        bool revoked; // Flag to indicate if the document has been revoked
    }

    // Mapping to store documents indexed by their hash
    mapping(string => Document) public documents;

    // Mapping to store a list of document hashes owned by each user
    mapping(address => string[]) public userDocuments;

    // Events to log document actions
    event DocumentNotarized(address indexed owner, string indexed documentHash, uint256 timestamp, string imageURI, string description);
    event DocumentRetrieved(address indexed requester, string indexed documentHash, uint256 timestamp);
    event DocumentRevoked(address indexed owner, string indexed documentHash, uint256 timestamp);

    // Modifier to restrict access to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    // Modifier to restrict access to the owner of a specific document
    modifier onlyDocumentOwner(string memory _hash) {
        require(documents[_hash].owner == msg.sender, "You are not the owner of this document");
        _;
    }

    // Modifier to check if a document has not been revoked
    modifier documentNotRevoked(string memory _hash) {
        require(!documents[_hash].revoked, "This document has been revoked");
        _;
    }

    // Constructor to set the contract owner
    constructor() {
        owner = msg.sender;
    }

    // Function to notarize a document
    function notarizeDocument(string memory _hash, string memory _imageURI, string memory _description) public {
        require(documents[_hash].timestamp == 0, "Document already notarized");

        documents[_hash] = Document({
            timestamp: block.timestamp,
            owner: msg.sender,
            hash: _hash,
            imageURI: _imageURI,
            description: _description,
            revoked: false
        });

        userDocuments[msg.sender].push(_hash);

        emit DocumentNotarized(msg.sender, _hash, block.timestamp, _imageURI, _description);
    }

    // Function to retrieve a document by its hash
    function retrieveDocument(string memory _hash) public view returns (Document memory) {
        return documents[_hash];
    }

    // Function to revoke a notarized document
    function revokeDocument(string memory _hash) public onlyDocumentOwner(_hash) documentNotRevoked(_hash) {
        documents[_hash].revoked = true;
        emit DocumentRevoked(msg.sender, _hash, block.timestamp);
    }

    // Function to verify details of a document by its hash
    function verifyDocument(string memory _hash) public view returns (uint256, address, string memory, string memory, bool) {
        return (documents[_hash].timestamp, documents[_hash].owner, documents[_hash].imageURI, documents[_hash].description, documents[_hash].revoked);
    }

    // Function to get all documents owned by the caller
    function getAllDocuments() public view returns (Document[] memory) {
        uint256 documentCount = userDocuments[msg.sender].length;
        Document[] memory allDocuments = new Document[](documentCount);

        for (uint256 i = 0; i < documentCount; i++) {
            string memory documentHash = userDocuments[msg.sender][i];
            allDocuments[i] = documents[documentHash];
        }

        return allDocuments;
    }
}

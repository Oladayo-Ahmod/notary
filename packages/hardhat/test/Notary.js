const { expect } = require("chai");

describe("Notary contract", function () {
  let Notary;
  let notary;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the Notary contract
    Notary = await ethers.getContractFactory("Notary");
    notary = await Notary.deploy();
    await notary.deployed();
  });

  describe("Notarize document", function () {
    it("Should notarize a document", async function () {
      const documentContent = "This is the content of my document";
      const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(documentContent));
      const metadata = "Document metadata";

      // Notarize a document
      await notary.connect(owner).notarizeDocument(documentHash, metadata);

      // Verify the document details
      const [timestamp, documentOwner, documentMetadata, revoked] = await notary.verifyDocument(documentHash);

      expect(timestamp).to.not.equal(0);
      expect(documentOwner).to.equal(owner.address);
      expect(documentMetadata).to.equal(metadata);
      expect(revoked).to.be.false;

      // Check the user's owned documents
      const ownedDocuments = await notary.getOwnedDocuments();
      expect(ownedDocuments).to.deep.equal([documentHash]);
    });

    it("Should prevent notarizing the same document twice", async function () {
      const documentContent = "This is the content of my document";
      const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(documentContent));
      const metadata = "Document metadata";

      // Notarize a document
      await notary.connect(owner).notarizeDocument(documentHash, metadata);

      // Attempt to notarize the same document again
      await expect(notary.connect(owner).notarizeDocument(documentHash, "New metadata")).to.be.revertedWith("Document already notarized");
    });
  });

  describe("Retrieve document", function () {
    it("Should retrieve a notarized document", async function () {
      const documentContent = "This is the content of my document";
      const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(documentContent));
      const metadata = "Document metadata";
  
      // Notarize a document
      await notary.connect(owner).notarizeDocument(documentHash, metadata);
  
      // Retrieve the notarized document
      await notary.connect(owner).retrieveDocument(documentHash);
  
      // Check the user's owned documents after retrieval
      const ownedDocumentsAfter = await notary.getOwnedDocuments();
  
      // Output some information for debugging
      console.log("Owned Documents After Retrieval:", ownedDocumentsAfter);
  
      // Check that the retrieved document is still present in the user's owned documents
      expect(ownedDocumentsAfter).to.include(documentHash);
    });
  });  

  describe("Revoke document", function () {
    it("Should revoke a notarized document", async function () {
      const documentContent = "This is the content of my document";
      const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(documentContent));
      const metadata = "Document metadata";

      // Notarize and revoke a document
      await notary.connect(owner).notarizeDocument(documentHash, metadata);
      await notary.connect(owner).revokeDocument(documentHash);

      // Verify the document revocation
      const [, , , revoked] = await notary.verifyDocument(documentHash);
      expect(revoked).to.be.true;
    });

    it("Should prevent revoking a document that is not owned", async function () {
      const documentContent = "This is the content of my document";
      const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(documentContent));
      const metadata = "Document metadata";

      // Notarize a document
      await notary.connect(owner).notarizeDocument(documentHash, metadata);

      // Attempt to revoke the document from another address
      await expect(notary.connect(addr1).revokeDocument(documentHash)).to.be.revertedWith("You are not the owner of this document");
    });
  });
});

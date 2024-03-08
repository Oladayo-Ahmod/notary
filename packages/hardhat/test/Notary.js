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
      const imageURI = "https://example.com/image.jpg";
      const description = "Document description";

      // Notarize a document
      await notary.connect(owner).notarizeDocument(documentHash, imageURI, description);

      // Retrieve the notarized document
      const retrievedDocument = await notary.retrieveDocument(documentHash);

      // Check the document details
      expect(retrievedDocument.hash).to.equal(documentHash);
      expect(retrievedDocument.imageURI).to.equal(imageURI);
      expect(retrievedDocument.description).to.equal(description);
    });
  });

  describe("Get all documents", function () {
    it("Should retrieve all documents in the contract", async function () {
      const documentContent1 = "This is the content of my first document";
      const documentHash1 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(documentContent1));
      const imageURI1 = "https://example.com/image1.jpg";
      const description1 = "Description 1";

      const documentContent2 = "This is the content of my second document";
      const documentHash2 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(documentContent2));
      const imageURI2 = "https://example.com/image2.jpg";
      const description2 = "Description 2";

      // Notarize two documents
      await notary.connect(owner).notarizeDocument(documentHash1, imageURI1, description1);
      await notary.connect(owner).notarizeDocument(documentHash2, imageURI2, description2);

      // Retrieve all documents
      const allDocuments = await notary.getAllDocuments();

      // Check that both documents are retrieved
      expect(allDocuments.length).to.equal(2);
      expect(allDocuments[0].hash).to.equal(documentHash1);
      expect(allDocuments[0].imageURI).to.equal(imageURI1);
      expect(allDocuments[0].description).to.equal(description1);
      expect(allDocuments[1].hash).to.equal(documentHash2);
      expect(allDocuments[1].imageURI).to.equal(imageURI2);
      expect(allDocuments[1].description).to.equal(description2);
    });
  });

  describe("Revoke document", function () {
    it("Should revoke a notarized document", async function () {
      const documentContent = "This is the content of my document";
      const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(documentContent));
      const imageURI = "https://example.com/image.jpg";
      const description = "Document description";

      // Notarize and revoke a document
      await notary.connect(owner).notarizeDocument(documentHash, imageURI, description);
      await notary.connect(owner).revokeDocument(documentHash);

      // Verify the document revocation
      const [, , , , revoked] = await notary.verifyDocument(documentHash);
      expect(revoked).to.be.true;
    });

    it("Should prevent revoking a document that is not owned", async function () {
      const documentContent = "This is the content of my document";
      const documentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(documentContent));
      const imageURI = "https://example.com/image.jpg";
      const description = "Document description";

      // Notarize a document
      await notary.connect(owner).notarizeDocument(documentHash, imageURI, description);

      // Attempt to revoke the document from another address
      await expect(notary.connect(addr1).revokeDocument(documentHash)).to.be.revertedWith("You are not the owner of this document");
    });
  });
});

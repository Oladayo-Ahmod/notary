// Importing the dependencies
import { useCallback, useEffect, useState } from "react"; // Import necessary hooks from React
import useDownloader from 'react-use-downloader'; // Import the useDownloader hook for downloading files
import { ethers } from "ethers"; // Import ethers for interacting with Ethereum smart contracts
import { toast } from "react-toastify"; // Import toast for showing notifications
import { useContractCall } from "@/hooks/contract/useContractRead"; // Import useContractCall for reading contract data
// Import the useAccount hook to get the user's address
import { useAccount } from "wagmi";
// Import the useConnectModal hook to trigger the wallet connect modal
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { ADDRESS, ABI } from "@/abi/index"; // Import contract address and ABI


interface NotaryDocument { // Define the structure of a Notary Document
  timestamp: number; // Timestamp of the document
  owner: string; // Address of the document owner
  hash: string; // Hash of the document
  imageURI: string; // URI of the document image
  description: string; // Description of the document
  revoked: boolean; // Flag indicating if the document is revoked
}


let connect: any // Declare a variable for the Ethereum provider
if (typeof window !== 'undefined') { // Check if window object exists (for SSR compatibility)
    connect = (window as any).ethereum // Assign Ethereum provider to connect variable
}

const ListNotary = () => { // Define the functional component ListNotary
  
  // Use the useAccount hook to store the user's address
  const { address } = useAccount();
  // Use the useDownloader hook to handle file downloads
  const { download, isInProgress, percentage } = useDownloader();

  // Initialize loading state as an empty object
  const [loading, setLoading] = useState<Record<string, string | null>>({});
  // Initialize documents state as an empty array
  const [documents, setDocuments] = useState<NotaryDocument[]>([]);
  // Use the useConnectModal hook to trigger the wallet connect modal
  const { openConnectModal } = useConnectModal();

  useEffect(() => { // Run effect when component mounts or updates
    MyDocuments(); // Call the MyDocuments function to retrieve user documents
  })

  // Function to generate a random image URL with a unique seed based on the notary description
  const generateRandomImage = (title: string) => {
    const width = 400; // Define image width
    const height = 300; // Define image height
    const seed = title.replace(/\s+/g, "-").toLowerCase(); // Generate seed from title
    return `https://picsum.photos/seed/${seed}/${width}/${height}`; // Return generated image URL
  };

  // Function to handle the download of a document
  const handleDownload = (fileUrl: string, fileName: string) => {
    toast.info('Disable your adblocker. Otherwise, it will not download.'); // Show info toast
    download(fileUrl, fileName); // Trigger file download
    if (!isInProgress) { // Check if download is not in progress
      toast.success('Downloading'); // Show success toast
    }
  };

  // Function to retrieve current user documents
  const MyDocuments = async () => {
    try {
      // If the user is not connected, trigger the wallet connect modal
      if (!address && openConnectModal) {
        openConnectModal();
        return;
      }
      const provider = new ethers.providers.Web3Provider(connect); // Create Ethereum provider instance
      const signer = provider.getSigner(); // Get signer from provider
      const contract = new ethers.Contract(ADDRESS, ABI, signer); // Create contract instance
      const documents = await contract.getAllDocuments(); // Call contract method to retrieve documents
      setDocuments(documents); // Set retrieved documents to state
    } catch (error: any) { // Catch any errors
      console.log(error); // Log the error
    }
  }

  // Function to revoke a document
  const HandleRevoke = async (hash: string) => {
    try {
      // If the user is not connected, trigger the wallet connect modal
      if (!address && openConnectModal) {
        openConnectModal();
        return;
      }
      // Update loading state to indicate revocation in progress
      setLoading((prevLoading) => ({
        ...prevLoading,
        [hash]: 'Revoking..'
      }));
      const provider = new ethers.providers.Web3Provider(connect); // Create Ethereum provider instance
      const signer = provider.getSigner(); // Get signer from provider
      const contract = new ethers.Contract(ADDRESS, ABI, signer); // Create contract instance
      const documents = await contract.revokeDocument(hash); // Call contract method to revoke document
      // Update loading state to indicate waiting for confirmation
      setLoading((prevLoading) => ({
        ...prevLoading,
        [hash]: 'Waiting...'
      }));
      await documents.wait(); // Wait for transaction confirmation
      // Update loading state to indicate revocation completed
      setLoading((prevLoading) => ({
        ...prevLoading,
        [hash]: 'Revoked'
      }));
      toast.success('Document revoked successfully!'); // Show success toast
    } catch (error: any) { // Catch any errors
      console.log(error); // Log the error
      // Update loading state to indicate revocation failed
      setLoading((prevLoading) => ({
        ...prevLoading,
        [hash]: 'Revoke'
      }));
      toast.success('Error revoking document!'); // Show error toast
    }
  }

  return (
    <div className="container docs-wrapper mb-8">
      <h2 className="mb-5 docs-h2 ">My Documents</h2>
      <div className="flex flex-wrap -mx-4">
        {/* Check if documents array exists and has elements before mapping */}
        {documents && documents.length > 0 ? (
          documents.map((document) => (
            <div key={document.hash} className="drop-shadow-2xl w-full md:w-1/3 p-4" style={{ 'color': 'black', "background": "transparent" }}>
              <div className="card shadow">
                {/* Replace the image source with document image URI */}
                <img src={generateRandomImage(document.description)} className="card-img-top" alt="Document" />
                <div className="card-body p-2" style={{ 'background': 'beige' }}>
                  {/* Display document owner */}
                  <h5 className=" text-lg">Owner: {`${document.owner.slice(0, 6)}...${document.owner.slice(-4)}`}</h5>
                  {/* Display document description */}
                  <p className="text-gray-600">Description: {document.description}</p>
                  {/* Display document timestamp */}
                  <p className="text-gray-600">Timestamp: {new Date(document.timestamp * 1000).toLocaleString()}</p>
                  {/* Button to download the document */}
                  <button
                    className="my-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ms-2"
                    onClick={() => handleDownload(document.imageURI, document.description)}
                  >
                    {/* Display appropriate label based on loading state */}
                    {loading[document.imageURI] ? loading[document.imageURI] : 'Download'}
                  </button>
                  {/* Conditionally render revoke button based on document status */}
                  {document.revoked ? (
                    <button className="my-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ms-2" disabled>Revoked</button>
                  ) : (
                    <button className="my-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ms-2"
                      onClick={() => HandleRevoke(document.hash)}>
                      {/* Display appropriate label based on loading state */}
                      {loading[document.hash] ? loading[document.hash] : 'Revoke'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>You Have No document Available</p>
        )}
      </div>
    </div>
  );
}

export default ListNotary;

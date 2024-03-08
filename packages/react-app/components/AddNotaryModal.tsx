// This component is used to add a notary to the marketplace and show the user's cUSD balance

// Importing the dependencies
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import { useContractSend } from "@/hooks/contract/useContractWrite";
import {uploadFileToIPFS} from '../constants/pinata'

// The AddNotaryModal component is used to add a notary to the marketplace
const AddNotaryModal = () => {
    // The visible state is used to toggle the modal
    const [visible, setVisible] = useState(false);
    // The following states are used to store the values of the form fields
    const [notaryFileURI, setNotaryFileURI] = useState("");
    const [notaryDescription, setNotaryDescription] = useState("");
    const [fileURIhash, setFileURIhash] = useState("");
    // The loading state is used to display a loading message
    const [loading, setLoading] = useState(false);

    // Debounce input fields
    const [debouncedNotaryFileURI] = useDebounce(notaryFileURI, 500);
    const [debouncedNotaryDescription] = useDebounce(notaryDescription, 500);

    // Check if all fields are complete
    const isComplete =  debouncedNotaryFileURI && debouncedNotaryDescription;

    // Clear the input fields after the notary is added to the marketplace
    const clearForm = () => {
        setNotaryFileURI("");
        setNotaryDescription("");
    };

    // Use the useContractSend hook to use our notarizeDocument function on the marketplace contract and add a notary
    const { writeAsync: notarizeDocument } = useContractSend("notarizeDocument", [
        fileURIhash,
        debouncedNotaryFileURI,
        debouncedNotaryDescription
    ]);

    // Handle file selection
    const handleFileChange = async (e :any) => {
        const file = e.target.files[0];
        try {
            const response = await uploadFileToIPFS(file);
            setNotaryFileURI(response.pinataURL);
            const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(response.pinataURL));
           setFileURIhash(hash)          
           console.log(hash);
           
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Error uploading file. Please try again.");
        }
    };

    // Define function that handles the creation of a notary
    const addNotary = async (e:any) => {
      e.preventDefault();
      try {
        
          setLoading(true);
          if (!isComplete) {
              throw new Error("Please fill all fields.");
          }
          if (!notarizeDocument) {
            throw new Error("Error notarizing file.");
        }
          

        //   if (notarizeDocument) {
              // Call the function to notarize the document
              await notarizeDocument();
              // Display a success message
              toast.success("Notary added successfully!");
              // Clear the form
              clearForm();
              // Close the modal
              setVisible(false);
        //   } else {
            //   throw new Error("notarizeDocument function is not available.");
        //   }
      } catch (error :any) {
          console.error("Error adding notary:", error);
          toast.error(error.message || "Error adding notary. Please try again.");
      } finally {
          setLoading(false);
      }
  };
  

    // Define the JSX that will be rendered
    return (
        <div className="flex flex-row w-full justify-between">
            <div>
                {/* Add Notary Button that opens the modal */}
                <button
                    type="button"
                    onClick={() => setVisible(true)}
                    className="inline-block notary-btn ml-4 px-6 py-2.5 bg-black text-white font-medium text-md leading-tight rounded-2xl shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenter"
                >
                    Add Notary
                </button>

                {/* Modal */}
                {visible && (
                    <div className="fixed z-40 overflow-y-auto top-0 w-full left-0" id="modal">
                        {/* Form with input fields for the notary */}
                        <form onSubmit={addNotary}>
                            <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 transition-opacity">
                                    <div className="absolute inset-0 bg-gray-900 opacity-75" />
                                </div>
                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                                <div className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        
                                        <label>Notary Description</label>
                                        <input onChange={(e) => setNotaryDescription(e.target.value)} required 
                                        type="text" className="w-full bg-gray-100 p-2 mt-2 mb-3" />
                                        
                                        <label>Notary File</label>
                                        <input onChange={handleFileChange} required type="file" className="w-full bg-gray-100 p-2 mt-2 mb-3" />

                                    </div>
                                    <div className="bg-gray-200 px-4 py-3 text-right">
                                        <button type="button" onClick={() => setVisible(false)} className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"><i className="fas fa-times"></i> Cancel</button>
                                        <button type="submit" disabled={loading} className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2">{loading ? "Loading..." : "Create"}</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddNotaryModal;

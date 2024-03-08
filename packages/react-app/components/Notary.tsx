/* eslint-disable @next/next/no-img-element */

// Importing the dependencies
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
// Import ethers to format the price of the Notary correctly
import { ethers } from "ethers";
// Import the useConnectModal hook to trigger the wallet connect modal
import { useConnectModal } from "@rainbow-me/rainbowkit";
// Import the useAccount hook to get the user's address
import { useAccount } from "wagmi";
// Import the toast library to display notifications
import { toast } from "react-toastify";
// Import our custom identicon template to display the owner of the Notary
// import { identiconTemplate } from "@/helpers";
// Import our custom hooks to interact with the smart contract
import { useContractCall } from "@/hooks/contract/useContractRead";
import { useContractSend } from "@/hooks/contract/useContractWrite";

interface Notary{
    title :string,
    description: string,
    username : string,
    owner : string,
    fileURI : string
}

// Define the Notary component which takes in the hash of the document ,metadata and some functions to display notifications
const Notary = ({ hash,metadata, setError, setLoading, clear }: any) => {
    // Use the useAccount hook to store the user's address
    const { address } = useAccount();
    // Use the useContractCall hook to read the data of the Notary with the hash passed in, from the marketplace contract
    const { data: rawNotary }: any = useContractCall("retrieveDocument", [hash], true);
    // Use the useContractSend hook to Notarize the document with the hash passed in, via the Notary contract
    const { writeAsync: notarize } = useContractSend("notarizeDocument", [hash,metadata]);
    const [Notary, setNotary] = useState<Notary | null>(null);
    // // Use the useContractApprove hook to approve the spending of the Notary's price, for the ERC20 cUSD contract
    // const { writeAsync: approve } = useContractApprove(
    //   Notary?.price?.toString() || "0"
    // );
    // Use the useConnectModal hook to trigger the wallet connect modal
    const { openConnectModal } = useConnectModal();
    // Format the Notary data that we read from the smart contract
    const getFormatNotary = useCallback(() => {
      if (!rawNotary) return null;
      setNotary({
        title : rawNotary[0],
        description: rawNotary[1],
        username: rawNotary[2],
        owner: rawNotary[3],
        fileURI: rawNotary[4],
      });
    }, [rawNotary]);
  // Call the getFormatProduct function when the rawProduct state changes
  useEffect(() => {
    getFormatNotary();
  }, [getFormatNotary]);


// Return the JSX for the Notary component
return (
    <div className={"shadow-lg relative rounded-b-lg"}>
      <p className="group">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-white xl:aspect-w-7 xl:aspect-h-8 ">
          {/* Show the number of products sold */}
          <span
            className={
              "absolute z-10 right-0 mt-4 bg-amber-400 text-black p-1 rounded-l-lg px-4"
            }
          >
            {/* {product.sold} sold */}
          </span>
          {/* Show the product image */}
          <img
            src=''
            alt={"image"}
            className="w-full h-80 rounded-t-md  object-cover object-center group-hover:opacity-75"
          />
          {/* Show the address of the product owner as an identicon and link to the address on the Celo Explorer */}
          <Link
            href={`https://explorer.celo.org/alfajores/address/`}
            className={"absolute -mt-7 ml-6 h-16 w-16 rounded-full"}
          >
            {/* {identiconTemplate(product.owner)} */}
          </Link>
        </div>

        <div className={"m-5"}>
          <div className={"pt-1"}>
            {/* Show the product name */}
            <p className="mt-4 text-2xl font-bold">Product name</p>
            <div className={"h-40 overflow-y-hidden scrollbar-hide"}>
              {/* Show the product description */}
              <h3 className="mt-4 text-sm text-gray-700">
                product description
              </h3>
            </div>
          </div>

          <div>
            <div className={"flex flex-row"}>
              {/* Show the product location */}
              <img src={"/location.svg"} alt="Location" className={"w-6"} />
              {/* <h3 className="pt-1 text-sm text-gray-700">{product.location}</h3> */}
            </div>

            {/* Buy button that calls the purchaseProduct function on click */}
            <button
            //   onClick={purchaseProduct}
              className="mt-4 h-14 w-full border-[1px] border-gray-500 text-black p-2 rounded-lg hover:bg-black hover:text-white"
            >
              {/* Show the product price in cUSD */}
              {/* Buy for {productPriceFromWei} cUSD */}
            </button>
          </div>
        </div>
      </p>
    </div>
  );
};

export default Notary;
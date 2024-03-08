import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Notary from "@/components/Notary";
import AddNotary from "@/components/AddNotary";
import ListNotary from "@/components/ListNotary";

export default function Home() {
  const [userAddress, setUserAddress] = useState("");
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);

  return (
    <>
    <div className="flex flex-col justify-center items-center">
      <div className="h1">
        <AddNotary />
         <h1 className="notary-h1">Decentralized Notary Service</h1>
      </div>
      {/* {isConnected && (
        <div className="h2 text-center">Your address: {userAddress}</div>
      )} */}
    </div>
        <ListNotary />
    </>
    

  );
}

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

// abi
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";

// CONTRACT-ADDRESS
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [currentAccount, setCurrentAccount] = useState([]);
  const [greeting, setGreetingValue] = useState("");
  const [dataval, setDataValue] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestAccount = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to use this dApp");
      return;
    }
    try {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(account[0]);
    } catch (e) {
      setError(e.message);
      console.error(e.message);
    }
  };

  const fetchGreeting = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        setDataValue(data);
      } catch (e) {
        console.error(e.message);
        setError(e.message);
      }
    }
  };



  const setGreeting = async () => {
    if (!greeting || !currentAccount) {
      return;
    }
    if (typeof window.ethereum !== "undefined") {
      setLoading(true);
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const singer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        Greeter.abi,
        singer
      );
      const transaction = await contract.setGreeting(greeting);
      setGreetingValue("");
      await transaction.wait();
    fetchGreeting();
      setLoading(false);
    }
  };


  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>blockchain Dapp with solidity and reactjs</h1>
      </div>
      <hr />
      {dataval && (
        <>
          {dataval}
          <hr />
        </>
      )}
      <div className="App">
        <input
          type="text"
          value={greeting}
          placeholder="say Hello to Blockchain :)"
          onChange={(e) => setGreetingValue(e.target.value)}
        />
        <button type="button" onClick={fetchGreeting}>
          fetch Greeting
        </button>
        <button type="button" onClick={setGreeting}>
          set Greeting
        </button>
      </div>
    </>
  );
}

export default App;

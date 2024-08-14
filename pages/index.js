import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [catScore, setCatScore] = useState("");
  const [scholarshipAmount, setScholarshipAmount] = useState(0);
  const [showBrochure, setShowBrochure] = useState(false);
  const [eligibilityMessage, setEligibilityMessage] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(balance.toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  const checkEligibility = () => {
    const score = parseInt(catScore);
    if (score > 400) {
      setScholarshipAmount(10000);
      setEligibilityMessage("Fantastic! You're eligible for a $10,000 scholarship.");
    } else if (score > 350) {
      setScholarshipAmount(7000);
      setEligibilityMessage("Great job! You're eligible for a $7,000 scholarship.");
    } else if (score > 300) {
      setScholarshipAmount(6000);
      setEligibilityMessage("Well done! You're eligible for a $6,000 scholarship.");
    } else if (score > 250) {
      setScholarshipAmount(5000);
      setEligibilityMessage("Good effort! You're eligible for a $5,000 scholarship.");
    } else {
      setScholarshipAmount(0);
      setEligibilityMessage("Unfortunately, you're not eligible for a scholarship.");
    }
    setShowBrochure(true);
  };

  const viewBrochure = () => {
    setShowBrochure(!showBrochure);
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1 className="title">Metacrafters ATM & Scholarship Portal</h1>
      </header>
      <div className="content">
        {account ? (
          <div className="account-details">
            <p><strong>Account:</strong> {account}</p>
            <p><strong>Balance:</strong> {balance}</p>
            <div className="actions">
              <button className="button" onClick={deposit}>Deposit 1 ETH</button>
              <button className="button" onClick={withdraw}>Withdraw 1 ETH</button>
            </div>
            <div className="scholarship">
              <label htmlFor="catScore" className="label">Enter your CAT score:</label>
              <input
                type="text"
                id="catScore"
                value={catScore}
                onChange={(e) => setCatScore(e.target.value)}
                className="input"
              />
              <button className="button" onClick={checkEligibility}>Check Eligibility</button>
              <p className="message">{eligibilityMessage}</p>
              {showBrochure && (
                <div className="brochure">
                  <h2 className="subtitle">Scholarship Details</h2>
                  <p>
                    Score above 400: <span className="highlight">$10,000 Scholarship</span>
                  </p>
                  <p>
                    Score above 350: <span className="highlight">$7,000 Scholarship</span>
                  </p>
                  <p>
                    Score above 300: <span className="highlight">$6,000 Scholarship</span>
                  </p>
                  <p>
                    Score above 250: <span className="highlight">$5,000 Scholarship</span>
                  </p>
                </div>
              )}
              <button className="button" onClick={viewBrochure}>
                {showBrochure ? "Hide Scholarship Brochure" : "View Scholarship Brochure"}
              </button>
            </div>
          </div>
        ) : (
          <button className="button" onClick={connectAccount}>Connect MetaMask Wallet</button>
        )}
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(to right, #f8f9fa, #e0e0e0);
          color: #333;
          font-family: 'Arial', sans-serif;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .title {
          color: #007bff;
          font-size: 2.5em;
          margin-bottom: 20px;
        }
        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 600px;
        }
        .account-details {
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          width: 100%;
        }
        .actions {
          display: flex;
          justify-content: space-around;
          margin-top: 20px;
        }
        .scholarship {
          margin-top: 20px;
          text-align: left;
        }
        .label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
        }
        .input {
          width: 100%;
          padding: 10px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .button {
          background: #007bff;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1em;
          margin: 5px;
          transition: background 0.3s ease;
        }
        .button:hover {
          background: #0056b3;
        }
        .message {
          margin-top: 20px;
          font-size: 1.2em;
          color: #28a745;
        }
        .brochure {
          background: #f1f1f1;
          padding: 20px;
          border-radius: 10px;
          margin-top: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .subtitle {
          color: #17a2b8;
          margin-bottom: 10px;
        }
        .highlight {
          color: #ffc107;
          font-weight: bold;
        }
      `}</style>
    </main>
  );
}

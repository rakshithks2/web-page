import React, { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [isSecurityCheckVisible, setIsSecurityCheckVisible] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account && account.length > 0) {
      console.log("Account connected: ", account[0]);
      setAccount(account[0]);
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

    // once wallet is set we can get a reference to our deployed contract
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
      setBalance(ethers.utils.formatEther(balance));
    }
  };

  const deposit = async () => {
    if (atm) {
      if (!(await performSecurityCheck())) return;

      let tx = await atm.deposit(ethers.utils.parseEther("1"));
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      if (!(await performSecurityCheck())) return;

      let tx = await atm.withdraw(ethers.utils.parseEther("1"));
      await tx.wait();
      getBalance();
    }
  };

  const performSecurityCheck = async () => {
    const answer = prompt(securityQuestion);
    setUserAnswer(answer);
    if (parseInt(answer) === securityAnswer) {
      return true;
    } else {
      alert("Incorrect answer. Access denied.");
      return false;
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <div>
          <h3>Holder Information</h3>
          <p>Name: Shashank</p>
          <p>Age: 21</p>
          <p>Nationality: Indian</p>
        </div>
      </div>
    );
  };

  const calculateGoldReturns = (investmentAmount, initialPrice, investmentYear, currentYear, currentPrice) => {
    const yearsPassed = currentYear - investmentYear;
    const goldPurchased = investmentAmount / initialPrice;
    const currentInvestmentValue = goldPurchased * currentPrice;
    const investmentValueAtStartYear = goldPurchased * initialPrice;
    const profit = currentInvestmentValue - investmentValueAtStartYear;
    const annualizedReturn = profit / yearsPassed;

    return {
      profit,
      annualizedReturn,
    };
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    generateSecurityQuestion();
  }, []);

  const generateSecurityQuestion = () => {
    const firstNumber = Math.floor(Math.random() * 10);
    const secondNumber = Math.floor(Math.random() * 10);
    setSecurityQuestion(`Please solve: ${firstNumber} + ${secondNumber}`);
    setSecurityAnswer(firstNumber + secondNumber);
  };

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <div>
        <h2>Calculate Gold Returns</h2>
        <label>Investment Amount: </label>
        <input type="number" id="investmentAmount" />
        <br />
        <label>Initial Price: </label>
        <input type="number" id="initialPrice" />
        <br />
        <label>Investment Year: </label>
        <input type="number" id="investmentYear" />
        <br />
        <label>Current Year: </label>
        <input type="number" id="currentYear" />
        <br />
        <label>Current Price: </label>
        <input type="number" id="currentPrice" />
        <br />
        <button
          onClick={() => {
            const investmentAmount = parseFloat(document.getElementById("investmentAmount").value);
            const initialPrice = parseFloat(document.getElementById("initialPrice").value);
            const investmentYear = parseInt(document.getElementById("investmentYear").value);
            const currentYear = parseInt(document.getElementById("currentYear").value);
            const currentPrice = parseFloat(document.getElementById("currentPrice").value);

            const returns = calculateGoldReturns(investmentAmount, initialPrice, investmentYear, currentYear, currentPrice);
            alert(`Profit: ${returns.profit}, Annualized Return: ${returns.annualizedReturn}`);
          }}
        >
          Calculate Returns
        </button>
      </div>
      <style jsx>{`
        .container {
          text-align: center;
          background-color: brown;
        }
      `}</style>
    </main>
  );
}

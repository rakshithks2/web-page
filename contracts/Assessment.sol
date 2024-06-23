// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public vaultOwner;
    uint256 public vaultBalance;

    event Deposited(uint256 amount);
    event Withdrawn(uint256 amount);

    constructor(uint initialBalance) payable {
        vaultOwner = payable(msg.sender);
        vaultBalance = initialBalance;
    }

    function getBalance() public view returns(uint256){
        return vaultBalance; // Return the vaultBalance here
    }

    function deposit(uint256 amount) public payable {
        uint previousBalance = vaultBalance;

        // make sure this is the owner
        require(msg.sender == vaultOwner, "You are not the owner of this vault");

        // perform transaction
        vaultBalance += amount;

        // assert transaction completed successfully
        assert(vaultBalance == previousBalance + amount);

        // emit the event
        emit Deposited(amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 amount) public {
        require(msg.sender == vaultOwner, "You are not the owner of this vault");
        uint previousBalance = vaultBalance;
        if (vaultBalance < amount) {
            revert InsufficientBalance({
                balance: vaultBalance,
                withdrawAmount: amount
            });
        }

        // withdraw the given amount
        vaultBalance -= amount;

        // assert the balance is correct
        assert(vaultBalance == (previousBalance - amount));

        // emit the event
        emit Withdrawn(amount);
    }

    function calculateGoldReturns(uint256 investmentAmount, uint256 initialPrice, uint256 investmentYear, uint256 currentYear, uint256 currentPrice) public pure returns (uint256 profit, uint256 annualizedReturn) {
        uint256 yearsPassed = currentYear - investmentYear;
        uint256 goldPurchased = investmentAmount / initialPrice;
        uint256 currentInvestmentValue = goldPurchased * currentPrice;
        uint256 investmentValueAtStartYear = goldPurchased * initialPrice;
        profit = currentInvestmentValue - investmentValueAtStartYear;
        annualizedReturn = profit / yearsPassed;
    }

    function generateSecurityChallenge() public view returns (string memory) {
        uint256 firstNumber = uint256(blockhash(block.number - 1)) % 10;
        uint256 secondNumber = uint256(blockhash(block.number - 2)) % 10;
        return string(abi.encodePacked("Please solve: ", uintToString(firstNumber), " + ", uintToString(secondNumber)));
    }

    function uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

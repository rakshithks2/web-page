 // SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event EligibilityChecked(uint256 score, uint256 scholarshipAmount, string message);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    function checkEligibility(uint256 score) public  returns (uint256, string memory) {
        uint256 scholarshipAmount;
        string memory message;

        if (score > 400) {
            scholarshipAmount = 10000;
            message = "Fantastic! You're eligible for a $10,000 scholarship.";
        } else if (score > 350) {
            scholarshipAmount = 7000;
            message = "Great job! You're eligible for a $7,000 scholarship.";
        } else if (score > 300) {
            scholarshipAmount = 6000;
            message = "Well done! You're eligible for a $6,000 scholarship.";
        } else if (score > 250) {
            scholarshipAmount = 5000;
            message = "Good effort! You're eligible for a $5,000 scholarship.";
        } else {
            scholarshipAmount = 0;
            message = "Unfortunately, you're not eligible for a scholarship.";
        }

        emit EligibilityChecked(score, scholarshipAmount, message);

        return (scholarshipAmount, message);
    }

    function getScholarshipBrochure() public pure returns (string memory) {
        return "Scholarship Details:\n"
               "Score above 400: $10,000 Scholarship\n"
               "Score above 350: $7,000 Scholarship\n"
               "Score above 300: $6,000 Scholarship\n"
               "Score above 250: $5,000 Scholarship\n";
    }
}

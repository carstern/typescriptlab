"use strict";
// Connect to the form
const calculator = document.getElementById('calculator');
// Connect Inputfields
let loanAmount = document.getElementById('loanAmount');
let interestRate = document.getElementById('interestRate');
let payback = document.getElementById('payback');
const submitBtn = document.getElementById('submitBtn');
//Result container
const resultContainer = document.getElementById('resultContainer');
// Function for doing the calculation based on inputs
const loanCalculator = (p, r, n) => {
    const numerator = p * r * Math.pow((1 + r), n);
    const denominator = Math.pow((1 + r), n) - 1;
    const monthlyCost = numerator / denominator;
    return monthlyCost;
};
// Declaring the counts to add limitation since I want to enable comparing, to some extent.
let calculationCount = 0;
const maxCalculations = 5;
// Eventlistener to the submitbutton
calculator.addEventListener('submit', (e) => {
    e.preventDefault();
    if (calculationCount < maxCalculations) {
        // log the inputs to make sure they are received
        console.log(loanAmount.value, interestRate.value, payback.value);
        // Run the calculator function
        calculateOutput();
        // Increment calculationCount
        calculationCount++;
        // Check if the limit is reached
        if (calculationCount === maxCalculations) {
            // Replace the submit button with a "Reload" button
            const reloadButton = document.createElement('button');
            reloadButton.textContent = 'Reload';
            reloadButton.addEventListener('click', () => {
                location.reload();
            });
            submitBtn.replaceWith(reloadButton);
            // Show a message or take any other appropriate action
            resultContainer.insertAdjacentHTML('beforebegin', '<p class="limit-reached">Calculation limit reached. You cannot submit more calculations.<br>Click again to reload the page.</p>');
        }
    }
});
//Create a function that takes in the values and calculates
function calculateOutput() {
    let loanInput = parseFloat(loanAmount.value);
    let interestInput = parseFloat(interestRate.value);
    let paybackInput = parseFloat(payback.value);
    let loanAmountValue = parseInt(loanAmount.value); //ger värdet P
    let monthlyInterest = (interestInput / 100) / 12; //ger värdet R
    let numberOfMonths = paybackInput * 12; // ger värdet N
    let totalInterest = 0;
    let totalCost = 0;
    let monthlyCost = 0;
    //Validate incoming data, usin isNAN to lead the statement and return error if invalid
    if (isNaN(loanInput) || isNaN(interestInput) || isNaN(paybackInput)) {
        resultContainer.innerHTML = "The data is incomplete or invalid"; //Error message in case user is able to submit anything but numbers. 
        return;
    }
    //Making sure that there is input in every field (Not necessary as the statement above catches even empty fields as it requests numbers)
    if (!loanInput || !interestInput || !paybackInput) {
        resultContainer.innerHTML = "The data is incomplete"; //Error message in case user is missing fields. 
        return;
    }
    // Check that the interestrate and payback time are legit for mortgagetype loan
    if (interestInput > 10 || paybackInput >= 60) {
        resultContainer.innerHTML = "Interest rate is to high or payback time is too long";
    }
    else { // Here we begin with the option that calculates the payment plan.
        const todaysDate = new Date(); //
        monthlyCost = loanCalculator(loanAmountValue, monthlyInterest, numberOfMonths);
        console.log(monthlyCost);
        for (let i = 1; numberOfMonths > 0; i++) {
            const futureTime = new Date(todaysDate);
            futureTime.setMonth(todaysDate.getMonth() + i);
            // handle the interestpart
            let sumMonthlyInterest = loanAmountValue * monthlyInterest;
            loanAmountValue = loanAmountValue - (monthlyCost - sumMonthlyInterest);
            totalInterest += sumMonthlyInterest;
            numberOfMonths--; // Decrement month
        }
        // Calculate total and reviel results in container
        totalCost = totalInterest + loanInput;
        resultContainer.innerHTML += `<div class="result-div">
            <strong>Mortgage payment plan:</strong><br>
            Full Loan: ${loanInput.toLocaleString('en-US', { minimumFractionDigits: 2 })} SEK <br>
            Payment each month: ${monthlyCost.toLocaleString('en-US', { maximumFractionDigits: 2 })} SEK<br>
            Total Interest: ${totalInterest.toLocaleString('en-US', { maximumFractionDigits: 2 })} SEK<br> 
            Total Payment: ${totalCost.toLocaleString('en-US', { maximumFractionDigits: 2 })} SEK</div>`;
        // Keeping the value in the inputfields as you might want to tweek the numbers just a bit instead of re-enter the inputs
        loanAmount.value = loanAmount.value;
        interestRate.value = interestRate.value;
        payback.value = payback.value;
        // The part above lets you make several calculations, adding a div each time button is clicked.
        // This is intentional in case you want to compare with different numbers.     
    }
}
;

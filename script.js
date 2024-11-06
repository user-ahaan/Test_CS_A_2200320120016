const correctUsername = "admin";
const correctPassword = "admin";

function validateLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    errorMessage.textContent = "";

    if (username === correctUsername && password === correctPassword) {
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("currencyConverterSection").style.display = "block";
        loadCurrencies();
    } else {
        errorMessage.textContent = "Invalid username or password. Please try again.";
    }
}

async function loadCurrencies() {
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
        if (!response.ok) {
            throw new Error("Failed to fetch currency data.");
        }

        const data = await response.json();
        const currencies = Object.keys(data.rates);

        const fromCurrency = document.getElementById("fromCurrency");
        const toCurrency = document.getElementById("toCurrency");

        currencies.forEach(currency => {
            const optionFrom = document.createElement("option");
            const optionTo = document.createElement("option");
            optionFrom.value = currency;
            optionFrom.textContent = currency;
            optionTo.value = currency;
            optionTo.textContent = currency;
            fromCurrency.appendChild(optionFrom);
            toCurrency.appendChild(optionTo);
        });
    } catch (error) {
        document.getElementById("errorMessage").textContent = "An error occurred while loading currencies: " + error.message;
    }
}

async function convertCurrency() {
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = document.getElementById("fromCurrency").value;
    const toCurrency = document.getElementById("toCurrency").value;
    const conversionResult = document.getElementById("conversionResult");
    const errorMessage = document.getElementById("errorMessage");

    conversionResult.textContent = '';
    errorMessage.textContent = '';

    if (isNaN(amount) || amount <= 0) {
        errorMessage.textContent = "Please enter a valid amount.";
        return;
    }

    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        
        if (!response.ok) {
            throw new Error("Failed to fetch currency data.");
        }

        const data = await response.json();
        const rate = data.rates[toCurrency];

        if (rate) {
            const convertedAmount = (amount * rate).toFixed(2);
            conversionResult.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
        } else {
            errorMessage.textContent = "Conversion rate not available.";
        }
    } catch (error) {
        errorMessage.textContent = "An error occurred: " + error.message;
    }
}

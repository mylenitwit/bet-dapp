const placeBetButton = document.getElementById("placeBetButton");
const connectButton = document.getElementById("connectButton");
const accountDisplay = document.getElementById("account");
const recentActivity = document.getElementById("recentActivity");
const recipientAddress = "0x0a8297764Cc0ad4d3ED75358431E01a63Aa1Dcf8";

let selectedAmount = null;
let userAccount = null;

// Connect Metamask
connectButton.addEventListener("click", async () => {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            userAccount = accounts[0];
            accountDisplay.innerText = `Connected: ${userAccount}`;
        } catch (error) {
            console.error(error);
            alert("Failed to connect to Metamask!");
        }
    } else {
        alert("Please install Metamask!");
    }
});

// Select Bet Amount
document.querySelectorAll(".bet").forEach(button => {
    button.addEventListener("click", () => {
        selectedAmount = button.getAttribute("data-value");
        alert(`Selected Bet Amount: ${selectedAmount} ETH`);
        placeBetButton.disabled = false;
    });
});

// Place Bet
placeBetButton.addEventListener("click", async () => {
    if (!selectedAmount || !userAccount) {
        alert("Please select an amount and connect your wallet!");
        return;
    }
    try {
        const tx = await ethereum.request({
            method: "eth_sendTransaction",
            params: [
                {
                    from: userAccount,
                    to: recipientAddress,
                    value: ethers.utils.parseEther(selectedAmount).toHexString(),
                },
            ],
        });
        alert(`Transaction sent! Tx Hash: ${tx}`);
        recentActivity.innerText += `Sent ${selectedAmount} ETH to ${recipientAddress}\n`;
    } catch (error) {
        console.error(error);
        alert("Transaction failed!");
    }
});

// Show Recent Activity
document.getElementById("recentActivityButton").addEventListener("click", () => {
    alert(recentActivity.innerText || "No recent activity.");
});

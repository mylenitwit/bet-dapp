const placeBetButton = document.getElementById("placeBetButton");
const connectButton = document.getElementById("connectButton");
const accountDisplay = document.getElementById("account");
const recentActivity = document.getElementById("recentActivity");
const recipientAddress = "0x0a8297764Cc0ad4d3ED75358431E01a63Aa1Dcf8";

let selectedAmount = null;
let userAccount = null;
let selectedButton = null; // Seçili buton için değişken

// Connect Metamask and switch to Abstract Chain
connectButton.addEventListener("click", async () => {
    if (window.ethereum) {
        try {
            // Request accounts from Metamask
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            userAccount = accounts[0];
            accountDisplay.innerText = `Connected: ${userAccount}`;

            // Switch to Abstract Chain if not already on it
            const chainId = "11124";  // Abstract Chain Testnet Chain ID in hexadecimal
            const currentChainId = await ethereum.request({ method: "eth_chainId" });

            if (currentChainId !== chainId) {
                await ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            chainId: chainId,
                            chainName: "Abstract Testnet",
                            rpcUrls: ["https://api.testnet.abs.xyz"],
                            nativeCurrency: {
                                name: "ETH",
                                symbol: "ETH",
                                decimals: 18,
                            },
                            blockExplorerUrls: ["https://explorer.testnet.abs.xyz"],
                        },
                    ],
                });
                alert("Switched to Abstract Testnet.");
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        alert("Please install Metamask!");
    }
});

// Select Bet Amount
document.querySelectorAll(".bet").forEach(button => {
    button.addEventListener("click", () => {
        // Eğer daha önce bir buton seçildiyse, eski stilini kaldır
        if (selectedButton) {
            selectedButton.classList.remove("selected");
        }

        // Yeni seçilen butona stil ekle
        selectedButton = button;
        selectedButton.classList.add("selected");

        // Seçilen miktarı al ve "Place Bet" butonunu aktif et
        selectedAmount = button.getAttribute("data-value");
        
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
        // Send the transaction to the recipient address using Abstract Chain
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

const placeBetButton = document.getElementById("placeBetButton");
const connectButton = document.getElementById("connectButton");
const accountDisplay = document.getElementById("account");
const recentActivity = document.getElementById("recentActivity");
import { Provider, Wallet } from "zksync-ethers";
import { ethers } from "ethers";

const provider = new Provider("https://api.testnet.abs.xyz");
const recipientAddress = "0x0a8297764Cc0ad4d3ED75358431E01a63Aa1Dcf8";
let userWallet;

// Metamask bağlantısı
async function connectMetamask() {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    await web3Provider.send("eth_requestAccounts", []);
    const signer = web3Provider.getSigner();
    userWallet = new Wallet(signer, provider);
    console.log("Metamask bağlandı:", await signer.getAddress());
}

// İşlem gönderimi
async function sendTransaction(amount) {
    try {
        const value = ethers.utils.parseEther(amount.toString());
        const tx = await userWallet.sendTransaction({
            to: recipientAddress,
            value,
        });
        console.log(`İşlem gönderildi! Tx Hash: ${tx.hash}`);
    } catch (error) {
        console.error("İşlem başarısız:", error);
    }
}

// Örnek arayüz işlevleri
document.getElementById("connectButton").addEventListener("click", connectMetamask);
document.getElementById("placeBetButton").addEventListener("click", () => {
    const amount = document.querySelector('input[name="betAmount"]:checked').value;
    sendTransaction(amount);
});

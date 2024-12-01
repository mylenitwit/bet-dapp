// Alıcı adresi ve ağ RPC URL'si
const recipientAddress = "0x0a8297764Cc0ad4d3ED75358431E01a63Aa1Dcf8"; // ETH'in gönderileceği adres
const rpcUrl = "https://api.testnet.abs.xyz"; // Abstract ağı testnet RPC adresi
let userWallet; 

document.getElementById("walletConnectButton").addEventListener("click", connectWalletConnect);



async function connectWalletConnect() {
    try {
        // WalletConnect Provider oluşturma
        const provider = new WalletConnectProvider.default({
            rpc: {
                11124: "https://api.testnet.abs.xyz", // Abstract ağı RPC URL'si
            },
            chainId: 11124, // Abstract ağı için doğru chainId
        });

        // Kullanıcı bağlantısı
        await provider.enable();

        // Web3 sağlayıcısı
        const web3Provider = new ethers.providers.Web3Provider(provider);

        // Kullanıcı adresini alın
        const signer = web3Provider.getSigner();
        const userAddress = await signer.getAddress();

        // Kullanıcı adresini göster
        document.getElementById("account").textContent = `Connected: ${userAddress}`;
        console.log("WalletConnect bağlantısı başarılı:", userAddress);

        // WalletConnect'in olaylarını dinleyin
        provider.on("disconnect", () => {
            console.log("WalletConnect bağlantısı kesildi");
            document.getElementById("account").textContent = "Disconnected";
        });

    } catch (error) {
        console.error("WalletConnect bağlantı hatası:", error);
        alert("WalletConnect bağlantı hatası: " + error.message);
    }
}


// İşlem gönder
async function sendTransaction(amount) {
    if (!userWallet) {
        alert("Lütfen önce Metamask'a bağlanın!");
        return;
    }

    try {
        const value = ethers.utils.parseEther(amount.toString()); // ETH değerini dönüştür
        const tx = await userWallet.sendTransaction({
            to: recipientAddress,
            value: value,
        });

        console.log("İşlem gönderildi! Tx Hash:", tx.hash);
        alert(`İşlem başarılı! Tx Hash: ${tx.hash}`);

        // Son işlemleri güncelle
        const recentActivity = document.getElementById("recentActivity");
        const activityItem = document.createElement("div");
        activityItem.textContent = `Sent ${amount} ETH to ${recipientAddress} (Tx: ${tx.hash})`;
        recentActivity.appendChild(activityItem);
    } catch (error) {
        console.error("İşlem gönderim hatası:", error);
        alert("İşlem başarısız oldu!");
    }
}

// Miktar seçimi
let selectedAmount = null;
document.querySelectorAll(".bet").forEach((button) => {
    button.addEventListener("click", () => {
        selectedAmount = button.dataset.value; // Miktarı seç
        document.querySelectorAll(".bet").forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");
    });
});

// Place Bet butonuna tıklama
document.getElementById("placeBetButton").addEventListener("click", () => {
    if (!selectedAmount) {
        alert("Lütfen bir miktar seçin!");
        return;
    }

    sendTransaction(selectedAmount);
});

// Metamask bağlanma butonu
document.getElementById("connectButton").addEventListener("click", connectMetamask);

// Recent Activity butonu (Şu anda işlevsiz, sadece sayfayı güncel tutuyor)
document.getElementById("recentActivityButton").addEventListener("click", () => {
    const recentActivity = document.getElementById("recentActivity");
    if (recentActivity.style.display === "none") {
        recentActivity.style.display = "block";
    } else {
        recentActivity.style.display = "none";
    }
});

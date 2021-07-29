function getAddressBalance(address) {
    const wallet = JSON.parse(localStorage.getItem(address));
    const walletBalance = wallet.balance;
    return walletBalance;
}

export { getAddressBalance };
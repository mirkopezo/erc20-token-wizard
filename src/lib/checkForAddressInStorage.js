function checkForAddressInStorage(address) {
    const wallet = JSON.parse(localStorage.getItem(address));
    if(wallet === null) {
        localStorage.setItem(address, JSON.stringify({balance: '0', transactions: []}));
    }
}

export { checkForAddressInStorage };
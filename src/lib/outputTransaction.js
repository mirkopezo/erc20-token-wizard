function outputTransaction(address, toAddress, transactionValue) {
    const wallet = JSON.parse(localStorage.getItem(address));
    const balance = wallet.balance;
    const newBalance = (parseFloat(balance) - parseFloat(transactionValue)).toFixed(8);
    wallet.balance = newBalance;
    const transactionsLength = wallet.transactions.length;
    wallet.transactions.push({id: transactionsLength, type: 'output', from: address, to: toAddress, value: transactionValue});
    localStorage.setItem(address, JSON.stringify(wallet));
}

export { outputTransaction };
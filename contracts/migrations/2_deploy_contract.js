const InternshipERC20Token = artifacts.require('InternshipERC20Token');

module.exports = async function (deployer) {
    web3.eth.defaultAccount = web3.eth.accounts[0];
    await deployer.deploy(InternshipERC20Token);
};
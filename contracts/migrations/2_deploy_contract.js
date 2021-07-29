const InternshipERC20Token = artifacts.require('InternshipERC20Token');

module.exports = async function (deployer) {
    await deployer.deploy(InternshipERC20Token);
};
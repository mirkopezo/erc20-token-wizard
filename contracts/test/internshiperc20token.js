const { expectRevert } = require('@openzeppelin/test-helpers');
const InternshipERC20Token = artifacts.require('InternshipERC20Token');
const ERC20Token = artifacts.require('ERC20Token');

contract('InternshipERC20Token', (accounts) => {
    let contract, contractERC20;
    beforeEach(async() => {
        contract = await InternshipERC20Token.new();
        await contract.newERC20Token('Silver Token', 'SLV', 50000, {from: accounts[0]});
        const tokenAddress = await contract.lastContractAddress();
        contractERC20 = await ERC20Token.at(tokenAddress);
    });
    it('It should have correct decimals (main token)', async() => {
        const decimals = (await contract.decimals()).toNumber();
        assert(decimals === 8);
    });
    it('It should mint to transaction sender (main token)', async() => {
        const balanceBefore = await contract.balanceOf(accounts[0]);
        await contract.mint(100, {from: accounts[0]});
        const balanceAfter = await contract.balanceOf(accounts[0]);
        const balanceDifference = balanceAfter.sub(balanceBefore).toNumber();
        assert(balanceDifference === 100);
    });
    it('It should create new token with correct name, symbol, decimals and supply is minted to creator of token', async() => {
        const tokenName = await contractERC20.name();
        const tokenSymbol = await contractERC20.symbol();
        const tokenDecimals = (await contractERC20.decimals()).toNumber();
        const tokenSupply = (await contractERC20.totalSupply()).toNumber();
        const tokenBalance = (await contractERC20.balanceOf(accounts[0])).toNumber();
        assert(tokenName === 'Silver Token');
        assert(tokenSymbol === 'SLV');
        assert(tokenDecimals === 8);
        assert(tokenSupply === 50000);
        assert(tokenBalance === 50000);
    });
    it('It should allow minting new tokens to creator of token', async() => {
        const balanceBefore = await contractERC20.balanceOf(accounts[0]);
        await contractERC20.mint(1000, {from: accounts[0]});
        const balanceAfter = await contractERC20.balanceOf(accounts[0]);
        const balanceDifference = balanceAfter.sub(balanceBefore).toNumber();
        assert(balanceDifference === 1000);
    });
    it('It shouldnt allow minting new tokens to address that isnt creator of token', async() => {
        await expectRevert(contractERC20.mint(1000, {from: accounts[2]}), 'Mint is allowed only to the creator of token');
    });
});
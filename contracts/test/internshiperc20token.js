const { expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const InternshipERC20Token = artifacts.require('InternshipERC20Token');

contract('InternshipERC20Token', (accounts) => {
    let contract;
    beforeEach(async() => {
        contract = await InternshipERC20Token.new();
    });
    it('It should have correct decimals', async() => {
        const decimals = await contract.decimals();
        assert(decimals.toNumber() === 8);
    });
    it('It should mint to transaction sender', async() => {
        const balanceBefore = await contract.balanceOf(accounts[0]);
        await contract.mint(accounts[0], 100, {from: accounts[0]});
        const balanceAfter = await contract.balanceOf(accounts[0]);
        const diff = balanceAfter.sub(balanceBefore).toNumber();
        assert(diff === 100);
    });
    it('It shouldnt mint to address that is not transaction sender', async() => {
        await expectRevert(contract.mint(accounts[0], 100, {from: accounts[1]}), 'You can only mint tokens to yourself');
    });
});
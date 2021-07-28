pragma solidity ^0.8.5;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract InternshipERC20Token is ERC20 {
    constructor() ERC20('Crypto Internship Token', 'CIT') {
    }

    function decimals() public view virtual override returns (uint8) {
        return 8;
    }

    function mint(address to, uint amount) external {
        require(msg.sender == to, 'You can only mint tokens to yourself');
        _mint(to, amount);
    }
}

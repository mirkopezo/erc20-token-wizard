pragma solidity ^0.8.5;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract InternshipERC20Token is ERC20 {
    event newERC20Contract(address contractAddress);
    
    constructor() ERC20('Crypto Internship Token', 'CIT') {
    }

    function decimals() public view virtual override returns (uint8) {
        return 8;
    }
    
    function mint(uint amount) external {
        _mint(msg.sender, amount);
    }
	
	function newERC20Token(string memory name, string memory symbol, uint initialSupply) public returns(address newContract) {
		ERC20Token c = (new ERC20Token)(name, symbol, initialSupply, msg.sender);
		emit newERC20Contract(address(c));
		return address(c);
	}
}

contract ERC20Token is ERC20 {
    address public creator;

    constructor(string memory name, string memory symbol, uint initialSupply, address _creator) ERC20(name, symbol) {
        creator = _creator;
        _mint(creator, initialSupply);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return 8;
    }
    
    function mint(uint amount) external {
        _mint(msg.sender, amount);
    }
}

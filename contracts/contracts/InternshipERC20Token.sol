pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract InternshipERC20Token is ERC20 {
    address public lastContractAddress;

    constructor() ERC20("Crypto Creator Token", "CCT") {}

    function decimals() public view virtual override returns (uint8) {
        return 8;
    }

    function mint(uint256 amount) external {
        _mint(msg.sender, amount);
    }

    function newERC20Token(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) external {
        ERC20Token token = new ERC20Token(
            name,
            symbol,
            initialSupply,
            msg.sender
        );
        lastContractAddress = address(token);
    }
}

contract ERC20Token is ERC20 {
    address public creator;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address _creator
    ) ERC20(name, symbol) {
        creator = _creator;
        _mint(creator, initialSupply);
    }

    function decimals() public view virtual override returns (uint8) {
        return 8;
    }

    function mint(uint256 amount) external {
        require(
            msg.sender == creator,
            "Mint is allowed only to the creator of token"
        );
        _mint(msg.sender, amount);
    }
}

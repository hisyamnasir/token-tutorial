pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(uint256 initialSupply) public ERC20("DApp Token", "DAPP") {
        _setupDecimals(0);
        _mint(msg.sender, initialSupply);
    }
}

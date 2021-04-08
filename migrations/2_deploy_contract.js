const Token = artifacts.require('Token');
const MyTokenSale = artifacts.require('MyTokenSale');
const KycContract = artifacts.require('KycContract');

module.exports = async function (deployer) {
  let address = await web3.eth.getAccounts();
  await deployer.deploy(Token, 1000000000);
  await deployer.deploy(KycContract);
  await deployer.deploy(
    MyTokenSale,
    1,
    address[0],
    Token.address,
    KycContract.address
  );
  let tokenInstance = await Token.deployed();
  await tokenInstance.transfer(MyTokenSale.address, 1000000000);
};

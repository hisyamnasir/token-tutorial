const Token = artifacts.require('Token');

require('chai').use(require('chai-as-promised')).should();

contract('Token', (accounts) => {
  const [initialHolder, recipient, anotherAccount] = accounts;

  const name = 'DApp Token';
  const symbol = 'DAPP';
  const decimal = '18';
  const totalSupply = 1000000;
  let token;

  beforeEach(async () => {
    token = await Token.new(totalSupply);
  });

  describe('deployment', () => {
    it('tracks the name', async () => {
      const result = await token.name();
      result.should.equal(name);
    });

    it('tracks the symbol', async () => {
      const result = await token.symbol();
      result.should.equal(symbol);
    });
  });

  describe('sending token', () => {
    let result;
    let amount;

    it('transfers token', async () => {
      let balanceOf;
      // check initial holder balance
      balanceOf = await token.balanceOf(initialHolder);
      balanceOf.toString().should.equal(totalSupply.toString());

      // transfer token from initialHolder to recipient
      result = await token.transfer(recipient, 1, { from: initialHolder });
      // check recipient balance
      balanceOf = await token.balanceOf(recipient);
      balanceOf.toString().should.equal('1');
    });
  });
});

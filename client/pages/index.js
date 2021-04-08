import Head from 'next/head';
import Web3 from 'web3';
import styles from '../styles/Home.module.css';

import Token from '../contract/Token.json';
import MyTokenSale from '../contract/MyTokenSale.json';
import KycContract from '../contract/KycContract.json';
import { useEffect, useState } from 'react';

export default function Home() {
  const [token, setToken] = useState(null);
  const [myTokenSale, setMyTokenSale] = useState(null);
  const [kycContract, setKycContract] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [availableToken, setAvailableToken] = useState(0);

  const [address, setAddress] = useState('');

  useEffect(() => {
    setIsLoaded(!!token && !!myTokenSale && !!kycContract);
  }, [token, myTokenSale, kycContract]);

  useEffect(() => {
    loadBlockchain();
  }, []);

  const loadBlockchain = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      // request to connect wallet
      const [currentAccount] = await web3.eth.requestAccounts();
      setCurrentAccount(currentAccount);
      const networkId = await web3.eth.net.getId();
      const token = new web3.eth.Contract(
        Token.abi,
        Token.networks[networkId].address
      );
      setToken(token);
      const myTokenSale = new web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[networkId].address
      );
      setMyTokenSale(myTokenSale);
      const kycContract = new web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[networkId].address
      );
      setKycContract(kycContract);

      const availableToken = await token.methods
        .balanceOf(currentAccount)
        .call({ from: currentAccount });
      setAvailableToken(Number(availableToken));

      token.events
        .Transfer({ to: currentAccount })
        .on('data', (event) =>
          setAvailableToken((prev) => prev + Number(event.returnValues.value))
        );
    } catch (error) {
      console.log(error);
    }
  };

  const addKyc = async (e) => {
    e.preventDefault();

    await kycContract.methods
      .setKycComplated(address)
      .send({ from: currentAccount });

    alert('Account ' + kycAddress + ' is now whitelisted');
  };

  const buyToken = async (e) => {
    e.preventDefault();

    await myTokenSale.methods
      .buyTokens(currentAccount)
      .send({ from: currentAccount, value: 1 });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Token Sale</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoaded ? (
        <div>
          <h3>Token</h3>
          <form onSubmit={addKyc}>
            <label>Address to allow buy token </label>
            <input
              type="text"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            />
            <button type="submit">Add</button>
          </form>
          <h3>Buy token for this address {currentAccount}</h3>
          <p>Avaialbe Token: {availableToken}</p>
          <form onSubmit={buyToken}>
            <button type="submit">Buy Token</button>
          </form>
        </div>
      ) : (
        <div>Not loaded</div>
      )}
    </div>
  );
}

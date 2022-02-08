import React, {useEffect, useState} from 'react'
import {ethers} from 'ethers'

import { contractABI, contractAddress } from '../utils/constants'

export const TransactionContext = React.createContext();

const {ethereum} = window;

const getEthereumContract = () =>{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log({
        provider,
        signer,
        transactionContract
    })
}

export const TransactionProvider = ({children}) =>{

  const[connectedAccount, setConnectedAccount] = useState('');
  
  //everytime the app reloads, useeffect called to check if wallet connected, if yes, it consoles the connected account
  const checkIfWalletIsConnected = async ()=>{
      if(!ethereum) return alert("Please install Metamask");

      const accounts = await ethereum.request({method: 'eth_accounts'});
      console.log(accounts);
  }

  //when we click on the button to connect wallet, this function is called which asks to connect and then sets the current account
  const connectWallet = async ()=>{
     try {
        if(!ethereum) return alert("Please install Metamask"); //if not connected
        const accounts = await ethereum.request({method: 'eth_requestAccounts'});
        setCurrentAccount(accounts[0]); //sets the current account
     } catch (error) {
         console.log(error);

         throw new Error("No ethereum object");
     }
  }

  useEffect(()=>{ 
      checkIfWalletIsConnected(); //this function is called the first time the app loads
  }, [])

  return( //connectWallet function will be passed to all components
      <TransactionContext.Provider value={{connectWallet}}> 
          {children}
      </TransactionContext.Provider>
  )
}
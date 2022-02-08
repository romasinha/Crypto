import React, {useEffect, useState} from 'react'
import {ethers} from 'ethers'

import { contractABI, contractAddress } from '../utils/constants'

export const TransactionContext = React.createContext();

const {ethereum} = window;

const getEthereumContract = () =>{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
}

export const TransactionProvider = ({children}) =>{

  const[currentAccount, setCurrentAccount] = useState('');
  const[formData, setFormData] = useState({addressTo: '', amount: '', keyword: '', message: ''});
  const[isLoading, setIsLoading] = useState(false);
  const[transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));

  const handleChange = (e, name)=>{
       setFormData((prevState)=>({ //whenever updating a new state using an old state, we write a callback func
          ...prevState, [name]: e.target.value
       }))
  }
  
  //everytime the app reloads, useeffect called to check if wallet connected, if yes, it consoles the connected account
  const checkIfWalletIsConnected = async ()=>{
      try {
        if(!ethereum) return alert("Please install Metamask");

        const accounts = await ethereum.request({method: 'eth_accounts'});
  
        if(accounts.length){
            setCurrentAccount(accounts[0]);
        } else{
            console.log("No accounts found")
        }
          
      } catch (error) {
        console.log(error);
        throw new Error("No ethereum object");
      }

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

  const sendTransaction = async() =>{
      try {
        if(!ethereum) return alert("Please install Metamask"); //if not connected
        //get all input data from the form
        const{ addressTo, amount, keyword, message} = formData; //destructuring every field data from formData
        const transactionContract = getEthereumContract();
        
        const parsedAmount = ethers.utils.parseEther(amount);
        await ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
                from: currentAccount,
                to: addressTo,
                gas: '0x5208', //21000
                value: parsedAmount._hex, //since the value should always be in hex so we parse it to ethers which is then converted to hex value

            }]
        })

        const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message,keyword);
        setIsLoading(true);
        console.log(`Loading -${transactionHash.hash}`);
        await transactionHash.wait();
        
        setIsLoading(false);
        console.log(`Success -${transactionHash.hash}`);


        const transactionCount = await transactionContract.getTransactionCount();
        setTransactionCount(transactionCount.toNumber());


          
      } catch (error) {
          console.log(error);
          throw new Error("No ethereum object");
      }
  } 

  useEffect(()=>{ 
      checkIfWalletIsConnected(); //this function is called the first time the app loads
  }, [])

  return( //connectWallet function will be passed to all components
      <TransactionContext.Provider value={{connectWallet, currentAccount,formData,setFormData, handleChange, sendTransaction}}> 
          {children}
      </TransactionContext.Provider>
  )
}
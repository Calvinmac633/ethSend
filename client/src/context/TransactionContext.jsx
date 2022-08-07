import React, { useEffect, useState } from 'react';
import {ethers} from 'ethers';
import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;

//https://ethereum.stackexchange.com/questions/82746/how-to-get-erc20-token-balance-using-web3
//use web3 js after listening to the other video regarding smart contracts

const provider = new ethers.providers.Web3Provider(ethereum);


const getEthereumContract = () => {
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer)

    return transactionContract;
}

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [currentBalance, setCurrentBalance] = useState('');
    const [formData, setFormData] = useState({ addressTo: '', amount: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions, setTransactions] = useState([])
    
    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
    }

    const getAllTransactions = async () => {
        try {
            if(!ethereum) return alert("Please install metamask!");
            const transactionContract = getEthereumContract();
            const availableTransactions = await transactionContract.getAllTransactions();
            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
              }));

            setTransactions(structuredTransactions);
        } catch (error) {
            console.log('error: ', error)
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert("Please install metamask!");
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            const ethBalance = await ethereum.request({ method: 'eth_getBalance', params: [accounts[0], "latest"]})
            const ethWalletBalance = parseInt(ethBalance) / (10 ** 18);
            if(accounts.length) {
                setCurrentAccount(accounts[0]);

                getAllTransactions();
            } else {
                console.log("no accounts found!")
            }
            if(ethWalletBalance) {
                setCurrentBalance(ethWalletBalance)
            } else {
                console.log('no balance found!')
            }
            console.log("accounts: ", accounts)
        } catch (error) {
            console.log('error: ', error)
            throw new Error("No ethereum object!")
        }
    }

    const checkIfTransactionsExist = async () => {
        try {
            const transactionContract = getEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount();

            window.localStorage.setItem("transactionCount", transactionCount)
        } catch (error) {
            console.log('error: ', error)
            throw new Error("No ethereum object!")
        }
    }

    const connectWallet = async () => {
        
        try {
            if(!ethereum) return alert("Please install metamask!");
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);
            location.reload();
        } catch (error) {
            console.log('error: ', error)
            alert("Please install metamask!");
            throw new Error("No ethereum object!")
        }

    }

    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please install metamask!");

        
            const { addressTo, amount, message } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);
            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', //21000 gwei
                    value: parsedAmount._hex,
                }]
            });

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message);

            setIsLoading(true);

            console.log(`loading - ${transactionHash.hash}`);
            await provider.waitForTransaction(transactionHash.hash)

            setIsLoading(false);
            console.log(`success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionCount();

            setTransactionCount(transactionCount.toNumber());
            window.location.reload();

        } catch (error) {
            console.log('error: ', error)

            throw new Error('no ethereum object!')
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, currentBalance, formData, setFormData, handleChange, sendTransaction, transactions, isLoading }}>
            {children}
        </TransactionContext.Provider>
    )
}
import { keccak256 } from 'ethers/lib/utils';
import React, {useContext} from 'react';
import { TransactionContext } from '../context/TransactionContext';
import useWindowDimensions from '../hooks/window';
import { shortenAddress } from '../utils/shortenAddress';

const Transaction = ({ addressTo, addressFrom, timestamp, message, amount, url, currentAccount }) => {
    const { height, width } = useWindowDimensions();
    const timeArray = timestamp.split(' ')
    const year = (new Date(timestamp)).getFullYear()
    const shortDate = `${(new Date(timestamp)).getMonth()}/${(new Date(timestamp)).getDay()}/${year}`
    if ((addressFrom.toLowerCase() === currentAccount.toLowerCase() || addressTo.toLowerCase() === currentAccount.toLowerCase())) {
        return (
            <tr className='border border-[rgb(200,200,200,.5)]'>
             
                {(width < 960) ? (
                    <td className="max-w-[400px] text-white text-base pr-2 pl-2 ">
                        {shortDate}
                    </td>
                ) : (
                    <td className="max-w-[400px] text-white text-base pr-2 pl-2 ">
                        {timeArray[0].slice(0, -1)} {timeArray[1].slice(0, -3)} {timeArray[2]}
                    </td>
                )}
                {(width < 960) ? (
                      <td className="max-w-[400px] text-white text-base pr-2 pl-2">
                        {addressTo[0]}{addressTo[1]}{addressTo[2]}{addressTo[3]}
                    </td>
                ) : (
                    <td className="max-w-[400px] text-white text-base pr-2 pl-2">
                        <td className="max-w-[400px] text-white text-base pr-2 pl-2">
                            {shortenAddress(addressTo)}
                        </td>
                    </td>
                )}
                
                {(width < 960) ? (
                      <td className="max-w-[400px] text-white text-base pr-2 pl-2">
                        {addressFrom[0]}{addressFrom[1]}{addressFrom[2]}{addressFrom[3]}
                    </td>
                ) : (
                    <td className="max-w-[400px] text-white text-base pr-2 pl-2">
                        <td className="max-w-[400px] text-white text-base pr-2 pl-2">
                            {shortenAddress(addressFrom)}
                        </td>
                    </td>
                )}
                
                <td className="max-w-[400px] text-white text-base pr-2 pl-2">
                    {amount}
                </td>
    
                {(width < 960) ? (
                      <td className="max-w-[400px] text-white text-base pr-2 pl-2">
                        {message[0]}{message[1]}{message[2]}...
                    </td>
                ) : (
                    <td className="max-w-[400px] text-white text-base pr-2 pl-2">
                        {message}
                    </td>
                )}
            </tr>
        )
    }
}

const Transactions = () => {
    const { currentAccount, transactions } = useContext(TransactionContext);
    const { height, width } = useWindowDimensions();
    return (
        
        <div className='flex w-full justify-center items-center 2xl:px-20'>
            <div className='flex flex-col md:p-12 py-12 px-4'>
                {currentAccount ? (
                    <h3 className='text-white text-3xl text-center my-2'>Latest Transactions</h3>
                ) : (
                    <h3 className='text-white text-3xl text-center my-2'>Connect your account to see the latest transactions</h3>
                )}

                <div className="overflow-hidden">
                <table className="min-w-full text-center overflow-hidden">
                            <thead className="border-b overflow-hidden txn-header">
                                <tr>
                                <th scope="col" className="text-sm font-medium text-white md:px-6 md:py-4 sm:px-4 sm:py-2">Date</th>
                                <th scope="col" className="text-sm font-medium text-white md:px-6 md:py-4 sm:px-4 sm:py-2">From</th>
                                <th scope="col" className="text-sm font-medium text-white md:px-6 md:py-4 sm:px-4 sm:py-2">To</th>
                                <th scope="col" className="text-sm font-medium text-white md:px-6 md:py-4 sm:px-4 sm:py-2">Amount (ETH)</th>
                                {(width < 960) ? (
                                    <th scope="col" className="text-sm font-medium text-white md:px-6 md:py-4 sm:px-4 sm:py-2">msg</th>
                                ) : (
                                    <th scope="col" className="text-sm font-medium text-white md:px-6 md:py-4 sm:px-4 sm:py-2">Message</th>
                                )}
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.reverse().map((transaction, i) => (
                                    <Transaction key={i} {...transaction} currentAccount={currentAccount}/>
                                ))}
                            </tbody>
                        </table> 
                </div>
            </div>
        </div>
    )
}

export default Transactions;
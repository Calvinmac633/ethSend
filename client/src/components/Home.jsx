import React, { useContext } from 'react';
import { AiFillPlayCircle } from "react-icons/ai";
import { SiE, SiEthereum } from 'react-icons/si';
import { BsInfoCircle } from 'react-icons/bs';
import { Loader } from '.';
import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from '../utils/shortenAddress';
// import { TransactionsGrid } from './'
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { Transactions } from "."

const Input = ({ placeholder, name, type, value, handleChange }) => (
    <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    >
    </input>
)

const Home = () => {
    const { connectWallet, currentAccount, currentBalance, formData, setFormData, handleChange, sendTransaction, isLoading } = useContext(TransactionContext);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handlePopoverClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl)

    const handleSubmit = (e) => {
        const { addressTo, amount, message } = formData;

        e.preventDefault();

        if(!addressTo || !amount || !message) return;

        sendTransaction();
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className="flex w-full justify-center items-center">
            <div className="flex mf:flex-row flex-col items-start justify-between md:p-10 py-12 px-4">
                <img src="../../images/ethereum-logo.png" className='w-36 h-36 self-center' alt="ethereum-logo" />
                <div className="flex flex-1 justify-start flex-col mf:mr-10">
                    <h1 className="text-3xl text-white text-gradient py-1">
                        Send ETH to anyone<br/>in the world, instantly.
                    </h1>
                    <h3 className='text-[rgb(200,200,200,.75)]'>Include a personal message with <br/>your transaction below.</h3>
                    <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                    </p>
                    {/* Follow when ready to implement rainbow/other wallets to connect */}
                    {/* https://www.rainbowkit.com/docs/introduction */}
                    {!currentAccount && (
                        <button
                        type="button"
                        onClick={connectWallet}
                        className="flex flex-row justify-center items-center my-5 bg-[#3f8deb] p-3 rounded-full cursor-pointer hover:bg-[#3071bf]"
                        >
                            <p className="text-white text-base font-semibold">Connect Wallet</p>
                        </button>
                    )}
                </div>

                <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                    <div className="p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism">
                        <div className="flex justify-between flex-col w-full h-full">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-full border-2 border-whiteflex justify-center items-center">
                                    <SiEthereum className="m-2" fontSize={21} color="#fff"/>
                                </div>
                                {/* https://mui.com/material-ui/react-popover/ */}
                                <div>
                                    <Typography
                                        aria-owns={open ? 'mouse-over-popover' : undefined}
                                        aria-haspopup="true"
                                        onMouseEnter={handlePopoverOpen}
                                        onMouseLeave={handlePopoverClose}
                                    >
                                          <BsInfoCircle fontSize={17} color="#fff"/>
                                    </Typography>
                                    <Popover
                                        id="mouse-over-popover"
                                        sx={{
                                        pointerEvents: 'none',
                                        }}
                                        open={open}
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                        }}
                                        onClose={handlePopoverClose}
                                        disableRestoreFocus
                                    >
                                        {currentBalance ? (
                                            <Typography sx={{ p: 1 }}>{JSON.stringify(currentBalance).slice(0,-11)} is the amount of Ether 
                                            <br />account <b>{shortenAddress(currentAccount)}</b> has available in its wallet.</Typography>
                                        ) : (
                                            <Typography sx={{ p: 1 }}>Make sure you have a web3 wallet 
                                            <br />installed and connected in order to use the app!</Typography>
                                        )}
                                 
                                    </Popover>
                                </div>
                            </div>
                            <div>
                                <p className="text-white font-light text-sm">
                                    {shortenAddress(currentAccount)}
                                </p>
                                <p className="text-white font-semibold text-lg mt-1">
                                    &Xi; {JSON.stringify(currentBalance).slice(0,-11)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
            <Input placeholder="Address To" name="addressTo" type="text" handleChange={handleChange} />
            <Input placeholder="Amount (ETH)" name="amount" type="text" handleChange={handleChange} />
            <Input placeholder="Enter Message" name="message" type="text" handleChange={handleChange} />

            <div className="h-[1px] w-full bg-gray-400 my-2" />

            {isLoading ? (
                <Loader />
            ) : (
                (!formData.addressTo || !formData.amount || !formData.message) ? (
                    <div
                    onClick={handleSubmit}
                    className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full text-center disabled"
                >
                    Connect Wallet & Fill out fields to send ETH
                </div>
                ) : (
                    <button
                    type="button"
                    onClick={handleSubmit}
                    className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer"
                >
                    Send Now
                </button>
                )
             
            )}
            </div>
            
            <Transactions />
            <div className="w-full flex md:justify-center justify-between items-center flex-col p-4">
                <div className="sm:w-[90%] w-full flex justify-center items-center mt-3">
                <p className="text-white text-left text-xs">Copyright © 2022 • Calvin Macintosh</p>
                </div>
            </div>
        </div>
    
    )
}

export default Home;
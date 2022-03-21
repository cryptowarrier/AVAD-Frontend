import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Routes,
    Link
} from "react-router-dom";

import { addNet, switchNet, network } from '../constants/network';
import { walletService } from '../utils/wallet.service';

// import AboutUs from './AboutUs'
// import Coffee from './Coffee'
// import ContactUs from './ContactUs'
import Home from './Home'
import Faucet from './Faucet'
import { address } from '../constants/addresses';
import ConnectModal from './ConnectModal';

function Header() {
    const [userAccount, setUserAccount] = useState();
    const [validChain, setValidChain] = useState(true);
    const [openModal, setOpenModal] = useState();
    async function requestAccount() {
        if (typeof window.ethereum !== 'undefined') {
            setOpenModal();
            await addAvad();
            await window.ethereum.request(addNet); // 
            try {
                await window.ethereum.request(switchNet); // 
            } catch (err) {
                console.log(err);
            }
            const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });  // connect wallet
            setUserAccount(account)
            walletService.saveUser(account);
        }
    }

    const openConnectModal = () => {
        if (!userAccount) {
            setOpenModal(true);
        }
    }

    const addAvad = async () => {
        // add avad
        const newAsset = {
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: address['drip'],
                    symbol: "AVAD",
                    decimals: 18,
                },
            },
        };
        await window.ethereum.request(newAsset);
    }

    useEffect(() => {
        async function getAccount() {
            if (typeof window.ethereum !== 'undefined') {
                setUserAccount(walletService.getUser());
            }
        }
        getAccount();
    }, []);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('chainChanged', () => {
                if (Number(window.ethereum.networkVersion) !== parseInt(network.chainId)) {
                    setValidChain(true);
                } else {
                    setValidChain();
                }
            })
            window.ethereum.on("accountsChanged", accounts => {
                if (accounts.length > 0) {
                    console.log(`Account connected: ${accounts[0]}`);
                } else {
                    setUserAccount();
                    walletService.removeUser();
                }
            });
        }
    });

    return (
        <Router>
            <header className="header-section">
                <ConnectModal open={openModal} close={() => setOpenModal()} connect={requestAccount} />
                <div className="container">
                    <div className="header-wrapper">
                        <div className="logo">
                            <a href="/">
                                <img src="assets/images/logo/logo.png" alt="logo" />
                            </a>
                        </div>
                        <ul className="menu">
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>
                                <a href="#">Buy AVAD</a>
                            </li>
                            <li>
                                <a href="/faucet">Faucet</a>
                            </li>
                            <li>
                                <a href="#">Whitepaper</a>
                            </li>
                            <li className="d-sm-none">
                                <div className="m-0 header-button">Connect wallet</div>
                            </li>
                        </ul>
                        <div className="header-bar d-lg-none">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className="header-right">
                            <button onClick={openConnectModal} className="header-button d-none d-sm-inline-block">
                                {
                                    !!userAccount ? (
                                        <>{validChain ? `${userAccount.substring(0, 5)}..${userAccount.substring(userAccount.length - 5)}` : 'Invalid Chain'}</>
                                    ) : (
                                        <>Connect Wallet</>
                                    )
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <Routes>
                <Route path="/" element={<Home account={userAccount} requestAccount={requestAccount} />} />
                <Route path="/faucet" element={<Faucet account={userAccount} requestAccount={requestAccount} />} />
            </Routes>
        </Router>
    );
}

export default Header;
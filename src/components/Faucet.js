import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { address } from '../constants/addresses';
import { parseEther, formatEther } from 'ethers/lib/utils';
import Drip from '../contracts/DripToken.sol/DripToken.json';
import FaucetV4 from '../contracts/FaucetV4.sol/FaucetV4.json';
import { network } from '../constants/network';

function Faucet({ account }) {
    const [amountIn, setAmountIn] = useState(0);
    const [available, setAvailable] = useState(0);
    const [staked, setStaked] = useState(0);
    const [claimed, setClaimed] = useState(0);
    const [maxPayouts, setMaxPayouts] = useState(0);
    const [claimAddr, setCiaimAddr] = useState('');
    const [ maxAmount, setMaxAmount] = useState();
    
    async function getInfos() {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.JsonRpcProvider(network.rpcUrls[0]);
            const faucet = new ethers.Contract(address['faucet'], FaucetV4.abi, provider);
            const drip = new ethers.Contract(address['drip'], Drip.abi, provider);
            try {
                const balance = await drip.balanceOf(account);
                setMaxAmount(formatEther(balance));
                const availAmount = await faucet.payoutOf(String(account));
                setAvailable(formatEther(availAmount[0]));
                const userInfo = await faucet.userInfoTotals(String(account));
                setStaked(formatEther(userInfo[1]));
                const totalClaimed = await faucet.total_withdraw();
                setClaimed(formatEther(totalClaimed));
                setMaxPayouts(formatEther(availAmount[1]));
            } catch (err) {
                console.log(err);
            }

        }
    }
    useEffect(() => {
        getInfos();
    });

    // depoist

    async function deposit() {
        console.log('deposit')
        try {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const drip = new ethers.Contract(address['drip'], Drip.abi, signer);
                // approve
                await drip.approve(address['faucet'], parseEther(String(amountIn)));
                drip.once("Approval", async () => {
                    // stake
                    const faucet = new ethers.Contract(address['faucet'], FaucetV4.abi, signer);
                    const stakeTx = await faucet.deposit(parseEther(String(amountIn)));
                    await stakeTx.wait();
                    window.alert("Deposited!");
                    getInfos();
                    setAmountIn(0);
                });
            }
        } catch (err) {
            throw err;
        }
    }

    // claim
    async function requestClaim() {
        try {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const faucet = new ethers.Contract(address['faucet'], FaucetV4.abi, signer);
                const claimTx = await faucet.claim();
                await claimTx.wait();
                window.alert("Claimed!");
            }
        } catch (err) {
            throw err;
        }
    }

    // claim for test
    async function claimTestAvad() {
        try {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const faucet = new ethers.Contract(address['faucet'], FaucetV4.abi, signer);
                const claimTx = await faucet.claimForTest(claimAddr);
                await claimTx.wait();
                window.alert("Claimed!");
                setCiaimAddr('');
            }

        } catch (err) {
            throw err;
        }
    }
    return (
        <>
            <section className="feature-section padding-top padding-bottom oh pos-rel">
                <div className="feature-shapes d-none d-lg-block">
                    <img src="assets/images/feature/feature-shape.png" alt="feature" />
                </div>
                <div className="container">
                    <div className="section-header mw-725">
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="feature-wrapper mb-30-none owl-thumbs" data-slider-id="1">
                                <div className="feature-item">
                                    <div className="feature-thumb">
                                        <div className="thumb">
                                            <img src="assets/images/feature/pro1.png" alt="feature" />
                                        </div>
                                    </div>
                                    <div className="feature-content">
                                        <h4 className="title">{available} AVAD</h4>
                                        <p>Rewards</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-thumb">
                                        <div className="thumb">
                                            <img src="assets/images/feature/pro2.png" alt="feature" />
                                        </div>
                                    </div>
                                    <div className="feature-content">
                                        <h4 className="title">{staked} AVAD</h4>
                                        <p>Deposits</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-thumb">
                                        <div className="thumb">
                                            <img src="assets/images/feature/pro3.png" alt="feature" />
                                        </div>
                                    </div>
                                    <div className="feature-content">
                                        <h4 className="title">{claimed} AVAD</h4>
                                        <p>Claimed</p>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <div className="feature-thumb">
                                        <div className="thumb">
                                            <img src="assets/images/feature/pro4.png" alt="feature" />
                                        </div>
                                    </div>
                                    <div className="feature-content">
                                        <h4 className="title">{maxPayouts} AVAD</h4>
                                        <p>Max Payout</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="container">
                                <div className="account-wrapper">
                                    <div className="account-body">
                                        <h4 className="title mb-20">Welcome To AVAD</h4>
                                        <div className="account-form">
                                            <div className="form-group">
                                                <label for="sign-up">Amount</label>
                                                <div className="deposit-input">
                                                    <input value={amountIn} onChange={e => setAmountIn(e.target.value)} type="text" placeholder="At least 1 AVAD" />
                                                    <div onClick={() => setAmountIn(maxAmount)} className="max-button">MAX</div>
                                                </div>
                                                <span className="sign-in-recovery">A minimum of 1 AVAD required for deposits *</span>
                                            </div>
                                            <div className="form-group text-center">
                                                <button onClick={deposit} className="mt-2 mb-2">Deposit</button>
                                                <button onClick={requestClaim} className="mt-2 mb-2">Claim</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container">
                                <div className="test-wrapper">
                                    <div className="account-body">
                                        <div className="account-form">
                                            <div className="form-group">
                                                <label for="sign-up">Input your address for getting test AVAD</label>
                                                <input value={claimAddr} onChange={e => setCiaimAddr(e.target.value)} type="text" />
                                            </div>
                                            <div className="form-group text-center">
                                                <button onClick={claimTestAvad} className="mt-2 mb-2">Get AVAD</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Faucet;
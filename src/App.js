import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import DMRBackground from "./DMRBanner.png";
import TrippyGif from "./trippybirdGif.gif";
import creditCards from "./creditCards.png";
import Web3 from "web3";
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";



CountDownTimer('05/20/2022 11:59 PM', 'countdown');

function CountDownTimer(dt, id) {
  var end = new Date(dt);

  var _second = 1000;
  var _minute = _second * 60;
  var _hour = _minute * 60;
  var _day = _hour * 24;
  var timer;

  function showRemaining() {
    var now = new Date();
    var distance = end - now;
    if (distance < 0) {

      clearInterval(timer);
      document.getElementById(id).innerHTML = 'EXPIRED!';

      return;
    }
    var days = Math.floor(distance / _day);
    var hours = Math.floor((distance % _day) / _hour);
    var minutes = Math.floor((distance % _hour) / _minute);
    var seconds = Math.floor((distance % _minute) / _second);

    document.getElementById(id).innerHTML = days + 'days ';
    document.getElementById(id).innerHTML += hours + 'hrs ';
    document.getElementById(id).innerHTML += minutes + 'mins ';
    document.getElementById(id).innerHTML += seconds + 'secs';
  }

  timer = setInterval(showRemaining, 1000);
}



const styles = {
  headerText: {
    fontSize: "40px",
    fontFamily: "Roboto !important",
    fontWeight: "700",
    color: "#f2f2f2",
    height: "95px",
    width: "100%",
    padding: "0px 30px"
  },

  headerText2: {
    marginTop: "75px",
    fontSize: "40px",
    fontFamily: "Roboto !important",
    fontWeight: "500",
    color: "#f2f2f2",
    height: "95px",
    width: "100%",
    padding: "0px 30px",
    textAlign: "center"
  },

  tabs: {
    fontSize: "38px",
    fontFamily: "Roboto !important",
    fontWeight: "500",
    color: "#f2f2f2",
    height: "auto",
    width: "100%",
    padding: "0px 30px"
  },

  pText: {

    fontFamily: "Roboto !important",
    fontSize: "15.5px",
    color: "#b1b1b1",
    height: "160px",
    width: "100%",
    padding: "0px 30px",
    overflow: "overlay"
  },

  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    padding: "10px",
  },
  header: {
    position: "relative",
    zIndex: 1,
    height: "115px",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },



};

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 8px;
  border: none;
  background-color: #201b58;
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: #F3164A;
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  background-color: var(--accent);
  width: 400px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: #181818;
  text-decoration: underline;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [approving, setApproving] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "0xC3dA24c7DeA1E071c69A2614b4d2D7C9B4E4CBa8",
    SCAN_LINK: "https://etherscan.io/address/0xC3dA24c7DeA1E071c69A2614b4d2D7C9B4E4CBa8",
    NETWORK: {
      NAME: "matic",
      SYMBOL: "MATIC",
      ID: 137,
    },
    NFT_NAME: "Liquidity Mint",
    SYMBOL: "SaM",
    MAX_SUPPLY: 5000,
    WEI_COST: 20000000000000000,
    DISPLAY_COST: 20,
    GAS_LIMIT: 1400000,
    MARKETPLACE: "opensea",
    MARKETPLACE_LINK: "https://opensea.io/collection/dreamstarter-genesis",
    SHOW_BACKGROUND: false,
  });


  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);

    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);


    let signature = "S2Atx0qfYi32bleF";
    // signature = S2Atx0qfYi32bleF
    blockchain.smartContract.methods
      //change params in mint to number of mints first, then the signature
      .dmrTierMint(blockchain.account, mintAmount)
      .send({
        gas: String(totalGasLimit),
        gasLimit: "0x2710",
        maxPriorityFeePerGas: "52000000000",
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };


  // Get the contract ABI from compiled smart contract json
  const erc20TokenContractAbi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "tokens", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "tokens", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "withdrawEther", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "_totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "tokenOwner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "acceptOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "a", "type": "uint256" }, { "name": "b", "type": "uint256" }], "name": "safeSub", "outputs": [{ "name": "c", "type": "uint256" }], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": false, "inputs": [{ "name": "to", "type": "address" }, { "name": "tokens", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "a", "type": "uint256" }, { "name": "b", "type": "uint256" }], "name": "safeDiv", "outputs": [{ "name": "c", "type": "uint256" }], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "tokens", "type": "uint256" }, { "name": "data", "type": "bytes" }], "name": "approveAndCall", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "a", "type": "uint256" }, { "name": "b", "type": "uint256" }], "name": "safeMul", "outputs": [{ "name": "c", "type": "uint256" }], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [], "name": "newOwner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "tokenAddress", "type": "address" }, { "name": "tokens", "type": "uint256" }], "name": "transferAnyERC20Token", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "tokenOwner", "type": "address" }, { "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "remaining", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "a", "type": "uint256" }, { "name": "b", "type": "uint256" }], "name": "safeAdd", "outputs": [{ "name": "c", "type": "uint256" }], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": false, "inputs": [{ "name": "_newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "tokens", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "tokenOwner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "tokens", "type": "uint256" }], "name": "Approval", "type": "event" }];

  const { ethereum } = window;
  let web3 = new Web3(ethereum);
  // Create contract object
  const tokenContractAddress = '0x955CE23f20217a6Aa205620b40EdE4C9E83d325f'; //TOKEN CONTRACT

  // Instantiate contract 
  const tokenContract = new web3.eth.Contract(erc20TokenContractAbi, tokenContractAddress);
  const toAddress = "0xC3dA24c7DeA1E071c69A2614b4d2D7C9B4E4CBa8"; //CONTRACT ADDRESS


  // Calculate contract compatible value for approve with proper decimal points using BigNumber
  const tokenDecimals = web3.utils.toBN(18);
  const tokenAmountToApprove = web3.utils.toBN(100000);
  const calculatedApproveValue = web3.utils.toHex(tokenAmountToApprove.mul(web3.utils.toBN(10).pow(tokenDecimals)));


  let approvedDMR = false;

  const approveContract = () => {
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalGasLimit = String(gasLimit * mintAmount);

    setApproving(true);

    // Get user account wallet address first
    web3.eth.getAccounts().then((accounts) => {
      // Send ERC20 transaction with web3
      tokenContract.methods.approve(
        toAddress,
        calculatedApproveValue
      ).send({ from: accounts[0], gasLimit: gasLimit, gas: String(totalGasLimit), maxPriorityFeePerGas: "52000000000", })
        .once('transactionHash', (hash) => { console.log(hash); })
        .once("error", (err) => {
          console.log(err);
          setFeedback("Sorry friend, something went wrong :(. Maybe you cancelled the transaction or didnt set the gas fees high enough? Please try again!");
          setApproving(false);
        })
        .once('receipt', (receipt) => {
           console.log(receipt); 
           setApproving(false);
           document.getElementById("approveButton").style.display = "none";
      document.getElementById("buyButton").style.display = "block";
          });
    });

    // setTimeout(function () {
    //   document.getElementById("approveButton").style.display = "none";
    //   document.getElementById("buyButton").style.display = "block";

    // }, 4000);
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 50) {
      newMintAmount = 50;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen id="screen">
      <s.Container
        flex={1}
        ai={"left"}
        jc={"left"}
        style={{
          width: "100%",
          height: "145px",
          marginBottom: "50px",
          background: "#181818",
          justifyContent: "left",
          display: "flex"
        }}
      >
        <div style={styles.header}>
          <a href="https://"><img style={{ margin: "15px 25px", width: "305px", height: "auto" }} src="https://app.dreamstarter.co/static/media/Rocket-Dreamstarter.5492d8d0.png">
          </img></a>

          <div style={styles.headerRight}>


            <a href="https://dreamr.gitbook.io/welcome-to-dreamr/technology/dreamstarter-nft-launchpad"><button

              style={{
                width: "200px",
                height: "40px",
                borderColor: "#69c4a6",
                borderRadius: "0.5rem",
                fontSize: "17px",
                padding: "5px",
                color: "#f2f2f2",
                background: "#181818",
                marginRight: "25px",
                cursor: "pointer",
              }}
            >
              What is DreamStarter?
            </button></a>



            <a href="https://quickswap.exchange/#/swap?inputCurrency=0x955ce23f20217a6aa205620b40ede4c9e83d325f"><button

              style={{
                width: "150px",
                height: "40px",
                borderColor: "#69c4a6",
                borderRadius: "0.5rem",
                fontSize: "17px",
                padding: "5px",
                color: "#f2f2f2",
                background: "#181818",
                marginRight: "25px",
                cursor: "pointer",
              }}
            >
              Buy DMR
            </button></a>
          </div>
        </div>

      </s.Container>
      <s.Container
        flex={1}
        ai={"center"}
        jc={"center"}
        style={{
          width: "100%",
          padding: "0px 100px",
          borderRadius: 24,
          background: "transparent",
          justifyContent: "center",
        }}
      >

        <div className="row" style={{ display: "flex", flexWrap: "wrap", backgroundColor: "#181818", padding: "0%", borderRadius: "15px", margin: "0%" }}>
          <div className="column" style={{ width: "60%", padding: "0%", display: "flex", flexWrap: "wrap" }}>
            <img src={DMRBackground} alt='dreamr' width="100%" height="auto" style={{ borderRadius: "15px", padding: "15px", borderRadius: "27px" }} />

          </div>
          <div className="columnHomeHeroText" style={{
            width: "38%", height: "60vh", backgroundColor: "#181818", padding: "0%", display: "flex", flexWrap: "wrap", borderRadius: "15px", flexDirection: "column",
            justifyContent: "center"
          }}>
            <h1 style={{ ...styles.headerText, fontWeight: "900 !important", marginTop: "10px", marginBottom: "10px", }}>
              The Ultimate NFT for DreamStarter.
            </h1>
            <div id="test234" style={{  marginTop: "15px", fontSize: "18px", height: "200px", display: "flex", justifyContent: "center", flexDirection: "column"}}>
              <p style={{ ...styles.pText, marginTop: "15px", fontSize: "17px", overflowY: "hidden" }}>
                With this NFT, holders will get premium access to DreamStarter launches, products, and multiplied tier-level benefits. The “Liquidity Mint” flair means you’ll be able to earn yield every day with this <i>NFT,</i> and the choice of redeeming it for 1,000 $DMR after 6 months!

              </p>
              <div style={{display: "flex", justifyContent: "center"}}>
              <a href="https://dreamuniverse.org/official-mint-details-for-dreamstarter-sun-moon-genesis-8-bit-nfts/"><button
                size="large"
                type="primary"
                style={{
                  width: "150px",
                  height: "40px",
                  borderColor: "#69c4a6",
                  borderRadius: "0.5rem",
                  fontSize: "17px",
                  color: "#f2f2f2",
                  background: "#181818",
                  cursor: "pointer"
                }}
              >
                Learn More
              </button></a>
              </div>
            </div>
          </div>
        </div>

      </s.Container>

      <s.Container
        flex={1}
        ai={"center"}
        id="slidingBackground"
        style={{
          padding: "0px 90px", padding: "50px 100px", backgroundColor: "#02020200", display: "flex", flexDirection: "row"
        }}
        image={CONFIG.SHOW_BACKGROUND ? null : null}
      >
        {/* <a href={CONFIG.MARKETPLACE_LINK}>
          <StyledLogo style={{ borderRadius: "25px" }} alt={"logo"} src={TrippyGif} />
        </a> */}
        {/* TOP OF THE PAGE*/}

        <s.SpacerSmall />

        <s.Container
          flex={2}
          jc={"center"}
          ai={"center"}
          style={{
            width: "100%",
            padding: 24,
            borderRadius: 10,
            background: "#181818",
            minHeight: "865px"
          }}
        >
          <div id="vaultContainerSmall" style={{ padding: "32px", borderRadius: "10px", minHeight: "620px" }}>

            <div style={{ padding: "12px" }}>
              <img style={{width: "55px", height: "55px"}} src="https://www.dreamr.app/wp-content/uploads/2022/02/cropped-dreamr-flwr-logo.png">
              </img>
              <h2 style={{ color: "white", fontSize: "32px", textAlign: "left", minWidth: "300px" }}>
                Sun & Moon "Liquidity Mint" NFT
              </h2>
              <p style={{ color: "#2DECB6", fontSize: "20px", textAlign: "left", minWidth: "300px" }}>
                by Dreamr Labs
              </p>
            </div>


            <div>
              <h2 style={{ color: "white", fontSize: "25px", textAlign: "left", minWidth: "300px", margin: "10px" }}>
                NFT Collection Overview
              </h2>

              <h2 style={{ color: "white", fontSize: "20px", textAlign: "left", minWidth: "300px", background: "#323232", border: "solid 2px #1BC1FF", padding: "10px", borderRadius: "10px" }}>
                These SaM NFTs feature 8-bit PFP style artwork with algorithmically generated trait combinations. Holders of this NFT will receive DreamStarter VIP Benefits. Benefits for holders include (but are not limited to): <br /><br />
                <ol style={{ color: "#2DECB6", lineHeight: "1.3" }}>
                  <li>
                    - Whitelist access to future DreamStarter Launches
                  </li>
                  <li>
                    - Perpetual high-yield vaults that get rewarded in $DMR
                  </li>
                  <li>
                    - Airdrops from Dreamr and DreamStarter partners
                  </li>
                  <li>
                    - DMR Tier Rewards Multiplier (all tiers)
                  </li>
                  <li>
                    - This NFT will hold special voting power in the DreamStarter DAO
                  </li>
                  <li>
                    - All proceeds go to a 12-month locked liquidity for the DMR-USDC swap pair on QuickSwap protocol, with the DAO deciding on next actions.

                  </li>
                </ol>
              </h2>
            </div>
            <div>
              <h2 style={{ color: "white", fontSize: "25px", textAlign: "left", minWidth: "300px", margin: "10px" }}>
                Technical Details
              </h2>

              <h2 style={{ color: "white", fontSize: "20px", textAlign: "left", minWidth: "300px", background: "#323232", border: "solid 2px rgb(45, 236, 182)", padding: "10px", borderRadius: "10px" }}>
                <ol style={{ color: "#2DECB6", lineHeight: "1.3" }}>
                  <li>
                    - ERC-721 - Polygon Network
                  </li>
                  <li>
                    - Art: Algorithmic PFP (8-bit)
                  </li>
                  <li>
                    - Collection Size: 5,000
                  </li>
                  
                  <li>
                      - After 6 months, each “Liquidity Mint” NFT will become burnable. If a holder burns their NFT, they will receive 1,000 $DMR. This offers holders an additional way to exit their position, that doubles as a deflationary incentive for the PFP collection.

                    </li>
                </ol>
              </h2>
            </div>

          </div>

        </s.Container>


        <ResponsiveWrapper flex={5} fd={"column"} style={{
          padding: 24, width: "100%", minWidth: "360px", display: "flex",
          flexDirection: "column", flexWrap: "nowrap"
        }} test>
          <s.SpacerLarge />
          <a id="cloudContainer" style={{ display: "none" }}><button style={{ background: "url('https://app.dreamstarter.co/static/media/Rocket-Dreamstarter.5492d8d0.png')" }} onClick={
            function () {
              document.getElementById("myModal").style.display = "none";
            }
          } id="myBtn"></button></a>

          <div id="myModal" onClick={
            function () {
              document.getElementById("myModal").style.display = "none";
            }
          } className="modal">

            <div className="modal-content">
              <span onClick={
                function () {
                  document.getElementById("myModal").style.display = "none";
                }
              } className="close">&times;</span>
              <p>Some text in the Modal..</p>
            </div>

          </div>
          <s.Container
            flex={10}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "#181818",
              width: "100%",
              minWidth: "300px",
              padding: 24,
              borderRadius: 10,
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 29,
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              DreamStarter Genesis Mint
            </s.TextTitle>
            <div style={{ padding: "12px" }}>

              <p style={{ color: "#2DECB6", fontSize: "20px", textAlign: "center", minWidth: "300px", fontWeight: "600" }}>
                <b>PRICE RAISES BY 50% IN:</b>
              </p>
              <div style={{ textAlign: "center", marginTop: "20px", border: "solid 2px #2DECB6", padding: "10px", color: "#fff", borderRadius: "8px", fontSize: "20px"}} id="countdown"></div>
            </div>
          </s.Container>
          <s.Container
            flex={10}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "#2DECB6",
              width: "100%",
              minWidth: "300px",
              padding: 24,
              margin: "20px 0px",
              borderRadius: 10,
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 35,
                fontWeight: "bold",
                color: "#181818",
              }}
            >
              TWO WAYS TO MINT <br />
              <span style={{ fontSize: "27px" }}>{data.totalSupply} / {CONFIG.MAX_SUPPLY}</span>
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "#c6bb1d !important",
              }}
            >
              <StyledLink style={{
                textAlign: "center",
                color: "#181818 !important",
              }} target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <span
              style={{
                textAlign: "center",
              }}
            >
              {/* <StyledButton
                onClick={(e) => {
                  window.open("https://dreamuniverse.org/dreamstarter-announces-first-nft-drop-liquidity-mint/", "_blank");
                }}
                style={{
                  margin: "5px",
                }}
              >
                Roadmap
              </StyledButton> */}
              <StyledButton
                style={{
                  margin: "5px",
                }}
                onClick={(e) => {
                  window.open(CONFIG.MARKETPLACE_LINK, "_blank");
                }}
              >
                {CONFIG.MARKETPLACE}
              </StyledButton>
            </span>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                {/* <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 {CONFIG.SYMBOL} is {CONFIG.DISPLAY_COST}{" "}, check your DMR tier to see the benefits for this mint!
                </s.TextTitle> */}
                <s.SpacerXSmall />
                {/* <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Excluding gas fees.
                </s.TextDescription> */}
                <s.SpacerSmall />
                
                {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"column"}>
                      <h1 style={{ ...styles.headerText, fontSize: "20px", height: "30px", textAlign: "center", padding: "0", margin: "5px", color: "#181818" }}>
                        MINT FOR 2,000 $DMR
                      </h1>
                      <StyledButton style={{ marginBottom: "20px", width: "200px" }} id="approveButton"
                        onClick={(e) => {
                          e.preventDefault();
                          // claimNFTs();
                          approveContract();
                          getData();
                        }}
                      >
                        {approving ? "APPROVING" : "APPROVE DMR"}
                      </StyledButton>
                      <StyledButton id="buyButton"
                        style={{ display: "block", marginBottom: "20px" }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          // approveContract();
                          getData();
                        }}
                      >
                        {claimingNft ? "MINTING" : "BUY W/ DMR"}
                      </StyledButton>

                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
            <h1 style={{ ...styles.headerText, fontSize: "20px", height: "30px", textAlign: "center", padding: "0", margin: "5px", color: "#181818" }}>
                        -- MINT FOR $20 USD --
                      </h1>
            <CrossmintPayButton
              collectionTitle="DreamStarter Sun and Moon Genesis NFT"
              collectionDescription="Genesis collection for the DreamStarter Launchpad featuring Sun and Moon 8-Bit PFP Generative Artwork.  Proceeds collected from this mint create locked liquidity for the Dreamr Platform Token (DMR) DEX pair for a minimum of 12 months. After 12 months, holders will have the option to burn their NFT and redeem 1,000 $DMR tokens to the same wallet."
              collectionPhoto="https://i.imgur.com/xwwRniv.png"
              clientId="265dc450-bc2d-4a34-9b4c-da2855f82ea5"
              className="my-custom-crossmint-button"
              style={{display: "none"}}
              mintConfig={{
                type: "erc-721",
                _to: "$CrossmintUserAddress",
                _mintAmount: mintAmount,
                price: JSON.stringify(mintAmount * 1),
              }}
            />
            <img style={{display: "none",width: "170px", height: "auto", background: "#181818", borderRadius: "10px", marginTop: "10px"}} src={creditCards}>
              </img>
              <p style={{display: "none",fontSize: "14px"}}>ACCEPTED VIA CROSSMINT</p>
          </s.Container>
          <s.SpacerLarge />
        </ResponsiveWrapper>
        <s.SpacerMedium />

      </s.Container><s.Container jc={"center"} ai={"center"} style={{ width: "100%", display: "block" }}>
        <s.TextDescription
          style={{
            textAlign: "center",
            color: "#fff",
            textShadow: "0px 1px 4px #181818"

          }}
        >
          Please make sure you are connected to the right network (
          {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
          Once you make the purchase, you cannot undo this action.
        </s.TextDescription>
        <s.SpacerSmall />
        <s.TextDescription
          style={{
            textAlign: "center",
            color: "#fff",
            textShadow: "0px 1px 4px #181818",
            marginBottom: "20px"
          }}
        >
          We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
          successfully mint your NFT. We recommend that you don't lower the
          gas limit.
        </s.TextDescription>
        <div id="mobileWarning" style={{ display: "none", position: "fixed", width: "100vw", height: "100%", background: "#201B58", top: "0", left: "0", zIndex: "1", padding: "30px 0px"}}>
          <div>
            <h1 style={{...styles.headerText, textAlign: "center"}}>
              NOT SUPPORTED
            </h1>
          </div>
          <div >
            <p style={{...styles.pText, textAlign: "center", fontSize: "24px", color: "white"}}>
              DreamStarter is currently not supported on mobile. <br /><br />
              Please switch to desktop and stay tuned for the mobile release!
            </p>
          </div>
          <div style={{display: "flex", justifyContent: "center"}}>
            <img style={{width: "250px", height: "auto"}} src="https://www.dreamr.app/wp-content/uploads/2022/04/SaM_NFT_Hologram_2.png">
            </img>
          </div>
        </div>
      </s.Container>
    </s.Screen>
  );
}


function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === "complete" || document.readyState === "interactive") {
      // call on next available tick
      const mediaQuery = window.matchMedia('(max-width: 768px)')
    // Check if the media query is true
    if  (mediaQuery.matches) {
      // Then trigger an alert
      document.getElementById("mobileWarning").style.display = 'block';
      console.log("hi");
    }
      setTimeout(fn, 1);
  } else {
      document.addEventListener("DOMContentLoaded", fn);
  }
}  

docReady(docReady);

export default App;

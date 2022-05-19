import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import DMRBackground from "./DMRBanner.png";
import TrippyGif from "./trippybirdGif.gif";
import Web3 from "web3";
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";

const styles = {
  headerText: {
    margin: "30px 0px",
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
  }



};

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
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
  color: #201b58;
  text-decoration: none;
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
    CONTRACT_ADDRESS: "0x84720d38F89E04F6893ff959D4a2de34fb3cC579",
    SCAN_LINK: "https://etherscan.io/address/0x84720d38F89E04F6893ff959D4a2de34fb3cC579",
    NETWORK: {
      NAME: "Mumbai",
      SYMBOL: "MATIC",
      ID: 80001,
    },
    NFT_NAME: "Liquidity Mint",
    SYMBOL: "SaM",
    MAX_SUPPLY: 5000,
    WEI_COST: 20000000000000000,
    DISPLAY_COST: 20,
    GAS_LIMIT: 1200000,
    MARKETPLACE: "opensea",
    MARKETPLACE_LINK: "https://opensea.io/collection/rdb-official",
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
        gasLimit: String(totalGasLimit),
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
  const tokenContractAddress = '0x22c383C477Abe3f7e3fcD08198430D5A81B0d7ff'; //TOKEN CONTRACT

  // Instantiate contract 
  const tokenContract = new web3.eth.Contract(erc20TokenContractAbi, tokenContractAddress);
  const toAddress = "0xc1185fA3D60c97b71c6c0CEf1E4667c3a873Acd6"; //CONTRACT ADDRESS


  // Calculate contract compatible value for approve with proper decimal points using BigNumber
  const tokenDecimals = web3.utils.toBN(18);
  const tokenAmountToApprove = web3.utils.toBN(100000);
  const calculatedApproveValue = web3.utils.toHex(tokenAmountToApprove.mul(web3.utils.toBN(10).pow(tokenDecimals)));


  let approvedDMR = false;

  const approveContract = () => {
    setApproving(true);

    // Get user account wallet address first
    web3.eth.getAccounts().then((accounts) => {
      // Send ERC20 transaction with web3
      tokenContract.methods.approve(
        toAddress,
        calculatedApproveValue
      ).send({ from: accounts[0] })
        .once('transactionHash', (hash) => { console.log(hash); })
        .once('receipt', (receipt) => { console.log(receipt); });
    });

    approvedDMR = true;
    setTimeout(function () {
      document.getElementById("approveButton").style.display = "none";
      document.getElementById("buyButton").style.display = "block";
      setApproving(false);
    }, 2000);
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
          height: "105px !important",
          borderRadius: 24,
          padding: "15px",
          marginBottom: "50px",
          marginTop: "30px",
          background: "transparent",
          justifyContent: "left",
        }}
      > <img style={{ width: "305px", height: "auto" }} src="https://app.dreamstarter.co/static/media/Rocket-Dreamstarter.5492d8d0.png">
        </img>

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
            <img src={DMRBackground} alt='dreamr' width="100%" height="auto" style={{ borderRadius: "15px" }} />

          </div>
          <div className="columnHomeHeroText" style={{
            width: "38%", height: "52vh", backgroundColor: "#181818", padding: "0%", display: "flex", flexWrap: "wrap", borderRadius: "15px", flexDirection: "column",
            justifyContent: "center"
          }}>
            <h1 style={{ marginTop: "0px", fontWeight: "900 !important", ...styles.headerText }}>
              The Ultimate NFT for DreamStarter.
            </h1>
            <div id="test234"></div>
            <p style={{ ...styles.pText, marginTop: "15px", fontSize: "18px", height: "200px" }}>
            With this NFT holders will get premium access to DreamStarter launches, products, and multiplied tier-level benefits. The “Liquidity Mint” flair means you’ll be able to earn yield every day with this NFT and even redeem it for 1,000 $DMR for 12 months if you choose! 

            </p>
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
            borderRadius: 24,
            background: "#181818",
          }}
        >
          <div id="vaultContainerSmall" style={{ padding: "32px", borderRadius: "10px", minHeight: "620px" }}>

            <div style={{ padding: "12px" }}>
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
                <ol style={{color: "#2DECB6", lineHeight: "1.3"}}>
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
                  - All proceeds go to 12-month locked liquidity for the DMR-USDC swap pair on QuickSwap protocol, with the DAO deciding on next actions.

                  </li>
                </ol>
              </h2>
            </div>
            <div>
              <h2 style={{ color: "white", fontSize: "25px", textAlign: "left", minWidth: "300px", margin: "10px" }}>
                Technical Details
              </h2>

              <h2 style={{ color: "white", fontSize: "20px", textAlign: "left", minWidth: "300px", background: "#323232", border: "solid 2px #1BC1FF", padding: "10px", borderRadius: "10px" }}>
                These SaM NFTs feature 8-bit PFP style artwork with algorithmically generated trait combinations. Holders of this NFT will receive DreamStarter VIP Benefits. Benefits for holders include (but are not limited to): <br /><br />
                <ol style={{color: "#2DECB6", lineHeight: "1.3"}}>
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
                  - Redemption-Burn Mechanism
                  </li>
                  <li>
                  - This NFT will hold special voting power in the DreamStarter DAO
                  </li>
                  <li>
                  - All proceeds go to 12-month locked liquidity for the DMR-USDC swap pair on QuickSwap protocol, with the DAO deciding on next actions.
                    <li>
                    - After 12 months, each “Liquidity Mint” NFT will become burnable. If a holder burns their NFT, they will receive 1,000 $DMR. This offers holders an additional way to exit their position, that doubles as a deflationary incentive for the PFP collection.

                    </li>
                  </li>
                </ol>
              </h2>
            </div>

          </div>

        </s.Container>

        
        <ResponsiveWrapper flex={5} style={{ padding: 24, width: "100%", minWidth: "360px" }} test>
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
              borderRadius: 24,
              border: "4px solid #020202",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 40,
                fontWeight: "bold",
                color: "#fff",
                textShadow: "0px 1px 3px #000000"
              }}
            >
              DreamStarter SaM Liquidity Mint <br />
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "#c6bb1d !important",
              }}
            >
              <StyledLink style={{
                textAlign: "center",
                color: "#201b58 !important",
              }} target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <span
              style={{
                textAlign: "center",
              }}
            >
              <StyledButton
                onClick={(e) => {
                  window.open("https://dreamuniverse.org/dreamstarter-announces-first-nft-drop-liquidity-mint/", "_blank");
                }}
                style={{
                  margin: "5px",
                }}
              >
                Roadmap
              </StyledButton>
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
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 {CONFIG.SYMBOL} is {CONFIG.DISPLAY_COST}{" "}, check your DMR tier to see the benefits for this mint!
                </s.TextTitle>
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
                      <h1 style={{...styles.headerText, fontSize: "20px", height: "30px", textAlign: "center", padding: "0", margin: "5px"}}>
                        MINT FOR 2,500 $DMR
                      </h1>
                      <StyledButton style={{marginBottom: "20px"}} id="approveButton"
                        onClick={(e) => {
                          e.preventDefault();
                          // claimNFTs();
                          approveContract();
                          getData();
                        }}
                      >
                        {approving ? "APPROVING" : "APPROVE"}
                      </StyledButton>
                      <StyledButton id="buyButton"
                        style={{ display: "none", marginBottom: "20px" }}
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
            <s.SpacerMedium /><CrossmintPayButton
                        collectionTitle="Genesis Mainnet Test"
                        collectionDescription="Genesis Mainnet Test"
                        collectionPhoto=""
                        clientId="265dc450-bc2d-4a34-9b4c-da2855f82ea5"
                        mintConfig={{
                          type: "erc-721",
                          _to: blockchain.account,
                          _mintAmount: mintAmount,
                          price: JSON.stringify(mintAmount * 17),
                        }}
                      />
          </s.Container>
          <s.SpacerLarge />
        </ResponsiveWrapper>
        <s.SpacerMedium />

      </s.Container><s.Container jc={"center"} ai={"center"} style={{ width: "100%", display: "block" }}>
        <s.TextDescription
          style={{
            textAlign: "center",
            color: "#000",
            textShadow: "0px 1px 4px #fff"

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
            color: "#000",
            textShadow: "0px 1px 4px #fff"
          }}
        >
          We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
          successfully mint your NFT. We recommend that you don't lower the
          gas limit.
        </s.TextDescription>
      </s.Container>
    </s.Screen>
  );
}


export default App;

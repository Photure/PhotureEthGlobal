import React, { createContext, useContext, useMemo, useEffect, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  photureContractAddress,
  MoralisAPIKey,
  MUMBAI_NFT_ADDRESS,
  MUMBAI_NFT_MARKET_ADDRESS,
  MUMBAI_INFURA_SECRET,
  MUMBAI_INFURA_ENDPOINT,
  MAINET_INFURA_SECRET,
  MAINNET_NFT_MARKET_ADDRESS,
  ALTERNATIVE_MINTING_CONTRACT_ADDRESS,
  MAINNET_INFURA_ENDPOINT
} from '@env';
import Web3 from 'web3'
import {ethers} from 'ethers'
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import { APIQueries } from '../constants/Queries'

export const FeedContext = createContext({
    marketData: [],
    buyItem: () => null,
    feedData: [],
    // createNFT: () => null,
    // getNFT: () => null,
})

const marketDataInitialState = [];
const MARKET_DATA_TYPES = {
    SET_MARKETPLACE_DATA: 'SET_GALLERY_DATA',
  };

  
  const marketDataReducer = (state, action) => {
    switch (action.type) {
      case MARKET_DATA_TYPES.SET_MARKETPLACE_DATA:
        return action.payload;
        break;
      case 'appendNewlyMintedNFT': 
        const newAssetsArray = [...state, action.payload]
        return newAssetsArray
      default:
        return state;
        break;
    }
  };

  const feedDataInitialState = [];
const FEED_DATA_TYPES = {
    SET_FEED_DATA: 'SET_FEED_DATA',
  };

  
  const feedDataReducer = (state, action) => {
    switch (action.type) {
    case FEED_DATA_TYPES.SET_FEED_DATA:
        return action.payload;
        break;
      case 'appendNewlyMintedNFT': 
        const newAssetsArray = [...state, action.payload]
        return newAssetsArray
      default:
        return state;
        break;
    }
  };


  export const FeedProvider = (props: { children: React.ReactNode }): any => {
    // const [firstTimeLogin, setFirstTimeLogin] = useState<boolean>(false);
    // const [featuredListings, setFeaturedListings] = useState<Array<ListDataType>>(
    //   [],
    // );
    // const [ currentRouteName, setCurrentRouteName ] = useState<String>('')
    // const [tutorials, setTutorials] = useState<Array<ListDataType>>([]);
    const walletConnect = useWalletConnect()
    const [marketData, dispatchMarket] = useReducer(
      marketDataReducer,
      marketDataInitialState,
    );
    const [feedData, dispatchFeed] = useReducer(
        feedDataReducer,
        feedDataInitialState,
      );
    const connection =new Web3(new Web3.providers.HttpProvider(MAINNET_INFURA_ENDPOINT,
      {headers: [
        {
          name: 'user', value: MAINET_INFURA_SECRET}
      ]}
    ))

    async function buyItem(item) {
        try {
        console.log('item', item)
        const royaltyAmount = .15 * item.price
        const amountForSeller = .84 * item.price
        const ownerAmount = .01 * item.price
        const data = connection.eth.abi.encodeFunctionCall({
          name: 'createMarketSale',
          type: 'function',
          inputs: [
            {
              type: 'address',
              name: 'nftContract'
          },
            {
              type: 'uint256',
              name: 'itemId'
          },
          {
            type: 'uint256',
            name: 'royaltyAmount'
        },
        {
            type: 'uint256',
            name: 'amountForSeller'
        },
          {
            type: 'uint256',
            name: 'ownerAmount'
        },
        ]
      }, [ALTERNATIVE_MINTING_CONTRACT_ADDRESS, item.itemId, royaltyAmount, amountForSeller, ownerAmount ]);
        // console.log('decimals',value, Web3.utils.soliditySha3((0.25*(10**decimals)).toString()))
        const unsignedTransaction = {
            from: walletConnect.accounts[0],
            to: MAINNET_NFT_MARKET_ADDRESS,
            data: data,
            gas: 500000,
            value: item.price
        }
        try {
            
            const transaction = await walletConnect.sendTransaction(unsignedTransaction) // await connection.eth.sendTransaction(signedTransaction)
            // const transaction = await connection.eth.sendTransaction(unsignedTransaction)
            console.log('guess it works', transaction)
        } catch (err) {
            console.log('no way this works', err)
        }
        /* then list the item for sale on the marketplace */
        
        return
      } catch (err) {
        console.log('Error in the entire thing',err)
      }
      }

    const getFeedItems = async () => {
        const query = APIQueries.feed.getFeedNFTs
        fetch(query, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key':  MoralisAPIKey,
            },
          })
            .then(async response => {
      
              const jsonResponse = await response.json()
                console.log('FeedData Response', jsonResponse)
                const nftArray = transformCollectionAssetsJsonResponse(jsonResponse.result)
                console.log(nftArray)
                dispatchFeed({type: FEED_DATA_TYPES.SET_FEED_DATA, payload: nftArray})
            })
            .catch(error => console.log('error getting nfts', error));
        };
  
  
    const getMarketPlaceItems = async () => {
      console.log('getMarket')
      const contract = new connection.eth.Contract(Market.abi, MAINNET_NFT_MARKET_ADDRESS)
      console.log('contract', contract)
      const marketDataReturn = await contract.methods.fetchMarketItems().call({from:walletConnect.accounts[0]})
      console.log('here goes',marketDataReturn)
      dispatchMarket({type: MARKET_DATA_TYPES.SET_MARKETPLACE_DATA, payload:marketDataReturn})
    };
  
    const transformCollectionAssetsJsonResponse = (assets) => {
      const nftArray = []
      assets.forEach(asset => {
        const { metadata, token_uri, token_address, owner_of, token_id, amount} = asset
        if(metadata && token_uri){
        nftArray.push({metadata: JSON.parse(metadata), token_uri, token_address, owner_of, token_id, amount})
    } else if (token_uri) {
        const metadataCached = fetch(token_uri).then(async response=> await response.json())
        console.log('meta was cached', metadataCached)
        nftArray.push({metadata: JSON.parse(metadataCached), token_uri, token_address, owner_of, token_id, amount})
    }
    })
      return nftArray
    }
  
    // const appendNewlyMintedNFT = (data) => {
    //   console.log('inAppend function dispatch is happening', data)
    //   dispatch({type: 'appendNewlyMintedNFT', payload: {metadata: data}})
    // }
  
    useEffect(() => {
      (async () => {
          getMarketPlaceItems();
          getFeedItems()
      })();
    }, [walletConnect]);
  
    const acceptedValue = useMemo(
      () => ({
          // createNFT,
          feedData,
          marketData,
          buyItem,
          // getNFT,
      }),
      [marketData, buyItem, feedData],
    );
    return (
      <FeedContext.Provider value={acceptedValue}>
        {props.children}
      </FeedContext.Provider>
    );
  };
  
  export const useFeedContext: any = () => useContext(FeedContext);
  
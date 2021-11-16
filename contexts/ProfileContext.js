import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useReducer,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  photureContractAddress,
  MoralisAPIKey,
  MUMBAI_NFT_ADDRESS,
  MUMBAI_NFT_MARKET_ADDRESS,
  MUMBAI_INFURA_SECRET,
  MUMBAI_INFURA_ENDPOINT,
  MAINNET_NFT_MARKET_ADDRESS,
  ALTERNATIVE_MINTING_CONTRACT_ADDRESS,
} from '@env';
import Web3 from 'web3';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';

export const ProfileContext = createContext({
  galleryData: [],
  postItemForSale: () => null,
  // createNFT: () => null,
  // getNFT: () => null,
});

const galleryInitialState = [];
const GALLERY_ACTION_TYPES = {
  SET_GALLERY_DATA: 'SET_GALLERY_DATA',
};

const galleryReducer = (state, action) => {
  switch (action.type) {
    case GALLERY_ACTION_TYPES.SET_GALLERY_DATA:
      return action.payload;
      break;
    case 'appendNewlyMintedNFT':
      const newAssetsArray = [...state, action.payload];
      return newAssetsArray;
    default:
      return state;
      break;
  }
};

export const ProfileProvider = (props: {children: React.ReactNode}): any => {
  // const [firstTimeLogin, setFirstTimeLogin] = useState<boolean>(false);
  // const [featuredListings, setFeaturedListings] = useState<Array<ListDataType>>(
  //   [],
  // );
  // const [ currentRouteName, setCurrentRouteName ] = useState<String>('')
  // const [tutorials, setTutorials] = useState<Array<ListDataType>>([]);
  const walletConnect = useWalletConnect();
  // const [walletAddress, setWalletAddress] = (useState < String) | (null > null);
  const [galleryData, dispatch] = useReducer(
    galleryReducer,
    galleryInitialState,
  );
  const connection = new Web3(
    new Web3.providers.HttpProvider(MUMBAI_INFURA_ENDPOINT, {
      headers: [
        {
          name: 'user',
          value: MUMBAI_INFURA_SECRET,
        },
      ],
    }),
  );

  async function postItemForSale(item) {
    try {
      const decimals = 12;
      console.log('item', item);
      const data = connection.eth.abi.encodeFunctionCall(
        {
          name: 'createMarketItem',
          type: 'function',
          inputs: [
            {
              type: 'address',
              name: 'nftContract',
            },
            {
              type: 'uint256',
              name: 'tokenId',
            },
            {
              type: 'uint256',
              name: 'price',
            },
            {
              type: 'address',
              name: 'originalCreator',
            },
          ],
        },
        [
          ALTERNATIVE_MINTING_CONTRACT_ADDRESS,
          item.token_id,
          '1000',
          walletConnect.accounts[0],
        ],
      );
      // console.log('decimals',value, Web3.utils.soliditySha3((0.25*(10**decimals)).toString()))
      const unsignedTransaction = {
        from: walletConnect.accounts[0],
        to: MAINNET_NFT_MARKET_ADDRESS,
        data: data,
        // to: null, // Required
        gas: 500000,
        // gasPrice: value, // Required
        // value: null, // Require
        // nonce: null, // Required
      };
      // console.log('is hex', Web3.utils.isHex(functionHash),Web3.utils.isHex(addressHash),Web3.utils.isHex(priceHash),Web3.utils.isHex(data))
      // console.log('contract', unsignedTransaction, data)
      // const signedTransaction = await walletConnect.signTransaction(unsignedTransaction)
      // console.log('signed', signedTransaction)
      try {
        const transaction = await walletConnect.sendTransaction(
          unsignedTransaction,
        ); // await connection.eth.sendTransaction(signedTransaction)
        // const transaction = await connection.eth.sendTransaction(unsignedTransaction)
        console.log('guess it works', transaction);
      } catch (err) {
        console.log('no way this works', err);
      }
      /* then list the item for sale on the marketplace */

      return;
    } catch (err) {
      console.log('Error in the entire thing', err);
    }
  }

  const getGalleryForWallet = async () => {
    
    
    const moralisQuery = `https://deep-index.moralis.io/api/v2/${walletConnect._accounts[0]}/nft/${ALTERNATIVE_MINTING_CONTRACT_ADDRESS}?chain=polygon&format=decimal`;
    fetch(moralisQuery, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MoralisAPIKey,
      },
    })
      .then(async response => {
        const jsonResponse = await response.json();
        console.log('jsonResponse', jsonResponse);
        const nftArray = transformCollectionAssetsJsonResponse(
          jsonResponse.result,
        );
        dispatch({
          type: GALLERY_ACTION_TYPES.SET_GALLERY_DATA,
          payload: nftArray,
        });
      })
      .catch(error => console.log('error getting nfts', error));
  };

  const transformCollectionAssetsJsonResponse = assets => {
    const nftArray = [];
    assets.forEach(asset => {
      const {metadata, token_uri, token_address, owner_of, token_id, amount} = asset;
      if (metadata && token_uri)
        nftArray.push({
          metadata: JSON.parse(metadata),
          token_uri,
          token_address,
          owner_of,
          token_id,
          amount,
        });
    });
    return nftArray;
  };

  // const appendNewlyMintedNFT = (data) => {
  //   console.log('inAppend function dispatch is happening', data)
  //   dispatch({type: 'appendNewlyMintedNFT', payload: {metadata: data}})
  // }

  useEffect(() => {
        console.log('in if');
        getGalleryForWallet();
  }, [walletConnect]);

  const acceptedValue = useMemo(
    () => ({
      // createNFT,
      galleryData,
      postItemForSale,
      // getNFT,
    }),
    [galleryData, postItemForSale],
  );
  return (
    <ProfileContext.Provider value={acceptedValue}>
      {props.children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext: any = () => useContext(ProfileContext);

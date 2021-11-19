import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useReducer,
  useState,
  Children,
} from 'react';
import {Image} from 'react-native';
import {
  MoralisAPIKey,
  MAINET_INFURA_SECRET,
  MAINNET_NFT_MARKET_ADDRESS,
  ALTERNATIVE_MINTING_CONTRACT_ADDRESS,
  MAINNET_INFURA_ENDPOINT,
  NFTPortAPIKey,
} from '@env';
import Web3 from 'web3';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import {APIQueries} from '../constants/Queries';

export const ItemContext = createContext({
  getChildren: () => null,
  getParent: () => null,
  parents: {},
  children: {},
  handleLikePress: () => null,
});

export const ItemProvider = (props: {children: React.ReactNode}): any => {
  const wc = useWalletConnect();

  const walletAddress = wc._accounts[0];

  const [isLoadingParent, setIsLoadingParent] = useState(false);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);

  const [parents, setParent] = useState({});
  const [children, setChildren] = useState({});

  const setParentForTokenId = (tokenId, parentObject) => {
    setParent({
      ...parents,
      [tokenId]: parentObject,
    });
  };

  const setChildrenForTokenId = (tokenId, parentObject) => {
    setChildren({
      ...children,
      [tokenId]: parentObject,
    });
  };

  const getParent = async tokenId => {
    if (!!parents[tokenId] || isLoadingParent) {
      return;
    }
    setIsLoadingParent(true);
    console.log('get parent tokenId', tokenId);
    try {
      const tokenData = await getItem(tokenId);
      console.log('parent tokenData', tokenData);
      const transformedParent = transformCollectionAssetsJsonResponse([
        tokenData,
      ]);
      setParentForTokenId(tokenId, transformedParent[0]);
      setIsLoadingParent(false);
      return transformedParent[0];
    } catch (err) {
      console.log('get parent error', err);
      setIsLoadingParent(false);
    }
  };

  const getChildren = async (arrayOfTokenIds, token_id) => {
    if (!!children[token_id]) {
      return;
    }
    setIsLoadingChildren(true);
    const arrayOfChildren = [];
    let transformedChildrenArray = [];
    let ctr = 0;
    try {
      arrayOfTokenIds.forEach(async tokenId => {
        const tokenData = await getItem(tokenId);
        console.log('child tokenData', tokenData);
        if (tokenData.metadata) {
          console.log('inIf', tokenData);
          arrayOfChildren.push(tokenData);
        }
        ctr++;
        if (ctr === arrayOfTokenIds.length) {
          console.log('arrayOfChildren', arrayOfChildren);
          transformedChildrenArray =
            transformCollectionAssetsJsonResponse(arrayOfChildren);
          console.log('transformedChildrenArray', transformedChildrenArray);
          setChildrenForTokenId(token_id, transformedChildrenArray);
        }
      });
    } catch (err) {
      console.log('get children error', err);
      setIsLoadingChildren(false);
    }
    setIsLoadingChildren(false);
    return transformedChildrenArray;
  };

  const getItem = async tokenId => {
    const query = APIQueries.itemDetails.getItemByTokenId(tokenId);
    return fetch(query, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MoralisAPIKey,
      },
    })
      .then(async response => {
        const jsonResponse = await response.json();
        console.log('getItem Response', jsonResponse);
        return jsonResponse.result[0];
      })
      .catch(error => console.log('error items', error));
  };

  const transformCollectionAssetsJsonResponse = assets => {
    const nftArray = [];
    assets.forEach(asset => {
      const {metadata, token_uri, token_address, owner_of, token_id, amount} =
        asset;
      if (metadata && token_uri) {
        nftArray.push({
          metadata: JSON.parse(metadata),
          token_uri,
          token_address,
          owner_of,
          token_id,
          amount,
        });
      }
    });
    return nftArray;
  };

  const connection = new Web3(
    new Web3.providers.HttpProvider(MAINNET_INFURA_ENDPOINT, {
      headers: [
        {
          name: 'user',
          value: MAINET_INFURA_SECRET,
        },
      ],
    }),
  );

  const contract = new connection.eth.Contract(
    NFT.abi,
    ALTERNATIVE_MINTING_CONTRACT_ADDRESS,
  );

  const updateMetadataURI = async (newURI, tokenId) => {
    const data = connection.eth.abi.encodeFunctionCall(
      {
        name: 'updateTokenURI',
        type: 'function',
        inputs: [
          {
            type: 'string',
            name: 'tokenURI',
          },
          {
            type: 'uint256',
            name: 'tokenId',
          },
        ],
      },
      [newURI, tokenId],
    );
    const encodedTransaction = {
      from: wc.accounts[0],
      to: ALTERNATIVE_MINTING_CONTRACT_ADDRESS,
      data,
      gas: 500000,
    };
    try {
      const transaction = await wc.sendTransaction(encodedTransaction);
      console.log('its working', transaction);
      return transaction;
    } catch (err) {
      console.log('error updating URI', err);
    }
  };

  const updateMetadata = metaDataBody =>
    fetch('https://api.nftport.xyz/v0/metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: NFTPortAPIKey,
      },
      body: JSON.stringify(metaDataBody),
    })
      .then(async response => {
        const parsedResponse = await response.json();
        // setIsLoadingModalVisible(false)
        console.log('here2', parsedResponse);
        return parsedResponse;
      })
      .catch(err => {
        setIsLoadingModalVisible(false);
        console.error(err);
      });
  const handleLikePress = async item => {
    const {likes} = item;
    console.log(
      'includes',
      likes,
      likes.includes(walletAddress),
      walletAddress,
    );
    if (!likes?.includes(walletAddress)) {
      try {
        console.log('walletAddress(', walletAddress);
        // setIsLoadingModalVisible(true)
        // NFT port upload metadata with
        // {name, description, customfields: {...customfields, likes: [...likes, walletAddress]}}
        const metaDataBody = createAddLikeMetadataPayload(item);
        console.log('metadataBody', metaDataBody);
        const response = await updateMetadata(metaDataBody);
        console.log('likesResponse Add', response.metadata_uri, item.id); // addNewLike()
        const updateMetadataURIResponse = await updateMetadataURI(
          response.metadata_uri,
          item.id,
        );
        console.log('updateMetadataURIResponse', updateMetadataURIResponse);
      } catch (err) {
        console.log('error', err);
      }
    } else {
      try {
        setIsLoadingModalVisible(true);
        const metaDataBody = createRemoveLikeMetadataPayload(item);
        const response = await updateMetadata(metaDataBody);
        console.log('likesResponse remove', response); // removeLike()
      } catch (err) {
        console.log('error', err);
      }
    }
  };

  const createAddLikeMetadataPayload = item => {
    console.log('inAdd', walletAddress);
    const {
      title,
      tag,
      imageLink,
      likes,
      description,
      timestamp,
      parent = false,
      children = [],
      isRemix,
      file_type,
      adam = false,
    } = item;

    console.log('lere1', title);
    console.log('lere1', tag);
    console.log('lere1', imageLink.slice(8));
    console.log('lere1', likes);
    console.log('lere1', description);
    console.log('lere1', timestamp);
    console.log('lere1', parent);
    console.log('lere1', children);
    console.log('lere1', !!isRemix);
    console.log('lere1', file_type);
    console.log('lere1', adam);
    console.log('answer', [walletAddress], likes.push(walletAddress));

    return {
      name: title,
      description,
      file_url: imageLink.slice(7),
      custom_fields: {
        file_type,
        timestamp,
        likes: likes.length === 0 ? [walletAddress] : [...likes, walletAddress],
        isRemix: !!isRemix,
        parent,
        adam,
        tag,
        children,
      },
    };
  };

  const without = async x => x != walletAddress;
  const newLikesArray = likesArray => likesArray.filter(x => without(x), 4);

  const createRemoveLikeMetadataPayload = item => {
    console.log('inRemove', address);
    const {
      title,
      tag,
      imageLink,
      likes,
      description,
      timestamp,
      parent,
      children,
      file_type,
      isRemix,
      adam,
    } = item;
    return {
      name: title,
      description,
      file_url: imageLink,
      custom_fields: {
        file_type,
        timestamp,
        likes: newLikesArray(likes),
        isRemix: isRemix || false,
        parent,
        adam,
        tag,
        children,
      },
    };
  };

  const acceptedValue = useMemo(
    () => ({
      // createNFT,
      getChildren,
      getParent,
      isLoadingChildren,
      isLoadingParent,
      parents,
      children,
      handleLikePress,
      // getNFT,
    }),
    [getChildren, getParent, handleLikePress],
  );
  return (
    <ItemContext.Provider value={acceptedValue}>
      {props.children}
    </ItemContext.Provider>
  );
};

export const useItemContext: any = () => useContext(ItemContext);

export const withItemContext = (Component, options) =>
  function ItemContextFunc(props) {
    return React.createElement(
      ItemProvider,
      {...(options || {})},
      React.createElement(Component, {...props}),
    );
  };

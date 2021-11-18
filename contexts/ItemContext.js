import React, { createContext, useContext, useMemo, useEffect, useReducer, useState, Children } from 'react';
import { Image } from 'react-native'
import {
  MoralisAPIKey,
  MAINET_INFURA_SECRET,
  MAINNET_NFT_MARKET_ADDRESS,
  ALTERNATIVE_MINTING_CONTRACT_ADDRESS,
  MAINNET_INFURA_ENDPOINT,
  NFTPortAPIKey
} from '@env';
import Web3 from 'web3'
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import { APIQueries } from '../constants/Queries'

export const ItemContext = createContext({
    getChildren: () => null,
    getParent: () => null,
    parents: {},
    children: {},
    handleLikePress: () => null,
})

  export const ItemProvider = (props: { children: React.ReactNode }): any => {

    const wc = useWalletConnect()

    const walletAddress = wc._accounts[0]
    
    
    const [isLoadingParent, setIsLoadingParent] = useState(false)
    const [isLoadingChildren, setIsLoadingChildren] = useState(false)

    const [parents, setParent] = useState({})
    const [children, setChildren] = useState({})

    const setParentForTokenId = (tokenId, parentObject) => {
        setParent({
            ...parents,
            [tokenId]: parentObject
        })
    }

    const setChildrenForTokenId = (tokenId, parentObject) => {
        setChildren({
            ...children,
            [tokenId]: parentObject
        })
    }
    
    const getParent = async (tokenId) => {
        if(!!parents[tokenId] || isLoadingParent){
            return
        }
        setIsLoadingParent(true)
        console.log('get parent tokenId', tokenId)
        try{
            const tokenData = await getItem(tokenId)
            console.log('parent tokenData', tokenData)
            const transformedParent = transformCollectionAssetsJsonResponse([tokenData])
            setParentForTokenId(tokenId, transformedParent[0])
            setIsLoadingParent(false)
            return transformedParent[0]
            } catch(err) {
                console.log('get parent error', err )
                setIsLoadingParent(false)
        }
    }

    const getChildren = async (arrayOfTokenIds, token_id) => {
        if(!!children[token_id]){
            return
        }
        setIsLoadingChildren(true)
        const arrayOfChildren = []
        let transformedChildrenArray = []
        let ctr = 0;
        try{
            arrayOfTokenIds.forEach(async tokenId => {
                const tokenData = await getItem(tokenId)
                console.log('child tokenData', tokenData)
                if(tokenData.metadata){
                    console.log('inIf', tokenData)
                    arrayOfChildren.push(tokenData)
                }
                ctr++
                if(ctr === arrayOfTokenIds.length){
                    console.log('arrayOfChildren',arrayOfChildren)
                    transformedChildrenArray = transformCollectionAssetsJsonResponse(arrayOfChildren)
                    console.log('transformedChildrenArray',transformedChildrenArray)
                    setChildrenForTokenId(token_id, transformedChildrenArray)
                }
            })
        } catch (err) {
            console.log('get children error', err)
            setIsLoadingChildren(false)
        }
        setIsLoadingChildren(false)
        return transformedChildrenArray
    }

    const getItem = async (tokenId) => {
        const query = APIQueries.itemDetails.getItemByTokenId(tokenId)
        return fetch(query, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key':  MoralisAPIKey,
            },
          })
            .then(async response => {
      
              const jsonResponse = await response.json()
                console.log('getItem Response', jsonResponse)
                return jsonResponse.result[0]
            })
            .catch(error => console.log('error items', error));
        };

    const transformCollectionAssetsJsonResponse = (assets) => {
        const nftArray = []
        assets.forEach(asset => {
          const { metadata, token_uri, token_address, owner_of, token_id, amount} = asset
          if(metadata && token_uri){
          nftArray.push({metadata: JSON.parse(metadata), token_uri, token_address, owner_of, token_id, amount})
      } 
      })
        return nftArray
      }

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

    const contract = new connection.eth.Contract(NFT.abi, ALTERNATIVE_MINTING_CONTRACT_ADDRESS)

    // useEffect(async () => {
    //     console.log('here88')
    //     if(parseFloat(formValues.price) > 0 ){
    //       const priceInUSD = await getUSDConversion()
    //       console.log('priceInUSD', priceInUSD)
    //       setFormValueCallback('priceInUSD', priceInUSD)
    //     }
    //   }
    // ,[formValues.price])

    const getUSDConversion = () => new Promise((resolve, reject) => {
        const floated = parseFloat(formValues.price)
        const isWholeNumber = (floated % 1 === 0)
        const priceToNum = isWholeNumber ? floated.toFixed(2) : floated
        console.log(priceToNum)
        fetch(`https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=${parseFloat(priceToNum)}&symbol=ETH&convert=USD`,{
          method: 'GET',
          headers: {
            'X-CMC_PRO_API_KEY': coinMarketCapAPIKey,
          },
          json: true,
          gzip: true
        }).then(async response => {
          const jsonResponse = await response.json()
          console.log('conversion', jsonResponse)
          return resolve(jsonResponse.data.quote.USD.price)
        })
      })

      const handleLikePress = (tokenId) => console.log(wc._accounts[0], 'Liked', 'TokenId', tokenId)//null // eventually call social contract and whatnot

    const sellNFT = (tokenId, price, adam) => {
        try {
        const priceInWei = price * (10^-18)
        const data = connection.eth.abi.encodeFunctionCall({
            name: 'createMarketItem',
            type: 'function',
            inputs: [
                {
                    type: 'address',
                    name: 'nftContract'
                },
              {
                type: 'uint256',
                name: 'tokenId'
            },
            {
                type: 'uint256',
                name: 'price'
            },
            {
                type: 'address',
                name: 'originalCreator'
            }
          ]
        }, [ALTERNATIVE_MINTING_CONTRACT_ADDRESS, tokenId, priceInWei, adam])
        const unsignedTransaction = {
            from: wc._accounts[0],
            to: MAINNET_NFT_MARKET_ADDRESS,
            data,
            gas: 500000
        }
        try{
            const transaction = wc.sendTransaction(unsignedTransaction)
            console.log('transaction success', transaction)
            return transaction
        } catch (err) {
            console.log('SellNFT err', err)
        }
    } catch (err) {
            console.log('Error in the entire thing',err)
          }
    }

    const convertWeiToMatic = (price) => price * (10^18)

    async function buyItem(item) {
        try {
        console.log('item', item)
        const royaltyAmount = Math.floor(15 * item.price)
        const amountForSeller = Math.floor(.84 * item.price)
        const ownerAmount = Math.floor(.01 * item.price)

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

    // const createRemoveLikeMetadataPayload = (item) => {
    //     console.log('inRemove', address)
    //     const {
    //         title,
    //         tag,
    //         imageLink,
    //         likes,
    //         description,
    //         timestamp,
    //         parent,
    //         children,
    //         file_type,
    //         isRemix,
    //         adam
    //       } = item
    //     return {
    //         name: title,
    //         description,
    //         file_url: imageLink,
    //         custom_fields: {
    //             file_type,
    //             timestamp,
    //             likes: newLikesArray(likes),
    //             isRemix: isRemix || false,
    //             parent,
    //             adam,
    //             tag,
    //             children
    //         }
    //     }
    // }
    
  
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
  
  export const withItemContext = (Component, options) => function ItemContextFunc(props) {
    return (React.createElement(ItemProvider, { ...(options || {}) },
        React.createElement(Component, { ...props })));
};
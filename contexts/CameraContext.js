import React, { createContext, useContext, useMemo, useEffect, useReducer, useState } from 'react';
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

export const CameraContext = createContext({
    handleRetry: () => null,
    handleMint: () => null,
    isLoadingModalVisible: false,
    errorCode: null,
    onTrash: () => null,
    clearTransactionHash: () => null,
    transactionHash: null
})

  export const CameraProvider = (props: { children: React.ReactNode }): any => {
    
    const wc = useWalletConnect()
    const connection =new Web3(new Web3.providers.HttpProvider(MAINNET_INFURA_ENDPOINT,
      {headers: [
        {
          name: 'user', value: MAINET_INFURA_SECRET}
      ]}
    ))
    const [isLoadingModalVisible, setIsLoadingModalVisible] = useState(false)
    const [errorCode, setErrorCode] = useState(null)
    const [ipfs_url, setIPFSURL] = useState(null)
    const [metadata_uri, setMetadataURI] = useState(null)
    const [ transactionHash, setTransactionHash ] = useState(null)

    const clearTransactionHash = () => setTransactionHash(null)

    const handleRetry = (errorCode, filePath, formValues, remixedItem) => {
        setErrorCode(null)
        switch (errorCode) {
            case 0:
                handleMint(filePath, formValues, remixedItem)
                break;
                
            case 1:
                handleMetadataFailure(formValues, remixedItem, filePath)
                break;
                
            case 2:
                handleMintingFailure()
                break;
        
            default:
                break;
        }
    }

    const handleMetadataFailure = async (formValues, remixedItem, filePath) => {
        setIsLoadingModalVisible(true)
        uploadMetadata(ipfs_url, formValues, remixedItem, filePath).then(metadataResponse => {
            setMetadataURI(metadataResponse.metadata_uri)
            console.log('metadataResponse',metadataResponse)
            customMint(metadata_uri).then(response=> {
                onSuccess()
                setTransactionHash(response)
                return response
            }).catch(err =>{
                console.log('error', err)
                setErrorCode(2)
                setIsLoadingModalVisible(false)
            })
        }).catch(err => {
            // Alert.alert('Minting Failed', 'Error Code 1')
            console.log('error', err)
            setErrorCode(1)
            setIsLoadingModalVisible(false)
          })
    }

    const onSuccess = () => {
        setErrorCode(null)
        setIPFSURL(null)
        setMetadataURI(null)
    }

    const onTrash = () => onSuccess()

    const handleMintingFailure = async () => {
        setIsLoadingModalVisible(true)
        customMint(metadata_uri).then(response=> {
            setIsLoadingModalVisible(false)
            onSuccess()
            setTransactionHash(response)
            return response
            }).catch(err =>{
                console.log('error', err)
                setErrorCode(2)
                setIsLoadingModalVisible(false)
        })
    }

    const handleMint = (filePath, formValues, remixedItem) => {
        setIsLoadingModalVisible(true)
        uploadToIPFS(filePath, formValues.name).then(IPFSResponse =>{
            console.log('IPFSResponse', IPFSResponse)
            setIPFSURL(IPFSResponse.ipfs_url)
            // const { ipfs_url: URLFromResponse} = IPFSResponse.ipfs_url
            uploadMetadata(IPFSResponse.ipfs_url, formValues, remixedItem, filePath).then(metadataResponse => {
                setMetadataURI(metadataResponse.metadata_uri)
                console.log('metadataResponse',metadataResponse)
                const { metadata_uri : metadata_url } = metadataResponse
                customMint(metadata_url).then(response=> {
                    setIsLoadingModalVisible(false)
                    onSuccess()
                    setTransactionHash(response)
                    return response
                }).catch(err =>{
                    console.log('error', err)
                    setErrorCode(2)
                    setIsLoadingModalVisible(false)
                })
            }).catch(err => {
                // Alert.alert('Minting Failed', 'Error Code 1')
                console.log('error', err)
                setErrorCode(1)
                setIsLoadingModalVisible(false)
              })
            }).catch(err => {
            //   Alert.alert('Minting Failed', 'Error Code 0')
              console.log('error', err)
              setErrorCode(0)
              setIsLoadingModalVisible(false)
            })
      }
    

    const customMint = async (uri)=> {
        console.log('uri', uri)
        const data = connection.eth.abi.encodeFunctionCall({
            name: 'createToken',
            type: 'function',
            inputs: [
              {
                type: 'string',
                name: 'tokenURI'
            },
          ]
        }, [uri]);
        console.log('mintData', data)
        const encodedTransaction = {
            from: wc.accounts[0],
            to: ALTERNATIVE_MINTING_CONTRACT_ADDRESS,
            data,
            gas: 500000
        }
        try{
            const transaction = await wc.sendTransaction(encodedTransaction)
            console.log('its working', transaction)
            return transaction
        } catch(err) {
            console.log('error NFT Contract',err)
        }
    }

    const uploadMetadata = (URLFromResponse, formValues, remixedItem, filePath)=>new Promise((resolve, reject) => {
        console.log('uploadMeta URL',URLFromResponse)
        const metaDataBody = formatMetadata(URLFromResponse, formValues, remixedItem, filePath)
        console.log('metadataBody', metaDataBody)
        fetch("https://api.nftport.xyz/v0/metadata", {
          "method": "POST",
          "headers": {
            "Content-Type": "application/json",
            "Authorization": NFTPortAPIKey
          },
          "body": JSON.stringify(metaDataBody)
          })
          .then(async response => {
            const parsedResponse = await response.json()
            console.log('here2',parsedResponse);
            return resolve(parsedResponse)
          })
          .catch(err => {
            console.error(err);
            return reject(err)
        });
      })

      const uploadToIPFS = (filePath, name)=>new Promise((resolve, reject) => {
        const form = convertImageToFormData(filePath, name)
        console.log('form w/image', form)
        fetch("https://api.nftport.xyz/v0/files", {
          "method": "POST",
          "headers": {
            "Content-Type": "multipart/form-data",
            "Authorization": NFTPortAPIKey,
            "content-type": "multipart/form-data; boundary=---011000010111000001101001"
          },
          body: form
        })
        .then(async response => {
          const parsedResponse = await response.json()
          console.log('here1',parsedResponse);
          return resolve(parsedResponse)
        })
        .catch(err => {
          console.error(err);
          return reject(err)
        });
      })

    // Helpers

    const formatMetadata = (URLFromResponse, formValues, remixedItem, filePath) => {
        const { name, description, tag } = formValues
        const likes = []
        const timestamp = Date.now()
        const file_url = URLFromResponse
        const file_type =  getFileType(filePath)
        const dimensions = file_type === 'image' ? Image.getSize(filePath, (width, height)=> ({width, height})): null
        const custom_fields = {
            tag,
          likes,
          timestamp,
          file_type,
          ...dimensions,
          isRemix: !!remixedItem || false, // update later
          parent: remixedItem?.token_id || '', //
          adam: remixedItem?.metadata?.adam || wc._accounts[0]
        }
        console.log('formated meta', custom_fields,
        name,
        description,
        file_url)
        return {
          custom_fields,
          name,
          description,
          file_url
        }
      }

    const convertImageToFormData = (filePath, name) => {
        const form = new FormData();
        // const {uri}Image.resolveAssetSource(filePath)
        // @ts-ignore
        if (filePath.endsWith('.mp4')) {
            form.append('file', { uri: filePath, name, type: 'video/mp4' });
        } else if (filePath.endsWith('.mov')) {
            form.append('file', { uri: filePath, name, type: 'video/mov' });
        } else if (filePath.endsWith('.jpeg')) {
            form.append('file', { uri: filePath, name, type: 'image/jpeg' });
        } else {
            form.append('file', { uri: filePath, name, type: 'image/jpg' });
        }
        console.log('converting form', form, filePath, name)
        return form;
      };
  
      const getFileType = (filePath) =>{
        if (filePath.endsWith('.mp4') || filePath.endsWith('.mov')) {
          return 'video'
        } else {
          return 'image'
        }
      }
    // useEffect(() => {
    //   (async () => {
    //       getMarketPlaceItems();
    //       getFeedItems()
    //   })();
    // }, [walletConnect]);
    // useEffect(() => {
        
    //   }, [wc]);
    
  
    const acceptedValue = useMemo(
      () => ({
          // createNFT,
          errorCode,
          handleMint,
          isLoadingModalVisible,
          handleRetry,
          onTrash,
          transactionHash,
          clearTransactionHash
          // getNFT,
      }),
      [handleMint, isLoadingModalVisible, errorCode, handleRetry, onTrash, transactionHash, clearTransactionHash],
    );
    return (
      <CameraContext.Provider value={acceptedValue}>
        {props.children}
      </CameraContext.Provider>
    );
  };
  
  export const useCameraContext: any = () => useContext(CameraContext);
  
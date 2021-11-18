import { ALTERNATIVE_MINTING_CONTRACT_ADDRESS } from '@env'

export const APIQueries = {
    feed: {
        getFeedNFTs: `https://deep-index.moralis.io/api/v2/nft/${ALTERNATIVE_MINTING_CONTRACT_ADDRESS}/owners?chain=polygon&format=decimal&offset=0&limit=50&order=block_number.DESC`,
        getFeedNFTsNextPage: (offset)=>`https://deep-index.moralis.io/api/v2/nft/${ALTERNATIVE_MINTING_CONTRACT_ADDRESS}?chain=polygon&format=decimal&offset=${offset}&limit=50&order=DESC`,
        getItemsForSale: '', // call method on contract
    },
    camera: {
        uploadToIPFS: "https://api.nftport.xyz/v0/files",
        uploadMetadata: "https://api.nftport.xyz/v0/metadata",
        customMintNFTPort: "https://api.nftport.xyz/v0/mints/customizable",
    },
    profile: {
        getUsersCreations: (walletAddress) => `https://deep-index.moralis.io/api/v2/${walletAddress}/nft/${ALTERNATIVE_MINTING_CONTRACT_ADDRESS}?chain=polygon&format=decimal`,
        getUsersItemsForSale: ``, // call method on contract
        postItemForSale: `postItem`, // call method on contract
        updateMetadata: 'https://api.nftport.xyz/v0/metadata', // 
    },
    itemDetails: {
        purchaseItem: `buyItem`, // call method on contract
        getItemByTokenId: (tokenId) => `https://deep-index.moralis.io/api/v2/nft/${ALTERNATIVE_MINTING_CONTRACT_ADDRESS}/${tokenId}/owners?chain=polygon&format=decimal`, // should already have it
        addLike: 'addLike', // Updating the metadata on an item
        removeLike: 'removeLike', // Updating the metadata on an item
    }
}
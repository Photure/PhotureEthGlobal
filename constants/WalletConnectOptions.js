import React from 'react'
import { Platform, AsyncStorage } from "react-native"
import CustomBottomSheet from '../components/customWCModal'

const iosWCOptions = {
bridge:"https://bridge.walletconnect.org",
clientMeta:{
    description: 'Connect with WalletConnect',
    url: 'https://photure.app',
    icons: ['https://walletconnect.org/walletconnect-logo.png'],
    name: 'Photure',
},
redirectUrl:'photure://',
renderQrcodeModal:(props)=><CustomBottomSheet {...props}/>,
storageOptions: {
    asyncStorage: AsyncStorage,
},
qrcodeModalOptions: {
    mobileLinks: [
    'rainbow',
    'trust',
]}}

const androidWCOptions = {
    bridge:"https://bridge.walletconnect.org",
    clientMeta:{
        description: 'Connect with WalletConnect',
        url: 'https://photure.app',
        icons: ['https://walletconnect.org/walletconnect-logo.png'],
        name: 'Photure',
    },
    redirectUrl:'photure://',
    // renderQrcodeModal:(props)=><CustomBottomSheet {...props}/>,
    storageOptions: {
        asyncStorage: AsyncStorage,
    },
    qrcodeModalOptions: {
        mobileLinks: [
        'rainbow',
        'trust',
    ]}}

    export default Platform.OS === 'android' ? androidWCOptions : iosWCOptions
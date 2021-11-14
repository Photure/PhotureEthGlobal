import React from 'react';

import {withWalletConnect} from '@walletconnect/react-native-dapp';
import WalletConnectOptions from './constants/WalletConnectOptions';

import {NativeBaseProvider, extendTheme} from 'native-base';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Navigation from './navigation';

const config = {
  useSystemColorMode: true,
  initialColorMode: 'dark',
};

const customTheme = extendTheme({config});

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NativeBaseProvider theme={customTheme} config={config}>
        <Navigation />
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
};

export default withWalletConnect(App, WalletConnectOptions);

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Modal
} from 'react-native';
// import FastImage from 'react-native-fast-image'

  import { useWalletConnect } from '@walletconnect/react-native-dapp';


export default function CustomBottomSheet({
    walletServices,
    visible,
    connectToWalletService,
    setShowModal,
    uri,
  }) {
    console.log('connect to wallet', walletServices, uri)
    const RenderContent = ({item}) => {
      const wc = useWalletConnect()
      return (
        <TouchableOpacity style={{width: '100%'}} key={`i${item.index}`} onLongPress={()=> wc._qrcodeModal.close()} onPress={() => connectToWalletService(item.item, uri)}>
          <View style={{flex:1, flexDirection: 'row', paddingBottom: 20}}>
          <View style={styles.imageContainer}>
            <Image 
              source={{
                uri: `https://registry.walletconnect.org/logo/sm/${item.item.id}.jpeg`,
              }}
              style={styles.image}
              resizeMode={'contain'}
            />
          </View>
          <View style={styles.name}>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>{item.item.name}</Text>
          </View>
          {/* <View style={styles.imageContainer}>
            <Arrow/>
          </View> */}
  
        </View>
        </TouchableOpacity>
      );
    };
  
    const listOfPrefferedWallets = ['MetaMask', 'Trust Wallet', 'Rainbow']
    return (
      <View style={{...styles.centeredView, display: visible ? '' : 'none'}}>
        <Modal
          animationType={'fade'}
          visible={visible}
          transparent={true}
          >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{alignSelf: 'center', paddingBottom: 20}}>Choose Preffered Wallet</Text>
                { !uri ? <ActivityIndicator size={'large'}/>
                :
                <View style={{flex:1}}>
                  <FlatList
                    data={walletServices}
                    // contentContainerStyle={styles.list}
                    renderItem={(item) =>{
                      console.log('item', item)
                      return listOfPrefferedWallets.includes(item.item.name) ? <RenderContent item={item}/> : null}}
                  />
                  </View>
                }
            </View>
          </View>
        </Modal>
     </View>
      );
  };

  const styles = StyleSheet.create({
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
    image: {
      height: 50,
      width: 50,
      // flex: 1
    },
    FlatList: {
      flex:1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    itemContainer: {
      flex:1,
      // marginHorizontal: 20,
      // justifyContent: 'center',
      // alignItems:'center',
      flexDirection: 'row'
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      // display: 'flex',
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      height:'50%',
      width:'80%',
      padding: 35,
      // alignItems: "center",
      // justifyContent: 'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    name: {
      flex: 1,
      display: 'flex',
      alignSelf: 'center'
    },
    imageContainer: {
      flex: 1,
      justifyContent:'center',
      alignItems:'center',
      display: 'flex',
    }
  });
  
import React, {useState, useRef, useEffect, useContext} from 'react';
import {Animated, Dimensions, StatusBar, TouchableOpacity} from 'react-native';
import web3 from 'web3';
import {useColorMode, useTheme, FlatList, Box} from 'native-base';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import {MAINNET_INFURA_ENDPOINT, MAINNET_NFT_MARKET_ADDRESS} from '@env';
import SegmentControl from 'react-native-animated-segment-control';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PagerView} from 'react-native-pager-view';
import {PESDK, PhotoEditorModal} from 'react-native-photoeditorsdk';
import {configuration} from './data';

import Card from '../../components/Card/Card';

import Market from '../../artifacts/contracts/Market.sol/NFTMarket.json';
import {useFeedContext} from '../../contexts/FeedContext';

import PhotoFormModal from '../../components/PhotoFormModal';
import {CameraContext} from '../../contexts/CameraContext';
import {AlertModal} from '../../components/AlertDialog';
import {SuccessModal} from '../../components/SuccessModal';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const useLazyRef = initializer => {
  const ref = useRef();

  if (ref.current === undefined) {
    ref.current = initializer();
  }
  return ref.current;
};

export default function FeedScreen({navigation}) {
  const {feedData = [], marketData} = useFeedContext();
  const {colorMode} = useColorMode();
  const {colors} = useTheme();
  const [itemToRemix, setItemToRemix] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [previewImageURI, setPreviewImageURI] = useState(
    'https://via.placeholder.com/150',
  );

  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    tag: '',
  });

  const [showPreview, setShowPreview] = useState(false);
  const [visibleIndex, setVisibleIndex] = useState(0);

  const {height: wHeight, width} = Dimensions.get('window');
  const cardHeight = (wHeight - 20) / 2.3;

  const {
    handleMint,
    handleRetry,
    isLoadingModalVisible,
    errorCode,
    onTrash,
    transactionHash,
    clearTransactionHash,
  } = useContext(CameraContext);

  const wc = useWalletConnect();

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  useEffect(() => {
    PESDK.unlockWithLicense(require('../../pesdk_ios_license.json'));
  }, []);

  const yOne = useLazyRef(() => new Animated.Value(0));
  const onScrollOne = useLazyRef(() =>
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {y: yOne},
          },
        },
      ],
      {useNativeDriver: true},
    ),
  );
  useEffect(() => {
    console.log(wc);
    if (
      (!wc.connected && wc?.connect) ||
      (!wc?.session?.connected && wc?.connect)
    ) {
      wc.connect({
        chainId: 137,
      });
    }
  }, [wc.connected]);

  if (wc.on) {
    wc.on('connect', () => wc._qrcodeModal.close());
  }

  const yTwo = useLazyRef(() => new Animated.Value(0));
  const onScrollTwo = useLazyRef(() =>
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {y: yTwo},
          },
        },
      ],
      {useNativeDriver: true},
    ),
  );

  const yThree = useLazyRef(() => new Animated.Value(0));
  const onScrollThree = useLazyRef(() =>
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {y: yThree},
          },
        },
      ],
      {useNativeDriver: true},
    ),
  );

  const [scrollIndex, setScrollIndex] = useState(0);
  const w3 = new web3(
    new web3.providers.HttpProvider(MAINNET_INFURA_ENDPOINT, {
      headers: [
        {
          name: 'user',
          value: 'dbc65643a1c44d4a877d8173762085eb',
        },
      ],
    }),
  );
  // const latest = async () => await w3.eth.getBlockNumber()
  const contract = new w3.eth.Contract(Market.abi, MAINNET_NFT_MARKET_ADDRESS);
  const maticMumbaiCreateSessionParams = {
    chainId: 80001,
  };
  const updateChainParams = {
    chainId: 80001,
    networkId: 1337,
    rpcUrl: 'https://rpc-mumbai.matic.today',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
    },
  };

  const swipeRef = useRef(null);

  console.log('remixedItem', itemToRemix);

  const transformFeedData = () => {
    console.log('feedDataInTransform', feedData);
    const dataForFlatlist = [];
    feedData.forEach((item, index) => {
      console.log('need to grab everything off Item', item.metadata);

      const {token_id: id, owner_of: walletAddress = '', price: date} = item;
      const {
        image: imageLink = 'https://via.placeholder.com/150',
        name: title,
        tag,
        children = [],
        likes = [],
        description,
        timestamp,
        parent,
        adam,
        file_type,
      } = item.metadata;

      dataForFlatlist.push({
        id,
        title,
        walletAddress: walletAddress || '',
        date,
        tag: !!tag ? tag : 'Nature',
        imageLink,
        children,
        likes,
        description,
        timestamp,
        parent,
        adam,
        file_type,
      });
    });
    return dataForFlatlist;
  };

  console.log('feedDataInTransform', feedData);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          colorMode === 'light' ? colors.gray['50'] : colors.gray['900'],
      }}>
      <Box
        flex={1}
        _light={{
          bg: 'gray.50',
        }}
        _dark={{
          bg: 'gray.900',
        }}>
        <SegmentControl
          values={['TOP', 'RAW', 'EDITS']}
          onChange={currentIndex => {
            swipeRef.current.setPageWithoutAnimation(currentIndex);
          }}
          selectedIndex={scrollIndex}
          disable={false}
          activeSegmentStyle={{
            borderRadius: 10,
            backgroundColor:
              colorMode === 'light' ? colors.gray['400'] : colors.gray['600'],
          }}
          segmentControlStyle={{
            borderRadius: 10,
            backgroundColor:
              colorMode === 'light' ? colors.gray['300'] : colors.gray['700'],
          }}
          selectedTextStyle={{
            fontWeight: 'bold',
            color:
              colorMode === 'light'
                ? colors.indigo['600']
                : colors.indigo['400'],
          }}
          unSelectedTextStyle={{
            fontWeight: 'bold',
            color: colorMode === 'light' ? colors.black : colors.white,
          }}
          style={{
            marginBottom: 10,
            borderRadius: 10,
            marginHorizontal: 16,
            backgroundColor:
              colorMode === 'light' ? colors.gray['200'] : colors.gray['800'],
          }}
        />
        <PagerView
          style={{flex: 1, alignItems: 'center'}}
          initialPage={scrollIndex}
          ref={swipeRef}
          onPageSelected={e => {
            setScrollIndex(e.nativeEvent.position);
          }}>
          <Box
            key="1"
            paddingLeft={4}
            paddingRight={4}
            width="100%"
            height="100%">
            <AnimatedFlatList
              ref={ref1}
              borderRadius={16}
              _light={{
                bg: 'gray.200',
              }}
              _dark={{
                bg: 'gray.800',
              }}
              px={4}
              data={transformFeedData()}
              renderItem={({item, index}) => (
                <Card
                  {...item}
                  y={yOne}
                  sharedElementIdSuffix={'one'}
                  index={index}
                  onPress={() => {
                    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$', item.id);
                    navigation.push('ItemDetails', {
                      item,
                      sharedElementIdSuffix: 'one'
                    });
                    StatusBar.setHidden(true, 'slide');
                  }}
                  onEditPress={() => {
                    console.log('onEditPress', item);
                    setItemToRemix(item);
                    setShowPreview(true);
                    console.log(feedData[index].metadata.image);
                    setPreviewImageURI(feedData[index].metadata.image);
                  }}
                />
              )}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              bounces={false}
              getItemLayout={(data, index) => ({
                length: cardHeight,
                offset: cardHeight * index,
                index,
              })}
              {...{onScroll: onScrollOne}}
            />
          </Box>
          <Box
            key="2"
            paddingLeft={4}
            paddingRight={4}
            width="100%"
            height="100%">
            <AnimatedFlatList
              ref={ref2}
              borderRadius={16}
              _light={{
                bg: 'gray.200',
              }}
              _dark={{
                bg: 'gray.800',
              }}
              px={4}
              data={transformFeedData()}
              renderItem={({item, index}) => (
                <Card
                  {...item}
                  sharedElementIdSuffix={'two'}
                  y={yTwo}
                  index={index}
                  onPress={() => {
                    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$', item.id);
                    navigation.push('ItemDetails', {
                      item,
                      sharedElementIdSuffix: 'two'
                    });
                    StatusBar.setHidden(true, 'slide');
                  }}
                  onEditPress={() => {
                    console.log('onEditPress', item);
                    setItemToRemix(item);
                    setShowPreview(true);
                    setPreviewImageURI(feedData[index].metadata.image);
                  }}
                />
              )}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              bounces={false}
              getItemLayout={(data, index) => ({
                length: cardHeight,
                offset: cardHeight * index,
                index,
              })}
              {...{onScroll: onScrollTwo}}
            />
          </Box>
          <Box
            key="3"
            paddingLeft={4}
            paddingRight={4}
            width="100%"
            height="100%">
            <AnimatedFlatList
              ref={ref3}
              borderRadius={16}
              _light={{
                bg: 'gray.200',
              }}
              _dark={{
                bg: 'gray.800',
              }}
              px={4}
              data={transformFeedData()}
              renderItem={({item, index}) => (
                <Card
                  {...item}
                  y={yThree}
                  index={index}
                  sharedElementIdSuffix={'three'}
                  onPress={() => {
                    navigation.push('ItemDetails', {
                      item,
                      sharedElementIdSuffix: 'three'
                    });
                    StatusBar.setHidden(true, 'slide');
                  }}
                  onEditPress={() => {
                    console.log('onEditPress', item);
                    setItemToRemix(item);
                    setShowPreview(true);
                    setPreviewImageURI(feedData[index].metadata.image);
                  }}
                />
              )}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              bounces={false}
              getItemLayout={(data, index) => ({
                length: cardHeight,
                offset: cardHeight * index,
                index,
              })}
              {...{onScroll: onScrollThree}}
            />
          </Box>
        </PagerView>
        <Box my={10} />
      </Box>
      <PhotoFormModal
        setFormValues={setFormValues}
        handleMint={handleMint}
        showModal={showModal}
        setShowModal={setShowModal}
        filePath={previewImageURI}
        formValues={formValues}
        remixedItem={itemToRemix}
      />
      {errorCode !== null && errorCode >= 0 && (
        <AlertModal
          errorCode={errorCode}
          handleRetry={handleRetry}
          filePath={previewImageURI}
          formValues={formValues}
          remixedItem={itemToRemix}
        />
      )}
      {!!transactionHash && (
        <SuccessModal
          clearTransactionHash={clearTransactionHash}
          transactionHash={transactionHash}></SuccessModal>
      )}
      {
        <PhotoEditorModal
          image={{uri: previewImageURI}}
          onExport={photoEditorResult => {
            console.log(previewImageURI);
            //setShowPreview(false);
            setShowModal(true);
            setPreviewImageURI(photoEditorResult.image);
          }}
          onCancel={() => {
            setShowPreview(false);
          }}
          visible={showPreview}
          configuration={configuration}
        />
      }
    </SafeAreaView>
  );
}

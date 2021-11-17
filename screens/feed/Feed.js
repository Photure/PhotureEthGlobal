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

const dataTwo = [
  {
    id: '11',
    title: 'Tree Walk',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Nature',
    imageLink:
      'https://s3.amazonaws.com/crowdriff-media/mirror/6315b0b40448afe22a7a15f3231b2e4298aa16b334f757e20a089415120eee5a.jpg',
  },
  {
    id: '12',
    title: 'Square Flower',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Flower',
    imageLink:
      'https://www.thisiscolossal.com/wp-content/uploads/2016/07/flower-1.jpg',
  },
  {
    id: '13',
    title: 'Whats up?',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Sky',
    imageLink: 'https://images.wsj.net/im-298298?width=1280&size=1',
  },
  {
    id: '14',
    title: 'Petal to the City',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Statue',
    imageLink:
      'https://res.cloudinary.com/atlanta/images/f_auto,q_auto/v1599799897/newAtlanta.com/hero_outdoors_lg-1/hero_outdoors_lg-1.jpg?_i=AA',
  },
  {
    id: '15',
    title: 'My Christmas Flower',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Flower',
    imageLink:
      'https://www.gardeningknowhow.com/wp-content/uploads/2016/02/poinsettia-outdoors.jpg',
  },
  {
    id: '16',
    title: 'River Trip',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Water',
    imageLink:
      'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
  },
  {
    id: '17',
    title: 'Mountain Trail',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Fall',
    imageLink:
      'https://bigseventravel.com/wp-content/uploads/2020/06/Screen-Shot-2020-06-24-at-2.51.41-PM.png',
  },
  {
    id: '18',
    title: 'Fire in the Field',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Fire',
    imageLink:
      'https://assets.newatlas.com/dims4/default/0412114/2147483647/strip/true/crop/2500x1666+0+0/resize/728x485!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2F68%2F38%2F1eaf35774e1ab0427ac04a664d65%2Foriginal-2.jpg',
  },
  {
    id: '19',
    title: 'Port of Pier',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'City',
    imageLink:
      'https://i.insider.com/577fc85c88e4a7531b8b6941?width=1136&format=jpeg',
  },
  {
    id: '20',
    title: 'Cold River',
    walletAddress: 'Paula Green',
    date: '15th June 2021',
    tag: 'Winter',
    imageLink:
      'https://cdn.outdoors.org/wp-content/uploads/2021/11/03080225/Maine-Woods-Photo-by-Cait-Bourgault_Photos-93.jpg',
  },
];

const dataThree = [
  {
    id: '21',
    title: 'Tree Walk',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Nature',
    imageLink:
      'https://s3.amazonaws.com/crowdriff-media/mirror/6315b0b40448afe22a7a15f3231b2e4298aa16b334f757e20a089415120eee5a.jpg',
  },
  {
    id: '22',
    title: 'Square Flower',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Flower',
    imageLink:
      'https://www.thisiscolossal.com/wp-content/uploads/2016/07/flower-1.jpg',
  },
  {
    id: '23',
    title: 'Whats up?',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Sky',
    imageLink: 'https://images.wsj.net/im-298298?width=1280&size=1',
  },
  {
    id: '24',
    title: 'Petal to the City',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Statue',
    imageLink:
      'https://res.cloudinary.com/atlanta/images/f_auto,q_auto/v1599799897/newAtlanta.com/hero_outdoors_lg-1/hero_outdoors_lg-1.jpg?_i=AA',
  },
  {
    id: '25',
    title: 'My Christmas Flower',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Flower',
    imageLink:
      'https://www.gardeningknowhow.com/wp-content/uploads/2016/02/poinsettia-outdoors.jpg',
  },
  {
    id: '26',
    title: 'River Trip',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Water',
    imageLink:
      'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
  },
  {
    id: '27',
    title: 'Mountain Trail',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Fall',
    imageLink:
      'https://bigseventravel.com/wp-content/uploads/2020/06/Screen-Shot-2020-06-24-at-2.51.41-PM.png',
  },
  {
    id: '28',
    title: 'Fire in the Field',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Fire',
    imageLink:
      'https://assets.newatlas.com/dims4/default/0412114/2147483647/strip/true/crop/2500x1666+0+0/resize/728x485!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2F68%2F38%2F1eaf35774e1ab0427ac04a664d65%2Foriginal-2.jpg',
  },
  {
    id: '29',
    title: 'Port of Pier',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'City',
    imageLink:
      'https://i.insider.com/577fc85c88e4a7531b8b6941?width=1136&format=jpeg',
  },
  {
    id: '30',
    title: 'Cold River',
    walletAddress: 'Paula Green',
    date: '15th June 2021',
    tag: 'Winter',
    imageLink:
      'https://cdn.outdoors.org/wp-content/uploads/2021/11/03080225/Maine-Woods-Photo-by-Cait-Bourgault_Photos-93.jpg',
  },
];

export default function FeedScreen({navigation}) {
  const {feedData, marketData} = useFeedContext();
  const {colorMode} = useColorMode();
  const {colors} = useTheme();

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
    if (!wc.connected && wc?.connect) {
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

  console.log('feedData, marketData', feedData, marketData);

  const transformFeedData = () => {
    const dataForFlatlist = [];
    feedData.forEach((item, index) => {
      const {token_id: id, owner_of: walletAddress = '', price: date} = item;
      const {image: imageLink, name: title, tag} = item.metadata;

      dataForFlatlist.push({
        id,
        title,
        walletAddress: walletAddress || '',
        date,
        tag: !!tag ? tag : 'Nature',
        imageLink,
      });
    });
    return dataForFlatlist;
  };

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
                  index={index}
                  onPress={() => {
                    navigation.push('ItemDetails', {
                      item,
                    });
                    StatusBar.setHidden(true, 'slide');
                  }}
                  onEditPress={() => {
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
              data={dataTwo}
              renderItem={({item, index}) => (
                <Card
                  {...item}
                  y={yTwo}
                  index={index}
                  onPress={() => {
                    navigation.push('ItemDetails', {
                      item,
                    });
                    StatusBar.setHidden(true, 'slide');
                  }}
                  onEditPress={() => {
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
              data={dataThree}
              renderItem={({item, index}) => (
                <Card
                  {...item}
                  y={yThree}
                  index={index}
                  onPress={() => {
                    navigation.push('ItemDetails', {
                      item,
                    });
                    StatusBar.setHidden(true, 'slide');
                  }}
                  onEditPress={() => {
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
        remixedItem={null}
      />
      {errorCode !== null && errorCode >= 0 && (
        <AlertModal
          errorCode={errorCode}
          handleRetry={handleRetry}
          filePath={previewImageURI}
          formValues={formValues}
          remixedItem={null}
        />
      )}
      {!!transactionHash && (
        <SuccessModal
          clearTransactionHash={clearTransactionHash}
          transactionHash={transactionHash}></SuccessModal>
      )}
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
    </SafeAreaView>
  );
}

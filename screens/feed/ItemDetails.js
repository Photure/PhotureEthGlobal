import React, {useRef, useState, useContext, useEffect} from 'react';
import {Image, useWindowDimensions, StatusBar, Pressable} from 'react-native';
import {
  Box,
  VStack,
  Stack,
  HStack,
  Avatar,
  Text,
  Badge,
  Button,
  Heading,
} from 'native-base';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {PhotoEditorModal} from 'react-native-photoeditorsdk';

import Carousel from 'react-native-snap-carousel';

import {Edit} from '../../icons/Edit';
import {HeartOutline} from '../../icons/HeartOutline';
import {HeartFilled} from '../../icons/HeartFilled';

import {
  PanGestureHandler,
  NativeViewGestureHandler,
} from 'react-native-gesture-handler';

import {SharedElement} from 'react-navigation-shared-element';
import ScreenCard from '../../components/Card/ScreenCard';

import ProfileCard from '../../components/ProfileCard/ProfileCard';

import {SvgUri} from 'react-native-svg';

import {
  ItemProvider,
  useItemContext,
  withItemContext,
} from '../../contexts/ItemContext';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import {CameraContext} from '../../contexts/CameraContext';
import {configuration} from './data';
import PhotoFormModal from '../../components/PhotoFormModal';
import {AlertModal} from '../../components/AlertDialog';
import BuyModal from '../../components/BuyModal';
import SellModal from '../../components/SellModal';
import SuccessModal from '../../components/SuccessModal';

const ItemDetails = ({navigation, route}) => {
  const {
    getParent,
    getChildren,
    isLoadingChildren,
    isLoadingParent,
    parents,
    children,
    handleLikePress,
    sellNFT,
    getUSDConversion,
    buyNFT,
    clearTransactionHashItem,
    transactionHashItem,
  } = useItemContext();
  let hasBeenCalled = false;
  const scrollY = useSharedValue(0);

  const [showModal, setShowModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);

  const [previewImageURI, setPreviewImageURI] = useState(
    'https://via.placeholder.com/150',
  );

  const [showPreview, setShowPreview] = useState(false);

  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    tag: '',
  });

  const {item, sharedElementIdSuffix} = route.params;
  const name = route.name;

  const wc = useWalletConnect();

  const USER_WALLET_ADDRESS = wc._accounts[0];
  const isYourNFT =
    USER_WALLET_ADDRESS.toLowerCase() === item.walletAddress.toLowerCase();

  console.log('walletAddress!!', USER_WALLET_ADDRESS, item.walletAddress);

  const {width, height} = useWindowDimensions('window');
  const isGestureActive = useSharedValue(false);

  const scale = useSharedValue(1);
  let priceInUSD = 0;
  useEffect(() => {
    (async () => {
      priceInUSD = await getUSDConversion(item.isItemForSale.price);
    })();
  }, [item.id]);

  console.log('before hasParent', parents[item.id], item.id, parents);

  const hasParent = parents[item.id];

  useEffect(() => {
    // Also interact with Market contract to see if item on sale
    // Interact with social contract to get parent and children. Parent will be on metadata.

    getParent(item.parent, item.id);
    getChildren([1], item.id);
  }, [item.id]);

  const transfromParent = parent => {
    return transformItemData([parent])[0];
  };

  const transformItemData = arrayOfItems => {
    const dataForFlatlist = [];
    console.log('arrayOfItems', arrayOfItems);
    arrayOfItems.forEach((item, index) => {
      const {token_id: id, owner_of: walletAddress = '', price: date} = item;
      const {
        image: imageLink,
        name: title,
        tag,
        children = [],
        likes = [],
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
      });
    });
    return dataForFlatlist;
  };

  const {
    handleMint,
    handleRetry,
    isLoadingModalVisible,
    errorCode,
    onTrash,
    transactionHash,
    clearTransactionHash,
  } = useContext(CameraContext);

  const goBack = () => {
    if (!hasBeenCalled) {
      StatusBar.setHidden(false, 'slide');
      navigation.pop();
      hasBeenCalled = true;
    }
  };

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: () => {
      isGestureActive.value = true;
    },
    onActive: ({velocityY, velocityX, translationX}) => {
      if (velocityY > 0 && scale.value > 0.89 && scrollY.value === 0) {
        scale.value -= 0.01;
      } else if (velocityX > 550 && scale.value > 0.999) {
        scale.value -= 0.01;
      } else if (velocityX > 0 && scale.value < 0.999 && scale.value > 0.89) {
        scale.value -= 0.01;
      } else if (scale.value < 0.89 && scrollY.value === 0) {
        runOnJS(goBack)();
      } else if ((velocityY < 0 || velocityX < 0) && scale.value < 1) {
        scale.value += 0.01;
      }
    },
    onEnd: () => {
      isGestureActive.value = false;
      if (scale.value > 0.9) {
        scale.value = withSpring(1);
      } else {
        runOnJS(goBack)();
      }
    },
  });

  const uas = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  const onehundred = () => {
    switch (item.tag) {
      case 'Nature':
        return 'green.100';
      case 'Flower':
        return 'rose.100';
      case 'Sky':
        return 'lightBlue.100';
      case 'Statue':
        return 'muted.100';
      case 'Water':
        return 'blue.100';
      case 'Fall':
        return 'orange.100';
      case 'Meme':
        return 'red.100';
      case 'Landmarks':
        return 'purple.100';
      case 'Art':
        return 'blueGray.100';
    }
  };

  const twohundred = () => {
    switch (item.tag) {
      case 'Nature':
        return 'green.200';
      case 'Flower':
        return 'rose.200';
      case 'Style':
        return 'lightBlue.200';
      case 'Statue':
        return 'muted.200';
      case 'Water':
        return 'blue.200';
      case 'Fall':
        return 'orange.200';
      case 'Meme':
        return 'red.200';
      case 'Landmarks':
        return 'purple.200';
      case 'Art':
        return 'blueGray.200';
    }
  };

  const fivehundred = () => {
    switch (item.tag) {
      case 'Nature':
        return 'green.500';
      case 'Flower':
        return 'rose.500';
      case 'Sky':
        return 'lightBlue.500';
      case 'Statue':
        return 'muted.500';
      case 'Water':
        return 'blue.500';
      case 'Fall':
        return 'orange.500';
      case 'Meme':
        return 'red.500';
      case 'Landmarks':
        return 'purple.500';
      case 'Art':
        return 'blueGray.500';
    }
  };

  const sevenhundred = () => {
    switch (item.tag) {
      case 'Nature':
        return 'green.700';
      case 'Flower':
        return 'rose.700';
      case 'Sky':
        return 'lightBlue.700';
      case 'Statue':
        return 'muted.700';
      case 'Water':
        return 'blue.700';
      case 'Fall':
        return 'orange.700';
      case 'Meme':
        return 'red.700';
      case 'Landmarks':
        return 'purple.700';
      case 'Art':
        return 'blueGray.700';
    }
  };

  const drawer = useRef();
  const scroll = useRef();

  const handleOnScroll = event => {
    //calculate screenIndex by contentOffset and screen width
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  const [likePressed, setLikePressed] = React.useState(false);

  console.log('parents, children', parents, children);

  const getKey = () => {
    let key = 0;
    Object.keys(parents).forEach(i => {
      console.log('foreach', i, item.id);
      key = i === item.id && i.toString();
    });
    return key;
  };
  const transformedParent =
    getKey() !== 0 && parents[getKey()]
      ? transfromParent(parents[getKey()])
      : null;

  const transformedChildren =
    getKey() !== 0 && children[getKey()]
      ? transformItemData(children[getKey()])
      : null;

  console.log('with key', getKey(), parents[getKey()], children[getKey()]);
  console.log('transformed', transformedChildren, transformedParent);
  console.log('*****************', item);
  return (
    <Box
      flex={1}
      _light={{
        bg: 'gray.50',
      }}
      _dark={{
        bg: 'gray.900',
      }}>
      <PanGestureHandler
        ref={drawer}
        simultaneousHandlers={scroll}
        shouldCancelWhenOutside={false}
        onGestureEvent={onGestureEvent}>
        <Animated.View style={uas}>
          <NativeViewGestureHandler
            ref={scroll}
            waitFor={this.masterdrawer}
            simultaneousHandlers={drawer}>
            <Animated.ScrollView
              onScroll={e => handleOnScroll(e)}
              bounces={false}
              showsVerticalScrollIndicator={false}
              onScrollBeginDrag={this.onRegisterLastScroll}
              scrollEventThrottle={1}>
              <SharedElement
                id={`item.${item.id}.photo.${sharedElementIdSuffix}`}>
                <Image
                  source={{
                    uri: item.imageLink,
                  }}
                  style={{
                    resizeMode: 'cover',
                    width: '100%',
                    height: width,
                  }}
                />
              </SharedElement>
              <VStack
                flex={1}
                mx={2}
                _light={{
                  bg: 'gray.200',
                }}
                _dark={{
                  bg: 'gray.800',
                }}>
                <SharedElement
                  id={`item.${item.id}.card.${sharedElementIdSuffix}`}>
                  <Stack
                    p={4}
                    mx={6}
                    bottom={5}
                    borderRadius="lg"
                    _light={{
                      bg: 'gray.50',
                      opacity: 0.8,
                    }}
                    _dark={{
                      bg: 'gray.700',
                      opacity: 0.8,
                    }}>
                    <Stack space={1} shadow={2}>
                      {!isYourNFT && (
                        <HStack space={1} size="sm" alignItems="center">
                          <SvgUri
                            width="30"
                            height="30"
                            uri={`https://avatars.dicebear.com/api/pixel-art/${item.walletAddress}.svg`}
                          />
                          <Text
                            fontSize="sm"
                            _light={{
                              c: 'gray.500',
                            }}
                            _dark={{
                              c: 'gray.700',
                            }}>
                            {`${item.walletAddress.substring(
                              0,
                              4,
                            )}...${item.walletAddress.substring(
                              item.walletAddress.length - 4,
                              item.walletAddress.length,
                            )}`}
                          </Text>
                        </HStack>
                      )}
                      <Text
                        fontSize="xl"
                        _light={{
                          color: 'black',
                        }}
                        _dark={{
                          color: 'white',
                        }}>
                        {item.title}
                      </Text>
                      <Text
                        fontSize="sm"
                        _light={{
                          c: 'gray.500',
                        }}
                        _dark={{
                          c: 'gray.700',
                        }}>
                        {item.date}
                      </Text>
                    </Stack>
                  </Stack>
                </SharedElement>
                <HStack mx={6} alignItems="center">
                  <SharedElement
                    id={`item.${item.id}.tag.${sharedElementIdSuffix}`}>
                    <Stack
                      p={1}
                      mr={2}
                      borderRadius="lg"
                      _light={{
                        bg: 'gray.50:alpha.80',
                      }}
                      _dark={{
                        bg: 'gray.700:alpha.80',
                      }}>
                      <Badge
                        _light={{
                          bg: fivehundred(),
                          _text: {color: onehundred()},
                        }}
                        _dark={{
                          bg: twohundred(),
                          _text: {color: sevenhundred()},
                        }}
                        rounded="lg">
                        {item.tag}
                      </Badge>
                    </Stack>
                  </SharedElement>
                  <SharedElement
                    id={`item.${item.id}.edit.${sharedElementIdSuffix}`}>
                    <Pressable
                      onPress={() => {
                        setShowPreview(true);
                        setPreviewImageURI(item.imageLink);
                      }}>
                      <Stack
                        p={1}
                        borderRadius="lg"
                        mr={2}
                        _light={{
                          bg: 'gray.50:alpha.80',
                        }}
                        _dark={{
                          bg: 'gray.700:alpha.80',
                        }}>
                        <HStack space={2} px="2" alignItems="center">
                          <Edit
                            fivehundred={fivehundred}
                            onehundred={onehundred}
                          />

                          <Text
                            _light={{
                              color: 'black',
                            }}
                            _dark={{
                              color: 'white',
                            }}
                            fontSize="sm"
                            bold>
                            {children.length > 0 ? children.length : 0}
                          </Text>
                        </HStack>
                      </Stack>
                    </Pressable>
                  </SharedElement>
                  <SharedElement
                    id={`item.${item.id}.like.${sharedElementIdSuffix}`}>
                    <Pressable
                      onPress={() => {
                        if (item.type === 'edit') {
                          console.log('Open Editor');
                        } else {
                          if (likePressed) {
                            setLikePressed(false);
                            handleLikePress(item);
                          } else {
                            setLikePressed(true);
                            handleLikePress(item);
                          }
                        }
                      }}>
                      <Stack
                        p={1}
                        borderRadius="lg"
                        _light={{
                          bg: 'gray.50:alpha.80',
                        }}
                        _dark={{
                          bg: 'gray.700:alpha.80',
                        }}>
                        <HStack space={2} px="2" alignItems="center">
                          {likePressed ? (
                            <HeartFilled
                              fivehundred={fivehundred}
                              onehundred={onehundred}
                            />
                          ) : (
                            <HeartOutline
                              fivehundred={fivehundred}
                              onehundred={onehundred}
                            />
                          )}
                          <Text
                            _light={{
                              color: 'black',
                            }}
                            _dark={{
                              color: 'white',
                            }}
                            fontSize="sm"
                            bold>
                            {item.likes.length > 0 ? item.likes.length : 0}
                          </Text>
                        </HStack>
                      </Stack>
                    </Pressable>
                  </SharedElement>
                </HStack>
                {isYourNFT ? (
                  <Button
                    onPress={() => setShowSellModal(true)}
                    mx={6}
                    my={4}
                    borderRadius={10}
                    colorScheme={twohundred().substr(
                      0,
                      twohundred().indexOf('.'),
                    )}>
                    Sell
                  </Button>
                ) : (
                  <Button
                    onPress={() => setShowBuyModal(true)}
                    mx={6}
                    my={4}
                    borderRadius={10}
                    colorScheme={twohundred().substr(
                      0,
                      twohundred().indexOf('.'),
                    )}>
                    {item.isItemForSale ? 'BUY' : 'REQUEST'}
                  </Button>
                )}
                <Heading
                  size="lg"
                  textAlign={'center'}
                  mx={6}
                  marginTop={6}
                  _light={{
                    color: 'gray.800',
                  }}
                  _dark={{
                    color: 'gray.200',
                  }}
                  marginBottom={10}
                  fontWeight="normal">
                  Edit of a lovely rose that inspired me and wanted to share
                  with you
                </Heading>

                {hasParent && transformedParent && (
                  <Stack mx={6}>
                    <Heading fontWeight="500" size="md">
                      Inspiration
                    </Heading>
                    <ScreenCard
                      {...transformedParent}
                      // id="100"
                      // title="River Trip"
                      // walletAddress="Paula Green"
                      // date="15th June 2021"
                      // tag="Water"
                      // imageLink="https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg"
                      onPress={() => {
                        if (name.includes('ItemDetails')) {
                          if (route.name === 'ItemDetailsOne') {
                            navigation.push('ItemDetails', {
                              item: {
                                ...transformedParent,
                                // id: '100',
                                // title: 'River Trip',
                                // walletAddress: '0xccf3...7cC4',
                                // date: '0.4 MATIC',
                                // tag: 'Water',
                                // imageLink:
                                //   'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
                              },
                            });
                          } else {
                            navigation.push('ItemDetailsOne', {
                              item: {
                                ...transformedParent,
                                // id: '100',
                                // title: 'River Trip',
                                // walletAddress: '0xccf3...7cC4',
                                // date: '0.4 MATIC',
                                // tag: 'Water',
                                // imageLink:
                                //   'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
                              },
                            });
                          }
                        } else {
                          if (route.name === 'ProfileItems') {
                            navigation.push('ProfileItems', {
                              item: {
                                ...transformedParent,
                                // id: '100',
                                // title: 'River Trip',
                                // walletAddress: '0xccf3...7cC4',
                                // date: '0.4 MATIC',
                                // tag: 'Water',
                                // imageLink:
                                //   'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
                              },
                            });
                          } else {
                            navigation.push('ProfileItemsOne', {
                              item: {
                                ...transformedParent,
                                // id: '100',
                                // title: 'River Trip',
                                // walletAddress: '0xccf3...7cC4',
                                // date: '0.4 MATIC',
                                // tag: 'Water',
                                // imageLink:
                                //   'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
                              },
                            });
                          }
                        }
                      }}
                    />
                  </Stack>
                )}
                <Stack mx={6} my={2}>
                  <Heading fontWeight="500" size="md">
                    Inspired
                  </Heading>
                </Stack>
                {transformedChildren && (
                  <Carousel
                    data={transformedChildren}
                    useExperimentalSnap
                    firstItem={1}
                    renderItem={({item: ListItem, index, dataIndex}) => (
                      <ProfileCard
                        {...ListItem}
                        index={dataIndex}
                        containerWidth={width / 2}
                        isFromDetails
                        onPress={() => {
                          if (name.includes('ItemDetails')) {
                            if (route.name === 'ItemDetailsOne') {
                              navigation.push('ItemDetails', {
                                item: {
                                  ...item,
                                  // id: '100',
                                  // title: 'River Trip',
                                  // walletAddress: '0xccf3...7cC4',
                                  // date: '0.4 MATIC',
                                  // tag: 'Water',
                                  // imageLink:
                                  //   'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
                                },
                              });
                            } else {
                              navigation.push('ItemDetailsOne', {
                                item: {
                                  ...item,
                                  // id: '100',
                                  // title: 'River Trip',
                                  // walletAddress: '0xccf3...7cC4',
                                  // date: '0.4 MATIC',
                                  // tag: 'Water',
                                  // imageLink:
                                  //   'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
                                },
                              });
                            }
                          } else {
                            if (route.name === 'ProfileItems') {
                              navigation.push('ProfileItems', {
                                item: {
                                  ...item,
                                  // id: '100',
                                  // title: 'River Trip',
                                  // walletAddress: '0xccf3...7cC4',
                                  // date: '0.4 MATIC',
                                  // tag: 'Water',
                                  // imageLink:
                                  //   'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
                                },
                              });
                            } else {
                              navigation.push('ProfileItemsOne', {
                                item: {
                                  ...item,
                                  // id: '100',
                                  // title: 'River Trip',
                                  // walletAddress: '0xccf3...7cC4',
                                  // date: '0.4 MATIC',
                                  // tag: 'Water',
                                  // imageLink:
                                  //   'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
                                },
                              });
                            }
                          }
                        }}
                      />
                    )}
                    sliderWidth={width - 16}
                    itemWidth={width / 2}
                  />
                )}

                <Box my={10} />
              </VStack>
            </Animated.ScrollView>
          </NativeViewGestureHandler>
        </Animated.View>
      </PanGestureHandler>
      {showSellModal && (
        <SellModal
          showModal={showSellModal}
          setShowModal={setShowSellModal}
          onPress={price => sellNFT(item.id, price, item.adam)}
          getUSDConversion={getUSDConversion}
        />
      )}
      {showBuyModal && (
        <BuyModal
          showModal={showBuyModal}
          setShowModal={setShowBuyModal}
          priceInMatic={item.isItemForSale.priceInMatic}
          priceUSD={priceInUSD}
          onPress={() => buyNFT(item.isItemForSale)}
        />
      )}
      {showModal && (
        <PhotoFormModal
          setFormValues={setFormValues}
          handleMint={handleMint}
          showModal={showModal}
          setShowModal={setShowModal}
          filePath={previewImageURI}
          formValues={formValues}
          remixedItem={item}
        />
      )}
      {errorCode !== null && errorCode >= 0 && (
        <AlertModal
          errorCode={errorCode}
          handleRetry={handleRetry}
          filePath={previewImageURI}
          formValues={formValues}
          remixedItem={item}
        />
      )}
      {!!transactionHash ||
        (!!transactionHashItem && (
          <SuccessModal
            clearTransactionHash={
              !!transactionHash
                ? clearTransactionHash
                : clearTransactionHashItem
            }
            transactionHash={
              !!transactionHash ? transactionHash : transactionHashItem
            }></SuccessModal>
        ))}
      <PhotoEditorModal
        image={{uri: previewImageURI}}
        onExport={photoEditorResult => {
          console.log(previewImageURI);
          //setShowPreview(false);
          setShowModal(true);
          setPreviewImageURI(photoEditorResult.image);
          // navigation.navigate('CameraStack', {
          //   uri: photoEditorResult.image,
          // });
        }}
        onCancel={() => {
          setShowPreview(false);
        }}
        visible={showPreview}
        configuration={configuration}
      />
    </Box>
  );
};
export default withItemContext(ItemDetails);

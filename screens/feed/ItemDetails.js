import React, {useRef} from 'react';
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

const USER_WALLET_ADDRESS = '0xccf3e94792cd0b3484f54e6110ae1b3445a67cc4';

const data = [
  {
    id: '81',
    title: 'Tree Walk',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Nature',
    imageLink:
      'https://s3.amazonaws.com/crowdriff-media/mirror/6315b0b40448afe22a7a15f3231b2e4298aa16b334f757e20a089415120eee5a.jpg',
  },
  {
    id: '82',
    title: 'Square Flower',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Flower',
    imageLink:
      'https://www.thisiscolossal.com/wp-content/uploads/2016/07/flower-1.jpg',
  },
  {
    id: '83',
    title: 'Whats up?',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Sky',
    imageLink: 'https://images.wsj.net/im-298298?width=1280&size=1',
  },
  {
    id: '84',
    title: 'Petal to the City',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Statue',
    imageLink:
      'https://res.cloudinary.com/atlanta/images/f_auto,q_auto/v1599799897/newAtlanta.com/hero_outdoors_lg-1/hero_outdoors_lg-1.jpg?_i=AA',
  },
  {
    id: '85',
    title: 'My Christmas Flower',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Flower',
    imageLink:
      'https://www.gardeningknowhow.com/wp-content/uploads/2016/02/poinsettia-outdoors.jpg',
  },
  {
    id: '86',
    title: 'River Trip',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Water',
    imageLink:
      'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
  },
  {
    id: '87',
    title: 'Mountain Trail',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Fall',
    imageLink:
      'https://bigseventravel.com/wp-content/uploads/2020/06/Screen-Shot-2020-06-24-at-2.51.41-PM.png',
  },
  {
    id: '88',
    title: 'Fire in the Field',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Fire',
    imageLink:
      'https://assets.newatlas.com/dims4/default/0412114/2147483647/strip/true/crop/2500x1666+0+0/resize/728x485!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2F68%2F38%2F1eaf35774e1ab0427ac04a664d65%2Foriginal-2.jpg',
  },
  {
    id: '89',
    title: 'Port of Pier',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'City',
    imageLink:
      'https://i.insider.com/577fc85c88e4a7531b8b6941?width=1136&format=jpeg',
  },
  {
    id: '90',
    title: 'Cold River',
    walletAddress: 'Paula Green',
    date: '15th June 2021',
    tag: 'Winter',
    imageLink:
      'https://cdn.outdoors.org/wp-content/uploads/2021/11/03080225/Maine-Woods-Photo-by-Cait-Bourgault_Photos-93.jpg',
  },
];

const ItemDetails = ({navigation, route}) => {
  let hasBeenCalled = false;
  const scrollY = useSharedValue(0);

  const {item} = route.params;
  const name = route.name;

  const isYourNFT = USER_WALLET_ADDRESS === item.walletAddress;

  const {width, height} = useWindowDimensions('window');
  const isGestureActive = useSharedValue(false);

  const scale = useSharedValue(1);

  const hasParent = true;

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
      case 'Fire':
        return 'red.100';
      case 'City':
        return 'purple.100';
      case 'Winter':
        return 'blueGray.100';
    }
  };

  const twohundred = () => {
    switch (item.tag) {
      case 'Nature':
        return 'green.200';
      case 'Flower':
        return 'rose.200';
      case 'Sky':
        return 'lightBlue.200';
      case 'Statue':
        return 'muted.200';
      case 'Water':
        return 'blue.200';
      case 'Fall':
        return 'orange.200';
      case 'Fire':
        return 'red.200';
      case 'City':
        return 'purple.200';
      case 'Winter':
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
      case 'Fire':
        return 'red.500';
      case 'City':
        return 'purple.500';
      case 'Winter':
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
      case 'Fire':
        return 'red.700';
      case 'City':
        return 'purple.700';
      case 'Winter':
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
              <SharedElement id={`item.${item.id}.photo`}>
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
                <SharedElement id={`item.${item.id}.card`}>
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
                          <SharedElement id={`item.${item.id}.avatar`}>
                            <Avatar
                              size="sm"
                              source={require('../../avatar.png')}
                              style={{opacity: 1}}
                            />
                          </SharedElement>
                          <Text
                            fontSize="sm"
                            _light={{
                              c: 'gray.500',
                            }}
                            _dark={{
                              c: 'gray.700',
                            }}>
                            {item.walletAddress}
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
                  <SharedElement id={`item.${item.id}.tag`}>
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
                  <SharedElement id={`item.${item.id}.edit`}>
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
                          276
                        </Text>
                      </HStack>
                    </Stack>
                  </SharedElement>
                  <SharedElement id={`item.${item.id}.like`}>
                    <Pressable
                      onPress={() => {
                        if (item.type === 'edit') {
                          console.log('Open Editor');
                        } else {
                          if (likePressed) {
                            setLikePressed(false);
                          } else {
                            setLikePressed(true);
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
                            10
                          </Text>
                        </HStack>
                      </Stack>
                    </Pressable>
                  </SharedElement>
                </HStack>
                <Button
                  onPress={() => console.log('hello world')}
                  mx={6}
                  my={4}
                  borderRadius={10}
                  colorScheme={twohundred().substr(
                    0,
                    twohundred().indexOf('.'),
                  )}>
                  BUY
                </Button>
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

                {hasParent && (
                  <Stack mx={6}>
                    <Heading fontWeight="500" size="md">
                      Inspiration
                    </Heading>
                    <ScreenCard
                      id="100"
                      title="River Trip"
                      walletAddress="Paula Green"
                      date="15th June 2021"
                      tag="Water"
                      imageLink="https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg"
                      onPress={() => {
                        if (name.includes('ItemDetails')) {
                          if (route.name === 'ItemDetailsOne') {
                            navigation.push('ItemDetails', {
                              item: {
                                id: '100',
                                title: 'River Trip',
                                walletAddress: '0xccf3...7cC4',
                                date: '0.4 MATIC',
                                tag: 'Water',
                                imageLink:
                                  'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
                              },
                            });
                          } else {
                            navigation.push('ItemDetailsOne', {
                              item: {
                                id: '100',
                                title: 'River Trip',
                                walletAddress: '0xccf3...7cC4',
                                date: '0.4 MATIC',
                                tag: 'Water',
                                imageLink:
                                  'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
                              },
                            });
                          }
                        } else {
                          if (route.name === 'ProfileItems') {
                            navigation.push('ProfileItems', {
                              item: {
                                id: '100',
                                title: 'River Trip',
                                walletAddress: '0xccf3...7cC4',
                                date: '0.4 MATIC',
                                tag: 'Water',
                                imageLink:
                                  'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
                              },
                            });
                          } else {
                            navigation.push('ProfileItemsOne', {
                              item: {
                                id: '100',
                                title: 'River Trip',
                                walletAddress: '0xccf3...7cC4',
                                date: '0.4 MATIC',
                                tag: 'Water',
                                imageLink:
                                  'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
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
                <Carousel
                  data={data}
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
                                id: '100',
                                title: 'River Trip',
                                walletAddress: '0xccf3...7cC4',
                                date: '0.4 MATIC',
                                tag: 'Water',
                                imageLink:
                                  'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
                              },
                            });
                          } else {
                            navigation.push('ItemDetailsOne', {
                              item: {
                                id: '100',
                                title: 'River Trip',
                                walletAddress: '0xccf3...7cC4',
                                date: '0.4 MATIC',
                                tag: 'Water',
                                imageLink:
                                  'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
                              },
                            });
                          }
                        } else {
                          if (route.name === 'ProfileItems') {
                            navigation.push('ProfileItems', {
                              item: {
                                id: '100',
                                title: 'River Trip',
                                walletAddress: '0xccf3...7cC4',
                                date: '0.4 MATIC',
                                tag: 'Water',
                                imageLink:
                                  'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
                              },
                            });
                          } else {
                            navigation.push('ProfileItemsOne', {
                              item: {
                                id: '100',
                                title: 'River Trip',
                                walletAddress: '0xccf3...7cC4',
                                date: '0.4 MATIC',
                                tag: 'Water',
                                imageLink:
                                  'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
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

                <Box my={10} />
              </VStack>
            </Animated.ScrollView>
          </NativeViewGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </Box>
  );
};
export default ItemDetails;

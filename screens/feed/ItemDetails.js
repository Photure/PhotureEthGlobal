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

import LottieView from 'lottie-react-native';
import {Edit} from '../../icons/Edit';

import {
  PanGestureHandler,
  NativeViewGestureHandler,
  ScrollView,
} from 'react-native-gesture-handler';

import {SharedElement} from 'react-navigation-shared-element';
import ScreenCard from '../../components/Card/ScreenCard';

const ItemDetails = ({navigation, route}) => {
  let hasBeenCalled = false;
  const scrollY = useSharedValue(0);

  const {item} = route.params;

  const {width, height} = useWindowDimensions('window');
  const isGestureActive = useSharedValue(false);

  const scale = useSharedValue(1);

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

  const ref = useRef(null);
  const [pressed, setPressed] = React.useState(false);
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
                        if (pressed) {
                          ref.current.play(0, 35);
                          setPressed(false);
                        } else {
                          ref.current.play(35, 75);
                          setPressed(true);
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
                          <LottieView
                            ref={ref}
                            source={require('./heart.json')}
                            loop={false}
                            style={{width: 24, height: 24}}
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
                  marginBottom={10}
                  fontWeight="normal">
                  Edit of a lovely rose that inspired me and wanted to share
                  with you
                </Heading>
                {item.id === '1' ? (
                  <Stack mx={6}>
                    <ScreenCard
                      id="200"
                      title="Cold River"
                      walletAddress="Paula Green"
                      date="15th June 2021"
                      tag="Winter"
                      imageLink="https://cdn.outdoors.org/wp-content/uploads/2021/11/03080225/Maine-Woods-Photo-by-Cait-Bourgault_Photos-93.jpg"
                      onPress={() => {
                        if (route.name === 'ItemDetails') {
                          navigation.push('ItemDetailsOne', {
                            item: {
                              id: '200',
                              title: 'Cold River',
                              walletAddress: 'Paula Green',
                              date: '15th June 2021',
                              tag: 'Winter',
                              imageLink:
                                'https://cdn.outdoors.org/wp-content/uploads/2021/11/03080225/Maine-Woods-Photo-by-Cait-Bourgault_Photos-93.jpg',
                            },
                          });
                        } else {
                          navigation.push('ItemDetails', {
                            item: {
                              id: '200',
                              title: 'Cold River',
                              walletAddress: 'Paula Green',
                              date: '15th June 2021',
                              tag: 'Winter',
                              imageLink:
                                'https://cdn.outdoors.org/wp-content/uploads/2021/11/03080225/Maine-Woods-Photo-by-Cait-Bourgault_Photos-93.jpg',
                            },
                          });
                        }
                      }}
                    />
                  </Stack>
                ) : item.id === '200' ? (
                  <Stack mx={6}>
                    <ScreenCard
                      id="300"
                      title="River Trip"
                      walletAddress="0xccf3...7cC4"
                      date="0.4 MATIC"
                      tag="Water"
                      imageLink="https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg"
                      onPress={() => {
                        if (route.name === 'ItemDetails') {
                          navigation.push('ItemDetailsOne', {
                            item: {
                              id: '300',
                              title: 'River Trip',
                              walletAddress: '0xccf3...7cC4',
                              date: '0.4 MATIC',
                              tag: 'Water',
                              imageLink:
                                'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
                            },
                          });
                        } else {
                          navigation.push('ItemDetails', {
                            item: {
                              id: '300',
                              title: 'River Trip',
                              walletAddress: '0xccf3...7cC4',
                              date: '0.4 MATIC',
                              tag: 'Water',
                              imageLink:
                                'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
                            },
                          });
                        }
                      }}
                    />
                  </Stack>
                ) : (
                  <Stack mx={6}>
                    <ScreenCard
                      id="400"
                      title="Port of Pier"
                      walletAddress="0xccf3...7cC4"
                      date="0.4 MATIC"
                      tag="City"
                      imageLink="https://i.insider.com/577fc85c88e4a7531b8b6941?width=1136&format=jpeg"
                      onPress={() => {
                        if (route.name === 'ItemDetails') {
                          navigation.push('ItemDetailsOne', {
                            item: {
                              id: '400',
                              title: 'Port of Pier',
                              walletAddress: '0xccf3...7cC4',
                              date: '0.4 MATIC',
                              tag: 'City',
                              imageLink:
                                'https://i.insider.com/577fc85c88e4a7531b8b6941?width=1136&format=jpeg',
                            },
                          });
                        } else {
                          navigation.push('ItemDetails', {
                            item: {
                              id: '400',
                              title: 'Port of Pier',
                              walletAddress: '0xccf3...7cC4',
                              date: '0.4 MATIC',
                              tag: 'City',
                              imageLink:
                                'https://i.insider.com/577fc85c88e4a7531b8b6941?width=1136&format=jpeg',
                            },
                          });
                        }
                      }}
                    />
                  </Stack>
                )}
                <Box my={40} />
              </VStack>
            </Animated.ScrollView>
          </NativeViewGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </Box>
  );
};
export default ItemDetails;

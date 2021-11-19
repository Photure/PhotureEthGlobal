import React, {useRef} from 'react';
import {Dimensions, Image} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';

import {Box, Badge, Stack, Text, HStack, Pressable} from 'native-base';

import {Edit} from '../../icons/Edit';
import {HeartOutline} from '../../icons/HeartOutline';
import {HeartFilled} from '../../icons/HeartFilled';
const {height: wHeight} = Dimensions.get('window');

import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

import {TapGestureHandler} from 'react-native-gesture-handler';

const DEFAULT_CARD_HEIGHT = wHeight / 3 + 50;

export const MARGIN = 8;
export const CARD_HEIGHT = DEFAULT_CARD_HEIGHT + MARGIN * 2;
const height = wHeight - 64 - 90;

const ProfileCard = ({
  id,
  title,
  date,
  tag,
  onPress,
  imageLink,
  index,
  containerWidth,
  isFromDetails,
  children,
  likes,
  sharedElementIdSuffix
}) => {
  const onehundred = () => {
    switch (tag) {
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
    switch (tag) {
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
      case 'Meme':
        return 'red.200';
      case 'Landmarks':
        return 'purple.200';
      case 'Art':
        return 'blueGray.200';
    }
  };

  const fivehundred = () => {
    switch (tag) {
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
    switch (tag) {
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

  const pressed = useSharedValue(false);

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      pressed.value = true;
    },
    onEnd: (event, ctx) => {
      pressed.value = false;
      runOnJS(onPress)();
    },
  });

  const uas = useAnimatedStyle(() => {
    return {
      transform: [{scale: withSpring(pressed.value ? 0.96 : 1)}],
    };
  });

  const [likePressed, setLikePressed] = React.useState(false);

  const getMargin = () => {
    if (isFromDetails) {
      return {marginHorizontal: 12};
    } else {
      console.log(index % 2 === 0);
      if (index % 2 === 0) {
        return {marginRight: 12};
      } else {
        return {marginLeft: 12};
      }
    }
  };

  return (
    <Animated.View style={uas}>
      <Box
        my={3}
        style={getMargin()}
        overflow="hidden"
        width={containerWidth}
        height="275"
        shadow={2}
        borderRadius={10}>
        <TapGestureHandler onGestureEvent={eventHandler}>
          <Animated.View>
            <SharedElement id={`item.${id}.photo.${sharedElementIdSuffix}`}>
              <Image
                source={{
                  uri: imageLink,
                }}
                style={{
                  borderRadius: 10,
                  resizeMode: 'cover',
                  width: '100%',
                  height: '100%',
                }}
              />
            </SharedElement>
          </Animated.View>
        </TapGestureHandler>
        <SharedElement
          id={`item.${id}.tag.${sharedElementIdSuffix}`}
          style={{position: 'absolute', left: '5%', top: '20%'}}>
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
              {tag}
            </Badge>
          </Stack>
        </SharedElement>
        <SharedElement
          id={`item.${id}.edit.${sharedElementIdSuffix}`}
          style={{position: 'absolute', left: '5%', top: '5%'}}>
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
              <Edit fivehundred={fivehundred} onehundred={onehundred} />
              <Text
                _light={{
                  color: 'black',
                }}
                _dark={{
                  color: 'white',
                }}
                fontSize="sm"
                bold>
                {children.length}
              </Text>
            </HStack>
          </Stack>
        </SharedElement>
        <SharedElement
          id={`item.${id}.like.${sharedElementIdSuffix}`}
          style={{position: 'absolute', right: 0, top: '5%'}}>
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
            <Pressable
              onPress={() => {
                if (likePressed) {
                  setLikePressed(false);
                } else {
                  setLikePressed(true);
                }
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
                  {likes.length}
                </Text>
              </HStack>
            </Pressable>
          </Stack>
        </SharedElement>
        <TapGestureHandler onGestureEvent={eventHandler}>
          <Animated.View>
            <SharedElement id={`item.${id}.card.${sharedElementIdSuffix}`}>
              <Stack
                p={4}
                position="absolute"
                width="90%"
                left="5%"
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
                  <Text
                    fontSize="xl"
                    _light={{
                      color: 'black',
                    }}
                    _dark={{
                      color: 'white',
                    }}>
                    {title}
                  </Text>
                  <Text
                    fontSize="sm"
                    _light={{
                      c: 'gray.500',
                    }}
                    _dark={{
                      c: 'gray.700',
                    }}>
                    {date}
                  </Text>
                </Stack>
              </Stack>
            </SharedElement>
          </Animated.View>
        </TapGestureHandler>
      </Box>
    </Animated.View>
  );
};

export default ProfileCard;

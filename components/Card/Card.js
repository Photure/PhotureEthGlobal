import React, {useRef} from 'react';
import {Dimensions, Animated as RNAnimate, Image} from 'react-native';
import {Box} from 'native-base';
import {SharedElement} from 'react-navigation-shared-element';

import CardButton from './CardButton/CardButton';
import Label from './Label/Label';
import CardInfo from './CardInfo/CardInfo';
const {height: wHeight} = Dimensions.get('window');

import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

import {TapGestureHandler} from 'react-native-gesture-handler';
import { withItemContext, useItemContext } from '../../contexts/ItemContext';
import { useWalletConnect } from '@walletconnect/react-native-dapp';

const DEFAULT_CARD_HEIGHT = wHeight / 3 + 50;

export const MARGIN = 8;
export const CARD_HEIGHT = DEFAULT_CARD_HEIGHT + MARGIN * 2;
const height = wHeight - 64 - 90;

const Card = ({
  id,
  title,
  walletAddress,
  date,
  tag,
  y,
  index,
  onPress,
  imageLink,
  onEditPress,
  likes,
  description,
  timestamp,
  parent,
  children = [],
  adam,
  file_type,
}) => {
  const wholeItem = {
    id,
    title,
    walletAddress,
    date,
    tag,
    y,
    index,
    onPress,
    imageLink,
    likes,
    description,
    timestamp,
    parent,
    children,
    adam,
    file_type
  }
  console.log('likesCard',likes)
  const wc = useWalletConnect()
  const usersWalletAddress = wc._accounts[0]
  const { handleLikePress } = useItemContext()
  const position = RNAnimate.subtract(index * CARD_HEIGHT, y);
  const isDisappearing = -CARD_HEIGHT;
  const isTop = 0;
  const isBottom = height - CARD_HEIGHT;
  const isAppearing = height;

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
      case 'Fire':
        return 'red.100';
      case 'City':
        return 'purple.100';
      case 'Winter':
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
      case 'Fire':
        return 'red.200';
      case 'City':
        return 'purple.200';
      case 'Winter':
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
      case 'Fire':
        return 'red.500';
      case 'City':
        return 'purple.500';
      case 'Winter':
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
      case 'Fire':
        return 'red.700';
      case 'City':
        return 'purple.700';
      case 'Winter':
        return 'blueGray.700';
    }
  };

  const ref = useRef(null);

  const translateY = RNAnimate.add(
    RNAnimate.add(
      y,
      y.interpolate({
        inputRange: [0, 0.00001 + index * CARD_HEIGHT],
        outputRange: [0, -index * CARD_HEIGHT],
        extrapolateRight: 'clamp',
      }),
    ),
    position.interpolate({
      inputRange: [isBottom, isAppearing],
      outputRange: [0, -CARD_HEIGHT / 4],
      extrapolate: 'clamp',
    }),
  );
  const scale = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0.5, 1, 1, 0.5],
    extrapolate: 'clamp',
  });

  const opacity = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0.5, 1, 1, 0.5],
  });

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

  return (
    <RNAnimate.View
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          flex: 1,
          width: '100%',
          height: CARD_HEIGHT,
        },
        {opacity, transform: [{translateY}, {scale}]},
      ]}>
      <Animated.View style={uas}>
        <Box my={4} overflow="hidden" width="100%" shadow={2} borderRadius={10}>
          <TapGestureHandler onGestureEvent={eventHandler}>
            <Animated.View>
              <SharedElement id={`item.${id}.photo`}>
                <Image
                  ref={useRef(null)}
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
            id={`item.${id}.like`}
            style={{position: 'absolute', right: '25%'}}>
            <CardButton
              value={likes.length}
              type="like"
              isLiked={likes.includes(usersWalletAddress)}
              onehundred={onehundred}
              fivehundred={fivehundred}
              onPress={() => handleLikePress(wholeItem)}
            />
          </SharedElement>
          <SharedElement
            id={`item.${id}.edit`}
            style={{position: 'absolute', left: '5%'}}>
            <CardButton
              value={children.length}
              onPress={onEditPress}
              type="edit"
              onehundred={onehundred}
              fivehundred={fivehundred}
            />
          </SharedElement>
          <SharedElement id={`item.${id}.tag`}>
            <Label
              text={tag}
              onehundred={onehundred}
              twohundred={twohundred}
              fivehundred={fivehundred}
              sevenhundred={sevenhundred}
            />
          </SharedElement>
          <TapGestureHandler onGestureEvent={eventHandler}>
            <Animated.View>
              <SharedElement id={`item.${id}.card`}>
                <CardInfo
                  title={title}
                  walletAddress={walletAddress}
                  date={date}
                  id={id}
                />
              </SharedElement>
            </Animated.View>
          </TapGestureHandler>
        </Box>
      </Animated.View>
    </RNAnimate.View>
  );
};

export default withItemContext(Card);

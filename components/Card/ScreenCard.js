import React, {useRef} from 'react';
import {Dimensions, Image} from 'react-native';
import {Box, View} from 'native-base';
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

const DEFAULT_CARD_HEIGHT = wHeight / 3 + 50;

export const MARGIN = 8;
export const CARD_HEIGHT = DEFAULT_CARD_HEIGHT + MARGIN * 2;
const height = wHeight - 64 - 90;

const ScreenCard = ({
  id,
  title,
  walletAddress,
  date,
  tag,
  onPress,
  imageLink,
  ...rest
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
      case 'City':
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
      case 'City':
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
      case 'City':
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
      case 'City':
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

  return (
    <View
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          flex: 1,
          width: '100%',
          height: CARD_HEIGHT,
        },
      ]}>
      <Animated.View style={uas}>
        <Box my={4} overflow="hidden" width="100%" shadow={2} borderRadius={10}>
          <TapGestureHandler onGestureEvent={eventHandler}>
            <Animated.View>
              <SharedElement id={`item.${id}.photo.${rest.sharedElementIdSuffix}`}>
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
            id={`item.${id}.like.${rest.sharedElementIdSuffix}`}
            style={{position: 'absolute', right: '25%'}}>
            <CardButton
              value={rest.likes.length}
              type="like"
              onehundred={onehundred}
              fivehundred={fivehundred}
            />
          </SharedElement>
          <SharedElement
            id={`item.${id}.edit.${rest.sharedElementIdSuffix}`}
            style={{position: 'absolute', left: '5%'}}>
            <CardButton
              value={rest.children.length}
              type="edit"
              onehundred={onehundred}
              fivehundred={fivehundred}
            />
          </SharedElement>
          <SharedElement id={`item.${id}.tag.${rest.sharedElementIdSuffix}`}>
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
              <SharedElement id={`item.${id}.card.${rest.sharedElementIdSuffix}`}>
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
    </View>
  );
};

export default ScreenCard;

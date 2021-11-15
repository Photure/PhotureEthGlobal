import React, {useRef} from 'react';
import {Stack, HStack, Text, Pressable} from 'native-base';
import LottieView from 'lottie-react-native';

import {Edit} from '../../../icons/Edit';

const CardButton = ({
  value,
  onehundred,
  fivehundred,
  left = undefined,
  right = undefined,
  type,
}) => {
  const ref = useRef(null);
  const [pressed, setPressed] = React.useState(false);

  return (
    <Stack
      p={1}
      position="absolute"
      left={left}
      right={right}
      top={5}
      borderRadius="lg"
      _light={{
        bg: 'gray.50:alpha.80',
      }}
      _dark={{
        bg: 'gray.700:alpha.80',
      }}>
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
        <HStack space={2} px="2" alignItems="center">
          {type === 'edit' ? (
            <Edit fivehundred={fivehundred} onehundred={onehundred} />
          ) : (
            <LottieView
              ref={ref}
              source={require('./heart.json')}
              loop={false}
              style={{width: 24, height: 24}}
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
            {value}
          </Text>
        </HStack>
      </Pressable>
    </Stack>
  );
};

export default CardButton;

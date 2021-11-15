import React, {useRef} from 'react';
import {Stack, HStack, Text, Pressable} from 'native-base';

import {Edit} from '../../../icons/Edit';
import {HeartOutline} from '../../../icons/HeartOutline';
import {HeartFilled} from '../../../icons/HeartFilled';

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
          if (type === 'edit') {
            console.log('Open Editor');
          } else {
            if (pressed) {
              setPressed(false);
            } else {
              setPressed(true);
            }
          }
        }}>
        <HStack space={2} px="2" alignItems="center">
          {type === 'edit' ? (
            <Edit fivehundred={fivehundred} onehundred={onehundred} />
          ) : pressed ? (
            <HeartFilled fivehundred={fivehundred} onehundred={onehundred} />
          ) : (
            <HeartOutline fivehundred={fivehundred} onehundred={onehundred} />
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

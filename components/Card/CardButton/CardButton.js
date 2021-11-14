import React from 'react';
import {Stack, HStack, Text} from 'native-base';
import {Edit} from '../../../icons/Edit';
import {HeartOutline} from '../../../icons/HeartOutline';

const CardButton = ({
  value,
  onehundred,
  fivehundred,
  left = undefined,
  right = undefined,
  type,
}) => {
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
      <HStack space={2} px="2" alignItems="center">
        {type === 'edit' ? (
          <Edit fivehundred={fivehundred} onehundred={onehundred} />
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
    </Stack>
  );
};

export default CardButton;

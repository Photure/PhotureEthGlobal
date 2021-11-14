import React from 'react';
import {Stack, Badge} from 'native-base';

const Label = ({text, onehundred, twohundred, fivehundred, sevenhundred}) => {
  return (
    <Stack
      p={1}
      position="absolute"
      left="5%"
      bottom={40}
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
        {text}
      </Badge>
    </Stack>
  );
};

export default Label;

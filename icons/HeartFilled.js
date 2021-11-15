import React from 'react';
import {Icon} from 'native-base';
import {Path, G} from 'react-native-svg';

export const HeartFilled = ({onehundred, fivehundred}) => {
  return (
    <Icon
      size={4}
      viewBox="0 0 24 24"
      _light={{
        color: fivehundred(),
      }}
      _dark={{
        color: onehundred(),
      }}>
      <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </Icon>
  );
};

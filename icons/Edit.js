import React from 'react';
import {Icon} from 'native-base';
import {Path, G} from 'react-native-svg';

export const Edit = ({onehundred, fivehundred}) => {
  return (
    <Icon
      size={4}
      viewBox="0 0 16 16"
      _light={{
        color: fivehundred(),
      }}
      _dark={{
        color: onehundred(),
      }}>
      <G transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
        <G>
          <Path d="M6,12a1,1,0,0,0,1,1h9.5a1,1,0,0,0,0-2H7A1,1,0,0,0,6,12Z"></Path>
          <Path d="M8.2,14.72A3.46,3.46,0,0,1,6,15.5a3.5,3.5,0,0,1,0-7,3.46,3.46,0,0,1,2.2.78A1,1,0,1,0,9.46,7.72a5.5,5.5,0,1,0,0,8.56A1,1,0,1,0,8.2,14.72Z"></Path>
          <Path d="M18,6.5a5.53,5.53,0,0,0-3.46,1.22A1,1,0,0,0,15.8,9.28,3.46,3.46,0,0,1,18,8.5a3.5,3.5,0,0,1,0,7,3.46,3.46,0,0,1-2.2-.78,1,1,0,0,0-1.26,1.56A5.5,5.5,0,1,0,18,6.5Z"></Path>
        </G>
      </G>
    </Icon>
  );
};

import React from 'react';
import {Icon} from 'native-base';
import {Path, G} from 'react-native-svg';

export const Art = ({color}) => {
  return (
    <Icon
      size={5}
      viewBox="0 0 16 16"
      marginRight={2}
      _light={{
        color: color,
      }}
      _dark={{
        color: color,
      }}>
      <G transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
        <G>
          <Path d="M6,3.5a1,1,0,0,0,1-1V1A1,1,0,0,0,5,1V2.5A1,1,0,0,0,6,3.5Z"></Path>
          <Path d="M2.5,5H1A1,1,0,0,0,1,7H2.5a1,1,0,0,0,0-2Z"></Path>
          <Path d="M2.5,17H1a1,1,0,0,0,0,2H2.5a1,1,0,0,0,0-2Z"></Path>
          <Path d="M18,0a1,1,0,0,0-1,1V2.5a1,1,0,0,0,2,0V1A1,1,0,0,0,18,0Z"></Path>
          <Path d="M6,20.5a1,1,0,0,0-1,1V23a1,1,0,0,0,2,0V21.5A1,1,0,0,0,6,20.5Z"></Path>
          <Path d="M18,20.5a1,1,0,0,0-1,1V23a1,1,0,0,0,2,0V21.5A1,1,0,0,0,18,20.5Z"></Path>
          <Path d="M21.5,7H23a1,1,0,0,0,0-2H21.5a1,1,0,0,0,0,2Z"></Path>
          <Path d="M23,17H21.5a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z"></Path>
          <Path d="M18,5H6A1,1,0,0,0,5,6V18a1,1,0,0,0,1,1H18a1,1,0,0,0,1-1V6A1,1,0,0,0,18,5Zm-3,6a1,1,0,0,1,0,2H13.25a.25.25,0,0,0-.25.25V15a1,1,0,0,1-2,0V13.25a.25.25,0,0,0-.25-.25H9a1,1,0,0,1,0-2h1.75a.25.25,0,0,0,.25-.25V9a1,1,0,0,1,2,0v1.75a.25.25,0,0,0,.25.25Z"></Path>
        </G>
      </G>
    </Icon>
  );
};

import React from 'react';
import {Icon} from 'native-base';
import {Path, G} from 'react-native-svg';

export const Profile = ({color}) => {
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
        <Path d="M23,19.22c-.74-1.47-3.24-2.39-6.71-3.67-.66-.24-1.08-.34-1.27-.88a1.72,1.72,0,0,1,.16-1.58c1.37-1.49,2-3.72,2-6.59C17.18,2.7,14.58,1,12,1S6.82,2.7,6.82,6.5c0,2.87.68,5.1,2,6.59A1.72,1.72,0,0,1,9,14.67c-.19.54-.61.64-1.27.88-3.47,1.28-6,2.2-6.71,3.67A10.55,10.55,0,0,0,0,23.5a.5.5,0,0,0,.5.5h23a.5.5,0,0,0,.5-.5A10.55,10.55,0,0,0,23,19.22Z"></Path>
      </G>
    </Icon>
  );
};

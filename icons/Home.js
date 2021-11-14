import React from 'react';
import {Icon} from 'native-base';
import {Path, G} from 'react-native-svg';

export const Home = ({color}) => {
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
          <Path d="M20.07,6.54a.25.25,0,0,0,.27,0,.23.23,0,0,0,.16-.23V1.49A.5.5,0,0,0,20,1H16.5a.5.5,0,0,0-.5.5v.59a.52.52,0,0,0,.14.35Z"></Path>
          <Path d="M23.72,11.8,12.72.3a1,1,0,0,0-1.44,0L.28,11.8a1,1,0,0,0-.2,1.09,1,1,0,0,0,.92.6H2.5A.5.5,0,0,1,3,14v8.5A1.5,1.5,0,0,0,4.5,24H9a1,1,0,0,0,1-1V19a2,2,0,0,1,4,0v4a1,1,0,0,0,1,1h4.5a1.5,1.5,0,0,0,1.5-1.5V14a.5.5,0,0,1,.5-.5H23a1,1,0,0,0,.92-.6A1,1,0,0,0,23.72,11.8Z"></Path>
        </G>
      </G>
    </Icon>
  );
};

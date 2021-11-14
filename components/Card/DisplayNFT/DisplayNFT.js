import React from 'react';
import {Image, useWindowDimensions} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';

const DisplayNFT = (id, preview) => {
  const {width} = useWindowDimensions('screen');
  return (
    <SharedElement id={`item.${id}.photo`}>
      <Image
        source={{
          uri: 'https://www.thisiscolossal.com/wp-content/uploads/2016/07/flower-1.jpg',
        }}
        style={{
          borderRadius: 10,
          resizeMode: 'cover',
          width: '100%',
          height: preview ? width : '100%',
        }}
      />
    </SharedElement>
  );
};

export default DisplayNFT;

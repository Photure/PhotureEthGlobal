import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';

export function FlashOff(): JSX.Element {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      height="48"
      width="48">
      <G transform="matrix(3.4285714285714284,0,0,3.4285714285714284,0,0)">
        <G>
          <Path
            d="M10.82,8.14a.24.24,0,0,0,.2.07.27.27,0,0,0,.18-.11l1.67-2.42a.75.75,0,0,0,0-.78.74.74,0,0,0-.66-.4h-3A.25.25,0,0,1,9,4.25V.75A.75.75,0,0,0,7.63.33L5.87,2.89a.26.26,0,0,0,0,.32Z"
            fill="#ffffff"></Path>
          <Path
            d="M13.28,13.78a.75.75,0,0,0,0-1.06L1.78,1.22A.75.75,0,0,0,.72,2.28L3.87,5.43a.24.24,0,0,1,0,.32L2.13,8.33A.75.75,0,0,0,2.75,9.5h3A.25.25,0,0,1,6,9.75v3.5a.75.75,0,0,0,.53.72.83.83,0,0,0,.22,0,.77.77,0,0,0,.62-.32l1.76-2.57A.27.27,0,0,1,9.31,11a.24.24,0,0,1,.2.08l2.71,2.7a.75.75,0,0,0,1.06,0Z"
            fill="#ffffff"></Path>
        </G>
      </G>
    </Svg>
  );
}
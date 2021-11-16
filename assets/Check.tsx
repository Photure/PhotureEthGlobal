import * as React from "react";
import Svg, { Path } from "react-native-svg";

export function Check(): JSX.Element {
  return (
    <Svg
      width='48'
      height='48'
      viewBox='0 0 24 24'
      fill='none'
      data-reactroot=''
    >
      <Path
        fill='#ffffff'
        d='M1.29289 12.0329C1.68342 11.6424 2.31658 11.6424 2.70711 12.0329L8.83711 18.1629C9.22763 18.5534 9.22763 19.1866 8.83711 19.5771C8.44658 19.9676 7.81342 19.9676 7.42289 19.5771L1.29289 13.4471C0.902369 13.0566 0.902369 12.4234 1.29289 12.0329Z'
        clip-rule='evenodd'
        fill-rule='evenodd'
      ></Path>
      <Path
        fill='#ffffff'
        d='M22.7071 4.29289C23.0976 4.68342 23.0976 5.31658 22.7071 5.70711L8.83711 19.5771C8.44659 19.9676 7.81342 19.9676 7.4229 19.5771C7.03237 19.1866 7.03237 18.5534 7.4229 18.1629L21.2929 4.29289C21.6834 3.90237 22.3166 3.90237 22.7071 4.29289Z'
        clip-rule='evenodd'
        fill-rule='evenodd'
      ></Path>
    </Svg>
  );
}

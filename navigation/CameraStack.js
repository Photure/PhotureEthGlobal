import React from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import TakePhotoScreen from '../screens/camera/TakePhoto';
import PhotoFormScreen from '../screens/camera/PhotoForm';
import { CameraProvider } from '../contexts/CameraContext';

const Stack = createSharedElementStackNavigator();

export const CameraStack = () => (
  <CameraProvider>
    <Stack.Navigator initialRouteName={'TakePhoto'}>
      <Stack.Screen
        name={'TakePhoto'}
        component={TakePhotoScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'Photo Form'}
        component={PhotoFormScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  </CameraProvider>
);

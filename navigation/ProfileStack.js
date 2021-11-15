import React from 'react';
import {TransitionPresets} from '@react-navigation/stack';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import ProfileScreen from '../screens/profile/Profile';
import ItemDetailsScreen from '../screens/feed/ItemDetails';

const Stack = createSharedElementStackNavigator();

export const ProfileStack = () => (
  <Stack.Navigator initialRouteName={'Profile'}>
    <Stack.Screen
      name={'Profile'}
      component={ProfileScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name={'ProfileItems'}
      component={ItemDetailsScreen}
      options={() => {
        return {
          headerShown: false,
          presentation: 'modal',
          gestureEnabled: false,
          animationTypeForReplace: 'pop',
          ...TransitionPresets.ModalSlideFromBottomIOS,
        };
      }}
      sharedElements={(route, otherRoute, showing) => {
        const {item} = route.params;
        return [
          {
            id: `item.${item.id}.photo`,
            animation: 'fade',
            resize: 'auto',
          },
          {
            id: `item.${item.id}.card`,
            animation: 'fade',
            resize: 'none',
          },
          {
            id: `item.${item.id}.tag`,
            animation: 'fade',
            resize: 'scale',
          },
          {
            id: `item.${item.id}.like`,
            animation: 'fade',
            resize: 'scale',
          },
          {
            id: `item.${item.id}.edit`,
            animation: 'fade',
            resize: 'scale',
          },
          {
            id: `item.${item.id}.avatar`,
          },
        ];
      }}
    />
    <Stack.Screen
      name={'ProfileItemsOne'}
      component={ItemDetailsScreen}
      options={() => {
        return {
          headerShown: false,
          presentation: 'modal',
          gestureEnabled: false,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        };
      }}
      sharedElements={(route, otherRoute, showing) => {
        const {item} = route.params;
        return [
          {
            id: `item.${item.id}.photo`,
            animation: 'move',
            resize: 'auto',
          },
          {
            id: `item.${item.id}.card`,
            animation: 'fade',
            resize: 'none',
          },
          {
            id: `item.${item.id}.tag`,
            animation: 'move',
            resize: 'scale',
          },
          {
            id: `item.${item.id}.like`,
            animation: 'move',
            resize: 'scale',
          },
          {
            id: `item.${item.id}.edit`,
            animation: 'move',
            resize: 'scale',
          },
          {
            id: `item.${item.id}.avatar`,
          },
        ];
      }}
    />
    {/* Perhaps a preview Screen/Modal. This could be handled in the ItemDetails component */}
  </Stack.Navigator>
);

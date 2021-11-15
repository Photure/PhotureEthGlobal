import React from 'react';
import {TransitionPresets} from '@react-navigation/stack';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import FeedScreen from '../screens/feed/Feed';
import ItemDetailsScreen from '../screens/feed/ItemDetails';

const Stack = createSharedElementStackNavigator();

export const FeedStack = () => (
  <Stack.Navigator initialRouteName={'Feed'} mode="modal">
    <Stack.Screen
      name={'Feed'}
      component={FeedScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name={'ItemDetails'}
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
      name={'ItemDetailsOne'}
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
  </Stack.Navigator>
);

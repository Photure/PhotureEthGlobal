import React from 'react';
import {TransitionPresets} from '@react-navigation/stack';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import ProfileScreen from '../screens/profile/Profile';
import ItemDetailsScreen from '../screens/feed/ItemDetails';
import { ProfileProvider } from '../contexts/ProfileContext';

const Stack = createSharedElementStackNavigator();

export const ProfileStack = () => (
  <ProfileProvider>
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
          const {item, sharedElementIdSuffix} = route.params;
          return [
            {
              id: `item.${item.id}.photo.${sharedElementIdSuffix}`,
              animation: 'fade',
              resize: 'auto',
            },
            {
              id: `item.${item.id}.card.${sharedElementIdSuffix}`,
              animation: 'fade',
              resize: 'none',
            },
            {
              id: `item.${item.id}.tag.${sharedElementIdSuffix}`,
              animation: 'fade',
              resize: 'scale',
            },
            {
              id: `item.${item.id}.like.${sharedElementIdSuffix}`,
              animation: 'fade',
              resize: 'scale',
            },
            {
              id: `item.${item.id}.edit.${sharedElementIdSuffix}`,
              animation: 'fade',
              resize: 'scale',
            },
            {
              id: `item.${item.id}.avatar.${sharedElementIdSuffix}`,
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
          const {item, sharedElementIdSuffix} = route.params;
          return [
            {
              id: `item.${item.id}.photo.${sharedElementIdSuffix}`,
              animation: 'move',
              resize: 'auto',
            },
            {
              id: `item.${item.id}.card.${sharedElementIdSuffix}`,
              animation: 'fade',
              resize: 'none',
            },
            {
              id: `item.${item.id}.tag.${sharedElementIdSuffix}`,
              animation: 'move',
              resize: 'scale',
            },
            {
              id: `item.${item.id}.like.${sharedElementIdSuffix}`,
              animation: 'move',
              resize: 'scale',
            },
            {
              id: `item.${item.id}.edit.${sharedElementIdSuffix}`,
              animation: 'move',
              resize: 'scale',
            },
            {
              id: `item.${item.id}.avatar.${sharedElementIdSuffix}`,
            },
          ];
        }}
      />
      {/* Perhaps a preview Screen/Modal. This could be handled in the ItemDetails component */}
    </Stack.Navigator>
  </ProfileProvider>
);

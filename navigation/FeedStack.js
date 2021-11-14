import React from 'react';
import {TransitionPresets} from '@react-navigation/stack';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import FeedScreen from '../screens/feed/Feed';
import ItemDetailsScreen from '../screens/feed/ItemDetails';

const Stack = createSharedElementStackNavigator();

export const FeedStack = () => (
  <Stack.Navigator initialRouteName={'Feed'}>
    <Stack.Screen
      name={'Feed'}
      component={FeedScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      /* handle looking at remixes of original item pressed in the component? */
      /* On press of a remix we will navigation.push the remix on the stack leaving the back 
                    functionality in place (maybe use pop). We will have an x to bring users back to the feed. */
      name={'ItemDetails'}
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

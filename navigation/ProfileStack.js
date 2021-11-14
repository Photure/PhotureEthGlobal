import React from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import ProfileScreen from '../screens/profile/Profile';
import ProfileItemScreen from '../screens/profile/ProfileItem';

const Stack = createSharedElementStackNavigator();

export const ProfileStack = () => (
  <Stack.Navigator initialRouteName={'Profile'}>
    <Stack.Screen
      name={'Profile'}
      component={ProfileScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      // Similar functionality to how we're handling this in Feed.
      /* handle looking at remixes of original item pressed in the component? */
      /* On press of a remix we will navigation.push the remix on the stack leaving the back 
                    functionality in place (maybe use pop). We will have an x to bring users back to the feed. */
      name={'Profile Item Details'}
      component={ProfileItemScreen}
      options={{headerShown: false}}
    />
    {/* Perhaps a preview Screen/Modal. This could be handled in the ItemDetails component */}
  </Stack.Navigator>
);

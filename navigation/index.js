import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {getFocusedRouteNameFromRoute} from '@react-navigation/core';
import {AnimatedTabBarNavigator} from 'react-native-animated-nav-tab-bar';
import {useColorMode, useTheme} from 'native-base';

import {Art} from '../icons/Art';
import {Home as HomeIcon} from '../icons/Home';
import {Profile as ProfileIcon} from '../icons/Profile';

import {FeedStack} from './FeedStack';
import {ProfileStack} from './ProfileStack';
import {CameraStack} from './CameraStack';

import {CameraProvider} from '../contexts/CameraContext';

const TabNavigator = AnimatedTabBarNavigator();

export default function Navigation() {
  const {colorMode} = useColorMode();
  const {colors} = useTheme();

  const setTabBarVisibility = route => {
    console.log('set route', route);
    const routeName = getFocusedRouteNameFromRoute(route);
    const {hideTabBar} =
      routeName === 'TakePhoto' && route?.state?.routes[0]?.params;
    if (
      routeName === 'ItemDetails' ||
      routeName === 'ProfileItems' ||
      routeName === 'ProfileItemsOne' ||
      routeName === 'ItemDetailsOne' ||
      hideTabBar
    ) {
      return false;
    }
    return true;
  };

  const [selectedIndex, setSelectedIndex] = React.useState();

  return (
    <CameraProvider>
      <NavigationContainer>
        <TabNavigator.Navigator
          appearance={{
            floating: true,
            tabButtonLayout: 'less-rounded',
            tabBarBackground:
              colorMode === 'light' ? colors.gray['200'] : colors.gray['800'],
            dotCornerRadius: 10,
            whenActiveShow: 'icon-only',
            whenInactiveShow: 'icon-only',
            activeTabBackgrounds:
              colorMode === 'light' ? colors.gray['300'] : colors.gray['700'],
          }}
          tabBarOptions={{
            activeTintColor:
              colorMode === 'light'
                ? colors.indigo['600']
                : colors.indigo['400'],
            inactiveTintColor:
              colorMode === 'light' ? colors.black : colors.white,
            tabStyle: {
              height: 72,
              borderRadius: 10,
            },
          }}
          initialRouteName={'FeedStack'}>
          <TabNavigator.Screen
            name={'FeedStack'}
            component={FeedStack}
            options={({route}) => ({
              tabBarVisible: setTabBarVisibility(route),
              tabBarIcon: ({focused, color, size}) => (
                <HomeIcon color={color} />
              ),
            })}
          />
          <TabNavigator.Screen
            name={'CameraStack'}
            component={CameraStack}
            options={({route}) => ({
              tabBarVisible: setTabBarVisibility(route),
              tabBarIcon: ({focused, color, size}) => <Art color={color} />,
            })}
          />
          <TabNavigator.Screen
            name={'ProfileStack'}
            component={ProfileStack}
            options={({route}) => ({
              tabBarVisible: setTabBarVisibility(route),
              tabBarIcon: ({focused, color, size}) => (
                <ProfileIcon color={color} />
              ),
            })}
          />
        </TabNavigator.Navigator>
      </NavigationContainer>
    </CameraProvider>
  );
}

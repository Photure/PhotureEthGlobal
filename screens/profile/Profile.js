import React from 'react';
import StickyParallaxHeader from 'react-native-sticky-parallax-header';

import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar, Dimensions} from 'react-native';
import {useTheme, useColorMode, View, FlatList} from 'native-base';

import ProfileCard from '../../components/ProfileCard/ProfileCard';

const {height, width} = Dimensions.get('window');

const responsiveHeight = h => height * (h / 100);

const containerWidth = width - 64;

const data = [
  {
    id: '1',
    title: 'Tree Walk',
    walletAddress: '0xccf3e94792cd0b3484f54e6110ae1b3445a67cc4',
    date: '0.4 MATIC',
    tag: 'Nature',
    imageLink:
      'https://s3.amazonaws.com/crowdriff-media/mirror/6315b0b40448afe22a7a15f3231b2e4298aa16b334f757e20a089415120eee5a.jpg',
  },
  {
    id: '2',
    title: 'Square Flower',
    walletAddress: '0xccf3e94792cd0b3484f54e6110ae1b3445a67cc4',
    date: '0.4 MATIC',
    tag: 'Flower',
    imageLink:
      'https://www.thisiscolossal.com/wp-content/uploads/2016/07/flower-1.jpg',
  },
  {
    id: '3',
    title: 'Whats up?',
    walletAddress: '0xccf3e94792cd0b3484f54e6110ae1b3445a67cc4',
    date: '0.4 MATIC',
    tag: 'Sky',
    imageLink: 'https://images.wsj.net/im-298298?width=1280&size=1',
  },
  {
    id: '4',
    title: 'Petal to the City',
    walletAddress: '0xccf3e94792cd0b3484f54e6110ae1b3445a67cc4',
    date: '0.4 MATIC',
    tag: 'Statue',
    imageLink:
      'https://res.cloudinary.com/atlanta/images/f_auto,q_auto/v1599799897/newAtlanta.com/hero_outdoors_lg-1/hero_outdoors_lg-1.jpg?_i=AA',
  },
  {
    id: '5',
    title: 'My Christmas Flower',
    walletAddress: '0xccf3e94792cd0b3484f54e6110ae1b3445a67cc4',
    date: '0.4 MATIC',
    tag: 'Flower',
    imageLink:
      'https://www.gardeningknowhow.com/wp-content/uploads/2016/02/poinsettia-outdoors.jpg',
  },
  {
    id: '6',
    title: 'River Trip',
    walletAddress: '0xccf3e94792cd0b3484f54e6110ae1b3445a67cc4',
    date: '0.4 MATIC',
    tag: 'Water',
    imageLink:
      'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/virginia/BR1607_1_c618f8d9-a7bd-407d-8934-1307566c930d.jpg',
  },
  {
    id: '7',
    title: 'Mountain Trail',
    walletAddress: '0xccf3e94792cd0b3484f54e6110ae1b3445a67cc4',
    date: '0.4 MATIC',
    tag: 'Fall',
    imageLink:
      'https://bigseventravel.com/wp-content/uploads/2020/06/Screen-Shot-2020-06-24-at-2.51.41-PM.png',
  },
  {
    id: '8',
    title: 'Fire in the Field',
    walletAddress: '0xccf3e94792cd0b3484f54e6110ae1b3445a67cc4',
    date: '0.4 MATIC',
    tag: 'Fire',
    imageLink:
      'https://assets.newatlas.com/dims4/default/0412114/2147483647/strip/true/crop/2500x1666+0+0/resize/728x485!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2F68%2F38%2F1eaf35774e1ab0427ac04a664d65%2Foriginal-2.jpg',
  },
  {
    id: '9',
    title: 'Port of Pier',
    walletAddress: '0xccf3e94792cd0b3484f54e6110ae1b3445a67cc4',
    date: '0.4 MATIC',
    tag: 'City',
    imageLink:
      'https://i.insider.com/577fc85c88e4a7531b8b6941?width=1136&format=jpeg',
  },
  {
    id: '10',
    title: 'Cold River',
    walletAddress: '0xccf3e94792cd0b3484f54e6110ae1b3445a67cc4',
    date: '15th June 2021',
    tag: 'Winter',
    imageLink:
      'https://cdn.outdoors.org/wp-content/uploads/2021/11/03080225/Maine-Woods-Photo-by-Cait-Bourgault_Photos-93.jpg',
  },
];

const ProfileScreen = ({navigation, route}) => {
  const {colorMode} = useColorMode();
  const {colors} = useTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          colorMode === 'light' ? colors.gray['50'] : colors.gray['900'],
      }}>
      <View
        style={{
          backgroundColor: '#4e36c6',
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: 100,
          zIndex: -1000,
        }}
      />
      <StickyParallaxHeader
        bounces={false}
        headerType="AvatarHeader"
        image={require('../../avatar.png')}
        title={`0xccf3...7cC4`}
        backgroundColor="#4e36c6"
        parallaxHeight={responsiveHeight(28)}
        subtitle={`${data.length} Creations`}>
        <FlatList
          borderRadius={16}
          data={data}
          contentContainerStyle={{
            alignItems: 'center',
            paddingBottom: 64,
          }}
          numColumns={2}
          renderItem={({item, index}) => (
            <ProfileCard
              {...item}
              isFromDetails={false}
              index={index}
              containerWidth={containerWidth / 2}
              onPress={() => {
                navigation.push('ProfileItems', {
                  item,
                });
                StatusBar.setHidden(true, 'slide');
              }}
            />
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          bounces={false}
        />
      </StickyParallaxHeader>
    </SafeAreaView>
  );
};
export default ProfileScreen;

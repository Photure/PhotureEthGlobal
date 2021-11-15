import React from 'react';
import StickyParallaxHeader from 'react-native-sticky-parallax-header';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Image, Dimensions} from 'react-native';
import {
  Box,
  useTheme,
  useColorMode,
  Stack,
  Text,
  View,
  FlatList,
} from 'native-base';

const {height, width} = Dimensions.get('window');

const responsiveHeight = h => height * (h / 100);

const containerWidth = width - 64;

const data = [
  {
    id: '1',
    title: 'The Garden City',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Flower',
  },
  {
    id: '2',
    title: 'The Test City',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Flower',
  },
  {
    id: '3',
    title: 'The Testing City',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Flower',
  },
  {
    id: '4',
    title: 'The 123 City',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Flower',
  },
  {
    id: '5',
    title: 'The Garden City',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Flower',
  },
  {
    id: '6',
    title: 'The Garden City',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Flower',
  },
  {
    id: '7',
    title: 'The Test City',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Flower',
  },
  {
    id: '8',
    title: 'The Testing City',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Flower',
  },
  {
    id: '9',
    title: 'The 123 City',
    walletAddress: '0xccf3...7cC4',
    date: '0.4 MATIC',
    tag: 'Flower',
  },
  {
    id: '10',
    title: 'The Garden City',
    walletAddress: 'Paula Green',
    date: '15th June 2021',
    tag: 'Flower',
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
            <Box
              my={3}
              style={index % 2 === 0 ? {marginRight: 12} : {marginLeft: 12}}
              overflow="hidden"
              width={containerWidth / 2}
              height="200"
              shadow={2}
              borderRadius={10}>
              <Image
                source={{
                  uri: 'https://www.thisiscolossal.com/wp-content/uploads/2016/07/flower-1.jpg',
                }}
                style={{
                  borderRadius: 10,
                  resizeMode: 'cover',
                  width: '100%',
                  height: '100%',
                }}
              />
              <Stack
                p={4}
                position="absolute"
                width="90%"
                left="5%"
                bottom={5}
                borderRadius="lg"
                _light={{
                  bg: 'gray.50',
                  opacity: 0.8,
                }}
                _dark={{
                  bg: 'gray.700',
                  opacity: 0.8,
                }}>
                <Stack space={1} shadow={2}>
                  <Text
                    fontSize="xl"
                    _light={{
                      color: 'black',
                    }}
                    _dark={{
                      color: 'white',
                    }}>
                    Testing
                  </Text>
                  <Text
                    fontSize="sm"
                    _light={{
                      c: 'gray.500',
                    }}
                    _dark={{
                      c: 'gray.700',
                    }}>
                    0.4 MATIC
                  </Text>
                </Stack>
              </Stack>
            </Box>
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

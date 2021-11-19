import React, {useContext, useEffect} from 'react';
import StickyParallaxHeader from '../../components/react-native-sticky-parallax-header';

import {SafeAreaView} from 'react-native-safe-area-context';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import {StatusBar, Dimensions} from 'react-native';
import {useTheme, useColorMode, View, FlatList} from 'native-base';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import {ProfileContext} from '../../contexts/ProfileContext';

const {height, width} = Dimensions.get('window');

const responsiveHeight = h => height * (h / 100);

const containerWidth = width - 64;

const ProfileScreen = ({navigation, route}) => {
  const {galleryData} = useContext(ProfileContext);
  const {colorMode} = useColorMode();
  const wc = useWalletConnect();
  const {colors} = useTheme();

  useEffect(() => {
    if (
      (!wc.connected && wc?.connect) ||
      (!wc?.session?.connected && wc?.connect)
    ) {
      wc.connect({
        chainId: 137,
      });
    }
  }, [wc.connected]);

  const transformProfileData = () => {
    const dataForFlatlist = [];
    galleryData.forEach((item, index) => {
      const {token_id: id, owner_of: walletAddress = '', price: date} = item;
      const {
        image: imageLink,
        name: title,
        tag,
        children = [],
        likes = [],
        description,
        timestamp,
        parent,
        adam,
        file_type,
      } = item.metadata;

      dataForFlatlist.push({
        id,
        title,
        walletAddress: walletAddress || '',
        date,
        tag: !!tag ? tag : 'Nature',
        imageLink,
        children,
        likes,
        description,
        timestamp,
        parent,
        adam,
        file_type,
      });
    });
    return dataForFlatlist;
  };

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
        image={
          'https://avatars.dicebear.com/api/pixel-art/${walletAddress}.svg'
        }
        title={`0xccf3...7cC4`}
        walletAddress={wc.accounts[0]}
        leftTopIcon={require('../../icons/faucet.png')}
        rightTopIcon={require('../../icons/cog.png')}
        backgroundColor="#4e36c6"
        parallaxHeight={responsiveHeight(28)}
        subtitle={`${transformProfileData().length} Creations`}>
        <FlatList
          borderRadius={16}
          data={transformProfileData()}
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

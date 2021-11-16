import React from 'react';
import {Stack, HStack, Avatar, Text} from 'native-base';
import {SharedElement} from 'react-navigation-shared-element';

const CardInfo = ({walletAddress, title, date, id}) => {
  return (
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
        <HStack space={1} size="sm" alignItems="center">
          <SharedElement id={`item.${id}.avatar`}>
            <Avatar
              size="sm"
              source={require('../../../avatar.png')}
              opacity={100}
            />
          </SharedElement>
          <Text
            fontSize="sm"
            opacity={100}
            _light={{
              c: 'gray.500',
              opacity: 1,
            }}
            _dark={{
              c: 'gray.700',
              opacity: 1,
            }}>
            {`${walletAddress.substring(0,4)}...${walletAddress.substring(walletAddress.length-4,walletAddress.length)}`}
          </Text>
        </HStack>
        <Text
          fontSize="xl"
          _light={{
            color: 'black',
          }}
          _dark={{
            color: 'white',
          }}>
          {title}
        </Text>
        <Text
          fontSize="sm"
          _light={{
            c: 'gray.500',
          }}
          _dark={{
            c: 'gray.700',
          }}>
          {date}
        </Text>
      </Stack>
    </Stack>
  );
};

export default CardInfo;

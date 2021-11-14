import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView,TouchableOpacity } from  'react-native';
import { useProfileContext } from '../../contexts/ProfileContext';

export default function ProfileScreen(){
    const { galleryData, postItemForSale, createNFT, getNFT} = useProfileContext()
    console.log('galleryData',galleryData)

    // const handleProfileItemPress = 
    return (
    <SafeAreaView
        style={styles.container}
    >
        <FlatList
            data ={galleryData}
            renderItem={(props) => 
                <TouchableOpacity 
                // onLongPress={() => __DEV__ && createNFT('String')} 
                onPress={()=>postItemForSale(props.item)}
                >
                    <Text>
                        {props.item.metadata.image}
                    </Text>
                </TouchableOpacity>
            }
        />
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems: 'center'
    }
})
import React, {useState, useEffect} from 'react';
import {Modal, Button, FormControl, Stack, Input, Text} from 'native-base';
import { Alert } from 'react-native';

export default function SellModal({showModal, setShowModal, onPress, getUSDConversion}) {
  const [salePrice, setSalePrice] = useState('');
  let convertedPrice = ''
  const [errors, setErrors] = React.useState({
    hasError: false,
    message: '',
  });

  useEffect(() => {
       (async () => {
        console.log('here88')
        if(parseFloat(salePrice) > 0 ){
          console.log('priceInUSD', priceInUSD)
          const priceInUSD = await getUSDConversion(salePrice)
          console.log('priceInUSD', priceInUSD)
          convertedPrice = `$ ${priceInUSD}`
        }
      })()
  },[salePrice])

  const validate = () => {
    const decimal = salePrice.substr(salePrice.indexOf('.'));

    if (salePrice === undefined) {
      setErrors({
        hasError: true,
        message: 'Sale Price is Required',
      });
      return false;
    } else if (decimal.length > 3) {
      setErrors({
        hasError: true,
        message: 'Sale Price can only have two decimal values',
      });
      return false;
    }
    return true;
  };

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Sell NFT</Modal.Header>
        <Modal.Body>
          <FormControl isRequired isInvalid={'message' in errors}>
            <FormControl.Label>Price in MATIC</FormControl.Label>
            <Input keyboardType={'numeric'} onChangeText={value => setSalePrice(value)} />
            <Text>{`Approximately ${convertedPrice}`}</Text>
            <FormControl.ErrorMessage
              _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
              {errors.message}
            </FormControl.ErrorMessage>
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => {
                setShowModal(false);
              }}>
              Cancel
            </Button>
            <Button
              onPress={() => {
                if (validate()) {
                  Alert.alert('Are you sure', `This is approximately ${convertedPrice}`, [
                    {
                      onPress: () =>setShowModal(false),
                    text:'cancel'
                  },
                  {
                    onPress: () =>{
                      onPress(salePrice);
                      setShowModal(false);},
                      text:'ok'
                    }]
                    )
                }
              }}>
              List NFT
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

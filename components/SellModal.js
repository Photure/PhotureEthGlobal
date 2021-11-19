import React, {useState} from 'react';
import {Modal, Button, FormControl, Stack, Input} from 'native-base';

export default function SellModal({showModal, setShowModal, onPress}) {
  const [salePrice, setSalePrice] = useState('');
  const [errors, setErrors] = React.useState({
    hasError: false,
    message: '',
  });

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
            <Input onChangeText={value => setSalePrice(value)} />

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
                onPress();
                setShowModal(false);
              }}>
              Cancel
            </Button>
            <Button
              onPress={() => {
                if (validate()) {
                  setShowModal(false);
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

import React, {useState} from 'react';
import {Modal, Button, FormControl, Stack, Input} from 'native-base';

export default function SellModal({showModal, setShowModal, onPress}) {
  const [salePrice, setSalePrice] = useState(false);
  const [errors, setErrors] = React.useState({
    hasError: false,
    message: '',
  });

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Sell NFT</Modal.Header>
        <Modal.Body>
          <Stack py={4}>
            <FormControl
              isRequired /* isInvalid={()=> doesKeyHaveError('name') }*/
            >
              <FormControl.Label>Name</FormControl.Label>
              <Input onChangeText={value => setSalePrice(value)} />
              {errors.hasError ? (
                <FormControl.ErrorMessage
                  _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                  {errors.message}
                </FormControl.ErrorMessage>
              ) : null}
            </FormControl>
          </Stack>
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
                setShowModal(false);
              }}>
              Complete Purchase
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

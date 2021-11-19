import React from 'react';
import {Modal, Button, Text, Stack} from 'native-base';

export default function BuyModal({showModal, setShowModal, price, onPress}) {
  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Buy NFT</Modal.Header>
        <Modal.Body>
          <Stack py={4}>
            <Text textAlign="center">{`${price} MATIC`}</Text>
            <Text textAlign="center">{`${price} USD`}</Text>
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

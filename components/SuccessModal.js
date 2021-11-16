import React from 'react';
import {
    Modal,
    FormControl,
    Input,
    Button,
    WarningOutlineIcon,
    Select,
    CheckIcon,
    Center,
    TextArea,
  } from 'native-base';


  const tagOptions = [
    {
        label:'Nature',
        value:'Nature'
  },
    {
        label: 'Sports',
        value: 'Sports',
    },
    {
        label: 'Selfie',
        value: 'Selfie',
    },
    {
        label: 'Current Event',
        value: 'Current Event',
    },
    {
        label: 'Meme',
        value: 'Meme',
    },
    {
        label: 'News',
        value: 'News',
    },
    {
        label: 'Art',
        value: 'Art',
    },
    {
        label: 'Landmarks',
        value: 'Landmarks'
    }
]

export function SuccessModal ({transactionHash, clearTransactionHash}) {

    return (
        <Modal isOpen={transactionHash} onClose={() => clearTransactionHash()}>
                  <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>NFT Details</Modal.Header>
          <Modal.Body>

          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                onPress={() => clearTransactionHash()}
              >
                OK
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    )
}
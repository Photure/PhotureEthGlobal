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
    },
    {
        label: 'Style',
        value: 'Style'
    },

]

export default function PhotoFormModal ({showModal, setShowModal, handleMint, setFormValues, filePath, formValues, remixedItem}) {

    console.log('form shit', filePath, formValues, remixedItem)

    const [errors, setErrors] = React.useState({
        name: {
            hasError: false,
            message: ''
        },
        tag: {
            hasError: false,
            message: ''
        },
        description: {
            hasError: false,
            message: ''
        },
    });

    const doesKeyHaveError = (key) => !!errors[key].hasError

    // const validate = () => {
    //     const keys = Object.keys(formValues)
    //     const newErrorObject = errors
    //     keys.forEach(key => {
    //         if (formValues[key].length < 1) {
    //             const str2 = key.charAt(0).toUpperCase() + key.slice(1);
    //             newErrorObject[key] = {
    //                 hasError: true,
    //                 message: `${str2} is required`
    //             }
    //           }
    //     })
    //     setErrors(newErrorObject)
    //   };

    return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                  <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>NFT Details</Modal.Header>
          <Modal.Body>
            <FormControl isRequired /* isInvalid={()=> doesKeyHaveError('name') }*/>
              <FormControl.Label>Name</FormControl.Label>
              <Input 
                onChangeText={(value)=> setFormValues({
                    ...formValues,
                    name: value
                })}
              />
              {errors.name.hasError ?
                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>} _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.name.message}</FormControl.ErrorMessage>
                :
                null
                }
            </FormControl>
            <FormControl isRequired /* isInvalid={errors.description.hasError} */ mt="3">
              <FormControl.Label>Description</FormControl.Label>
              <TextArea
              onChangeText={(value)=> setFormValues({
                  ...formValues,
                description: value
            })}
            />
            {errors.description.hasError ?
                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>} _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>{errors.description.message}</FormControl.ErrorMessage>
                :
                null
                }
            </FormControl>
            <FormControl mt="3" isRequired /* isInvalid={errors.tag.hasError} */>
        <FormControl.Label>Choose Tag</FormControl.Label>
        <Select
          minWidth="200"
          accessibilityLabel="Choose Service"
          placeholder="Choose Service"
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size={5} />,
          }}
          mt="1"
          onValueChange={value=> setFormValues({
            ...formValues,
              tag: value
          })}
        >
            {tagOptions.map(item => 
                <Select.Item label={item.label} value={item.value} />
                )}
        </Select>
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          Please make a selection!
        </FormControl.ErrorMessage>
      </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                    // validate()
                    // if(doesKeyHaveError('name') || doesKeyHaveError('description') || doesKeyHaveError('tag')){
                    //     console.log('here', formValues, errors)
                    //     return
                    // }
                    handleMint(filePath, formValues, remixedItem) // response should be transactionHash
                    setShowModal(false)
                }}
              >
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    )
}
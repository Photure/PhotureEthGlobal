import React from "react"
import { AlertDialog, Button, Center, NativeBaseProvider } from "native-base"


const errorMap= [
    'Error uploading file to IPFS',
    'Error uploading Metadata',
    'Error Minting NFT'
]

export const AlertModal = ({errorCode, handleRetry, filePath, formValues, remixedItem}) => {
  const [isOpen, setIsOpen] = React.useState(true)

  const onClose = () => setIsOpen(false)

  const cancelRef = React.useRef(null)
  return (
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Minting Failed</AlertDialog.Header>
          <AlertDialog.Body>
              {`Error Code: ${errorCode}, ${errorMap[errorCode]}`}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={() => {

                    onClose
                }}
                ref={cancelRef}
              >
                Cancel
              </Button>
              <Button colorScheme="danger" onPress={() => {
                  handleRetry(errorCode, filePath, formValues, remixedItem)
                  onClose
                  }}>
                Retry
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
  )
}
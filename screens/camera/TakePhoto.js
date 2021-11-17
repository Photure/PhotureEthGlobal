import React, {useEffect, useState, useRef, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageBackground,
} from 'react-native';
import {
  Camera,
  useCameraDevices,
  CameraPreset,
} from 'react-native-vision-camera';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Box, Stack, Button, Icon} from 'native-base';
import {FlipCamera} from '../../assets/FlipCamera';
import {Flash} from '../../assets/Flash';
import {FlashOff} from '../../assets/FlashOff';
import {Trash} from '../../assets/Trash';
import PhotoFormModal from '../../components/PhotoFormModal';
import {CameraContext} from '../../contexts/CameraContext';
import {AlertModal} from '../../components/AlertDialog';
import {SuccessModal} from '../../components/SuccessModal';

export default function TakePhotoScreen() {
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    tag: '',
  });
  const {
    handleMint,
    handleRetry,
    isLoadingModalVisible,
    errorCode,
    onTrash,
    transactionHash,
    clearTransactionHash,
  } = useContext(CameraContext);
  const devices = useCameraDevices('wide-angle-camera');
  const [cameraPosition, updateCameraPosition] = useState('back');
  const device = devices[cameraPosition];
  const [isRecording, updateIsRecording] = useState(false);
  const [hasPermissions, updatePermissions] = useState(false);
  const [photo, updatePhoto] = useState(null);
  const cameraRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pressableRef = useRef(0);
  const [toggleFlash, setToggleFlash] = useState('off');
  const navigation = useNavigation();
  const shouldHideTabBar = !!photo;
  const tabBarFlipperCallback = () =>
    navigation.setParams({hideTabBar: !shouldHideTabBar});
  const [showModal, setShowModal] = useState(false);

  console.log(device);

  const handleOnLongPress = () => {
    // toggleIsRecording(true);
    const options = {
      maxFileSize: 20000000,
    };
    cameraRef.current.startRecording({
      // flash: 'on',
      onRecordingFinished: video => console.log(video),
      onRecordingError: error => console.error(error),
    });
    //   .then(video => {
    //     toggleIsRecording(false);
    //     setPreviewImageURI(video.uri);
    //     toggleShowPreviewVideo(true);
    //   })
    //   .catch(error => console.log(error));
  };

  const handleOnPressOut = async (pressEvent): Promise<void> => {
    const {timeStamp} = pressEvent;

    const diff = timeStamp - pressableRef.current.timeStamp;
    if (diff < 500) {
      const options = {
        enableAutoDistortionCorrection: false,
        enableAutoRedEyeReduction: true,
        enableAutoStabilization: true,
        flash: toggleFlash,
        qualityPrioritization: 'balanced',
        skipMetadata: true,
      };
      const photo = await cameraRef.current.takePhoto(options);
      console.log(photo);
      tabBarFlipperCallback();
      updatePhoto(photo.path);
    } else {
      cameraRef.current.stopRecording();
    }
  };

  const handleOnPressIn = pressEvent => {
    pressableRef.current = pressEvent;
  };

  const perms = ['not-determined', 'denied'];
  const isFocused = useIsFocused();
  const checkPermissions = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    const microphonePermission = await Camera.getMicrophonePermissionStatus();
    const isAuthorized = value => value === 'authorized';
    console.log('cam and mic', cameraPermission, microphonePermission);
    if (isAuthorized(cameraPermission) && isAuthorized(microphonePermission)) {
      updatePermissions(true);
    } else if (
      !isAuthorized(cameraPermission) &&
      !isAuthorized(microphonePermission)
    ) {
      cameraPermission = await Camera.requestCameraPermission();
      microphonePermission = await Camera.requestMicrophonePermission();
      updatePermissions(
        isAuthorized(cameraPermission) && isAuthorized(microphonePermission),
      );
    } else if (perms.includes(cameraPermission)) {
      cameraPermission = await Camera.requestCameraPermission();
      updatePermissions(isAuthorized(cameraPermission));
    } else if (perms.includes(microphonePermission)) {
      microphonePermission = await Camera.requestMicrophonePermission();
      updatePermissions(isAuthorized(microphonePermission));
    }

    // const [cameraPosition, updateCameraPosition] = useState('back')
    // console.log('devices',await Camera.getAvailableCameraDevices())        devices.back)
  };

  checkPermissions();

  const handleFlashPress = (): void => {
    if (toggleFlash === 'off') {
      setToggleFlash('on');
    } else {
      setToggleFlash('off');
    }
  };

  if (device == null || !hasPermissions)
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  if (!photo)
    return (
      // <PinchGestureHandler onGestureEvent={resolvePinchGesture}>
      <Animated.View style={StyleSheet.absoluteFill}>
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isFocused}
          preset={'high'}
          photo={true}
          video={true}
          audio={true}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              updateCameraPosition(
                cameraPosition === 'back' ? 'front' : 'back',
              );
            }}>
            <FlipCamera />
          </TouchableOpacity>
          <TouchableOpacity
            delayLongPress={501}
            onLongPress={handleOnLongPress}
            onPressOut={handleOnPressOut}
            onPressIn={handleOnPressIn}>
            <View style={styles.shutter} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFlashPress}>
            {toggleFlash === 'off' ? <FlashOff /> : <Flash />}
          </TouchableOpacity>
        </View>
      </Animated.View>
      // </PinchGestureHandler>
    );
  if (photo !== null) {
    console.log('photo1', formValues);
    return (
      <ImageBackground
        source={{uri: `file://${photo}`}}
        style={{flex: 1, height: '100%', width: '100%'}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator
            animating={isLoadingModalVisible}
            size={'large'}
            color={'red'}
          />
        </View>
        <TouchableOpacity
          disabled={isLoadingModalVisible}
          style={styles.recordingIndicator}
          onPress={() => {
            updatePhoto(null);
            onTrash();
            tabBarFlipperCallback();
          }}>
          <Trash />
        </TouchableOpacity>

        <Button
          disabled={isLoadingModalVisible}
          onPress={() => setShowModal(true)}
          style={styles.mintButton}>
          <Text>Mint NFT</Text>
        </Button>
        <PhotoFormModal
          setFormValues={setFormValues}
          handleMint={handleMint}
          showModal={showModal}
          setShowModal={setShowModal}
          filePath={`file:/${photo}`}
          formValues={formValues}
          remixedItem={null}
        />
        {errorCode !== null && errorCode >= 0 && (
          <AlertModal
            errorCode={errorCode}
            handleRetry={handleRetry}
            filePath={`file:/${photo}`}
            formValues={formValues}
            remixedItem={null}
          />
        )}
        {!!transactionHash && (
          <SuccessModal
            clearTransactionHash={clearTransactionHash}
            transactionHash={transactionHash}></SuccessModal>
        )}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  mintButton: {
    position: 'absolute',
    bottom: 40,
    width: '80%',
    // marginLeft: 'auto',
    // marginRight: 'auto',
    marginLeft: '30%',
    marginRight: '30%',
    // backgroundColor: 'transparent'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
    // justifyContent: 'flex-end',
  },
  buttonContainer: {
    marginTop: '170%',
    height: 75,
    maxHeight: 75,
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    margin: 20,
    marginBottom: 40,
  },
  buttonContainerTop: {
    flex: 1,
    height: 75,
    maxHeight: 75,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
    marginTop: 40,
  },
  shutter: {
    flex: 1,
    height: 75,
    width: 75,
    backgroundColor: '#FFFFFF',
    borderRadius: 37.5,
    borderColor: 'lightgrey',
    borderWidth: 8,
  },
  retakePhotoButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  continueButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,.3)',
    padding: 10,
    borderRadius: 50,
  },
  buffer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  space: {
    flex: 6,
  },
  previewImageStyle: {
    height: '100%',
    width: '100%',
  },
  recordingIndicator: {
    position: 'absolute',
    width: 25,
    height: 25,
    top: 72,
    left: 32,
  },
});

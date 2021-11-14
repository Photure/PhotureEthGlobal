import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Animated, TouchableOpacity, ActivityIndicator, Image } from  'react-native';
import {Camera, useCameraDevices, CameraPreset } from 'react-native-vision-camera'
import { useIsFocused } from '@react-navigation/native';
import { Box, Stack, Button, Icon } from 'native-base'
import { FlipCamera } from '../../assets/FlipCamera';

export default function TakePhotoScreen(){
    const devices = useCameraDevices('wide-angle-camera')
    const [device, updateDevice] = useState(devices.back)
    const [isRecording, updateIsRecording] = useState(false)
    const [hasPermissions, updatePermissions] = useState(false)
    const [photo, updatePhoto] = useState(null)
    const cameraRef = useRef(null)
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pressableRef = useRef(0);

    const handleOnLongPress = () => {
        toggleIsRecording(true);
        const options = {
          maxFileSize: 20000000,
        };
        cameraRef.current
          .startRecording({
            // flash: 'on',
            onRecordingFinished: (video) => console.log(video),
            onRecordingError: (error) => console.error(error),
          })
        //   .then(video => {
        //     toggleIsRecording(false);
        //     setPreviewImageURI(video.uri);
        //     toggleShowPreviewVideo(true);
        //   })
        //   .catch(error => console.log(error));
      };

      const handleOnPressOut = async (pressEvent): Promise<void> => {
        const { timeStamp } = pressEvent;
    
        const diff = timeStamp - pressableRef.current.timeStamp;
        if (diff < 500) {
          const options = {
            enableAutoDistortionCorrection: true,
            enableAutoRedEyeReduction: true,
            enableAutoStabilization: true,
            flash: 'off',
            qualityPrioritization: 'balanced',
            skipMetadata: true,
            // base64: false,
            // exif: false,
            // skipProcessing: true,
            // onPictureSaved: handlePictureSaved,
          };
          const photo = await cameraRef.current.takePhoto(options);
          console.log(photo)
          updatePhoto(photo.path)
        } else {
          cameraRef.current.stopRecording();
        }
      };

      const handleOnPressIn = pressEvent => {
        pressableRef.current = pressEvent;
      };


    const perms = [
        'not-determined',
        'denied'
    ]
    const isFocused = useIsFocused()
    const checkPermissions = async() =>{
            const cameraPermission = await Camera.getCameraPermissionStatus()
            const microphonePermission = await Camera.getMicrophonePermissionStatus()
            const isAuthorized = (value) => value ==='authorized'
            console.log('cam and mic', cameraPermission, microphonePermission)
            if(isAuthorized(cameraPermission) && isAuthorized(microphonePermission)){
                updatePermissions(true)
            } else if (!isAuthorized(cameraPermission) && !isAuthorized(microphonePermission)){
                cameraPermission = await Camera.requestCameraPermission()
                microphonePermission = await Camera.requestMicrophonePermission()
                updatePermissions(isAuthorized(cameraPermission) && isAuthorized(microphonePermission))
            } else if (perms.includes(cameraPermission)) {
                cameraPermission = await Camera.requestCameraPermission()
                updatePermissions(isAuthorized(cameraPermission))
            } else if (perms.includes(microphonePermission)) {
                microphonePermission = await Camera.requestMicrophonePermission()
                updatePermissions(isAuthorized(microphonePermission))
            }
            
            console.log('devices',await Camera.getAvailableCameraDevices())
            updateDevice(devices.back)
        }
    
    checkPermissions()

    if (device == null || !hasPermissions) return(
        <View style={styles.container}>
            <ActivityIndicator size={'large'}/>
        </View>)
        if(!photo)return (
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
                        {/* <TouchableOpacity
                            onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                ? Camera.Constants.Type.front
                                : Camera.Constants.Type.back,
                            );
                            }}>
                            <FlipCamera />
                        </TouchableOpacity> */}
                        <Box>

                        </Box>
                        <Stack></Stack>
                        <Button></Button>
                            <TouchableOpacity
                            delayLongPress={501}
                            onLongPress={handleOnLongPress}
                            onPressOut={handleOnPressOut}
                            onPressIn={handleOnPressIn}>
                            <View style={styles.shutter} />
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={handleFlashPress}>
                            {toggleFlash === Camera.Constants.FlashMode.off ? (
                            <FlashOff />
                            ) : (
                            <Flash />
                            )}
                        </TouchableOpacity> */}
                  </View>
                    </Animated.View>
            // </PinchGestureHandler>
        )
        if(photo !== null) {
            console.log('photo1',photo)
            return (<View style={styles.container}>
                <Image
                    source={{uri: `file://${photo}`}}
                    style={{flex:1, height: '100%', width: '100%'}}
                />
            </View>
            )}
    }

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems: 'center'
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
        justifyContent: "space-between",
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
        backgroundColor: '#ff3c2f',
        borderRadius: 25,
        width: 25,
        height: 25,
        top: 72,
        right: 32,
      },
})
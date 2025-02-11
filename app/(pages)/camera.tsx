import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Camera,CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import FriendsList from './sendList';
import RNPickerSelect from 'react-native-picker-select';

const { width, height } = Dimensions.get('window');

export default function App() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [type, setType] = useState<'back' | 'front'>('back');
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [showFriends, setShowFriends] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(5);  // Default duration
    const cameraRef = useRef<Camera>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            setPhotoUri(photo.uri);
            setVideoUri(null); 
        }
    };

    const recordVideo = async () => {
        if (cameraRef.current) {
            if (isRecording) {
                cameraRef.current.stopRecording();
                setIsRecording(false);
            } else {
                setIsRecording(true);
                const video = await cameraRef.current.recordAsync();
                setVideoUri(video.uri);
                setPhotoUri(null); 
                setIsRecording(false);
            }
        }
    };

    const sendPicture = () => {
        if (photoUri) {
            setShowFriends(true);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (!hasPermission) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            {showFriends ? (
                <FriendsList photoUri={photoUri} duration={duration} />
            ) : (
                photoUri || videoUri ? (
                    <>
                        <RNPickerSelect
                            onValueChange={(value) => setDuration(value)}
                            items={[
                                { label: "1", value: 1 },
                                { label: "2", value: 2 },
                                { label: "3", value: 3 },
                                { label: "4", value: 4 },
                                { label: "5", value: 5 },
                                { label: "6", value: 6 },
                                { label: "7", value: 7 },
                                { label: "8", value: 8 },
                                { label: "9", value: 9 },
                                { label: "10", value: 10 },
                            ]}
                            placeholder={{ label: "Select duration", value: null }}
                        />
                        <Image source={{ uri: photoUri }} style={styles.camera} />
                        <TouchableOpacity style={styles.sendButton} onPress={sendPicture}>
                            <Text style={styles.text}> Send </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <CameraView style={styles.camera} facing={type} ref={cameraRef}>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    setType(type === 'back' ? 'front' : 'back');
                                }}>
                                <Text style={styles.text}> Flip </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={takePicture}>
                                <Text style={styles.text}> Take Picture </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={pickImage}>
                                <Text style={styles.text}> Gallery </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={recordVideo}>
                                <Text style={styles.text}>{isRecording ? 'Stop Recording' : 'Take Video'}</Text>
                            </TouchableOpacity>
                        </View>
                    </CameraView>
                )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'yellow',
    },
    camera: {
        flex: 1,
        width: width,
        height: height,
    },
    media: {
        flex: 1,
        width: width,
        height: height,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
    },
    button: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: 10,
        borderRadius: 50,
        marginHorizontal: 5,
    },
    sendButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 255, 0, 0.7)',
        padding: 15,
        borderRadius: 50,
    },
    text: {
        fontSize: 14,
        color: 'white',
    },
});

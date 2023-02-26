import { StatusBar } from 'expo-status-bar';
import { Camera, CameraCapturedPicture, CameraType } from 'expo-camera';
import { useState, useRef, Dispatch, SetStateAction, useContext } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Amplify, Storage } from 'aws-amplify';
import awsconfig from '../src/aws-exports';
import axios from 'axios';
import uuid from 'react-native-uuid';
import { BonsaiContext } from '../bonsHiContext';
Amplify.configure(awsconfig);

export default function CameraElement() {
  const [type, setType] = useState(CameraType.back);
  const cameraRef = useRef<Camera>(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [photo, setPhoto] = useState<CameraCapturedPicture>();
  const { setViewCamera, viewCamera, user } = useContext(BonsaiContext);

  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View className="flex-1 justify-center">
        <Text className="text-center">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.1 };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data;

      setPhoto(source);

      if (source) {
        try {
          await cameraRef.current.pausePreview();
          setPhotoTaken(true);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const exitPicture = async () => {
    if (cameraRef.current) {
      try {
        await cameraRef.current.resumePreview();
        setPhotoTaken(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const uploadPhoto = async () => {
    if (photo) {
      console.log(photo);
      try {
        const img = await fetchImageFromUri(photo.uri);
        let uid = uuid.v4().toString() + '.jpg';
        await Storage.put('photos/' + user + '/' + uid, img, {
          contentType: 'image/jpg',
          progressCallback(progress) {
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          },
        });
        await Storage.get('photos/' + uid)
          .then((result) => {
            imgToDB(result);
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log('ERROR: ', error);
      }
    }
  };

  const imgToDB = async (result: string) => {
    const request = await axios
      .post('http://192.168.86.32:3001/upload', {
        username: user,
        data: result,
      })
      .then(function (response) {
        let data = response.data;
        console.log(data);
        setViewCamera(!viewCamera);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const fetchImageFromUri = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  return (
    <View className="flex-1 justify-center">
      <Camera type={type} className="flex-1" ref={cameraRef}>
        <View className="flex-1">
          {photoTaken && (
            <View className="flex-1 justify-between">
              <View className="pt-12 pl-4">
                <TouchableOpacity onPress={exitPicture}>
                  <MaterialIcons name="cancel" size={40} color="white" />
                </TouchableOpacity>
              </View>

              <View className="items-center pb-16">
                <TouchableOpacity
                  className="py-4 px-6 bg-white rounded-lg"
                  onPress={uploadPhoto}
                >
                  <Text className="text-black font-bold text-xl">Upload</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {!photoTaken && (
            <View className="flex-1 justify-between">
              <View className="pt-12 pl-4 flex items-start">
                <TouchableOpacity
                  className="bg-white p-3 rounded-full"
                  onPress={() => setViewCamera(!viewCamera)}
                >
                  <MaterialIcons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <View className="flex items-center pb-12">
                <TouchableOpacity
                  onPress={takePicture}
                  className="bg-white p-6 rounded-full"
                >
                  <MaterialIcons name="camera-alt" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Camera>
      <StatusBar style="auto" />
    </View>
  );
}

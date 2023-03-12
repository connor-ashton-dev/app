import { StatusBar } from 'expo-status-bar';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BonsaiContext } from './bonsHiContext';
import CameraElement from './screens/CameraElement';

import HomeScreen from './screens/HomeScreen';
import Login from './screens/Login';
import ViewPictures from './screens/ViewPictures';

export default function App() {
  const [viewCamera, setViewCamera] = useState(false);
  const [viewPictures, setViewPictures] = useState(false);
  const [user, setUser] = useState('');
  return (
    //test comment to see if it worked
    <BonsaiContext.Provider
      value={{
        viewCamera,
        setViewCamera,
        user,
        setUser,
        viewPictures,
        setViewPictures,
      }}
    >
      {user == '' && <Login />}

      {user !== '' && (
        <View className="flex-1">
          {!viewCamera && !viewPictures && <HomeScreen />}
          {viewCamera && !viewPictures && <CameraElement />}
          {viewPictures && <ViewPictures />}
        </View>
      )}
      <StatusBar style="auto" />
    </BonsaiContext.Provider>
  );
}

import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { Dispatch, SetStateAction, useContext } from 'react';
import { BonsaiContext } from '../bonsHiContext';

const HomeScreen = () => {
  const { setViewCamera, viewCamera, user, viewPictures, setViewPictures } =
    useContext(BonsaiContext);
  return (
    <View className="flex-1 items-center bg-green-500">
      <Text className="pt-24 text-3xl text-white font-bold tracking-widest">
        Hello, {user}
      </Text>
      <Image
        source={require('../assets/tree.png')}
        style={{ width: 100, height: 100 }}
        className="my-20"
      />
      <View className="flex my-16 space-y-12">
        <TouchableOpacity
          onPress={() => setViewCamera(!viewCamera)}
          className="bg-white px-5 py-2 rounded-full flex items-center"
        >
          <Text className=" text-green-500 text-xl">Take Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setViewPictures(!viewPictures)}
          className="bg-white px-5 py-2 rounded-full flex items-center"
        >
          <Text className=" text-green-500 text-xl">View Pictures</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import React, { useEffect, useContext, useState, SetStateAction } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { BonsaiContext } from '../bonsHiContext';

import { Amplify, Storage } from 'aws-amplify';
import awsconfig from '../src/aws-exports';
import { S3ProviderListOutputItem } from '@aws-amplify/storage';

type PicData = {
  name: string;
  url: string;
};

const ViewPictures = () => {
  const { user, setViewPictures, viewPictures } = useContext(BonsaiContext);
  const [picList, setPicList] = useState<PicData[]>([]);

  const getPictures = async () => {
    Storage.list('photos/' + user + '/', { pageSize: 'ALL' }) // for listing ALL files without prefix, pass '' instead
      .then((result) => getUrlsFromKey(result.results))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getPictures();
  }, []);

  const createTwoButtonAlert = (name: string) =>
    Alert.alert('Alert Title', 'My Alert Msg', [
      {
        text: 'Delete Picture',
        style: 'destructive',
        onPress: () => deletePic(name),
      },
      {
        text: 'Cancel',
        // onPress: () => console.log('Cancel Pressed'),
      },
    ]);

  const getUrlsFromKey = async (data: any[]) => {
    data.forEach(async (item) => {
      const file = await Storage.get(item.key!, {
        level: 'public',
      });
      const url = await file.toString();
      setPicList((oldPicList) => [...oldPicList, { name: item.key, url: url }]);
    });
  };

  const deletePic = async (name: string) => {
    await Storage.remove(name)
      .then(() => {
        setPicList((oldValues) => {
          return oldValues.filter((item) => item.name !== name);
        });
      })
      .catch((error) => console.log(error));
  };

  return (
    <View className="py-16 flex-1 bg-green-500">
      <View className="py-5 mx-2 flex flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => setViewPictures(!viewPictures)}
          className="flex-1"
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View className="flex-1items-center">
          <Text className="text-white text-2xl font-bold tracking-widest">
            My Pictures
          </Text>
        </View>

        <View className="flex-1" />
      </View>

      <FlatList
        data={picList}
        numColumns={2}
        contentContainerStyle={{
          //   display: 'flex',
          //   flexDirection: 'column',
          //   alignItems: 'center',
          paddingVertical: 1,
          paddingHorizontal: 5,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="p-1"
            onLongPress={() => createTwoButtonAlert(item.name)}
          >
            <Image
              source={{ uri: item.url }}
              className="w-[180px] h-[200px] rounded-md"
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ViewPictures;

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { BonsaiContext } from '../bonsHiContext';

const DismissKeyboard = ({ children }: { children: React.ReactNode }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const Login = () => {
  const [name, setName] = useState('');
  const { setUser } = useContext(BonsaiContext);

  const handleSubmit = async () => {
    await axios
      .post(process.env.API_URL + '/login', {
        username: name,
      })
      .then(function(response) {
        let data = response.data;
        if (data.message === name) {
          console.log('going to sign in now');
          setUser(data.message);
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  return (
    <DismissKeyboard>
      <View className="flex-1 px-4 py-6 bg-green-500">
        <View className="mt-16">
          <Text className="text-3xl text-white font-bold tracking-widest">
            Welcome to BonsHi.
          </Text>
        </View>

        <TextInput
          placeholder="Username"
          className="text-xl font-bold tracking-widest h-12 border-b border-white my-16  text-white "
          onChangeText={(text) => setName(text)}
        />

        <View className="flex items-center ">
          <TouchableOpacity
            className="bg-white items-center w-36 py-2 rounded-lg"
            onPress={handleSubmit}
          >
            <Text className="text-green-500 text-xl font-bold">Go</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DismissKeyboard>
  );
};

export default Login;

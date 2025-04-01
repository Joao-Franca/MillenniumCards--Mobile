import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { storeData } from '../utils/storage';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (username && password) {
      await storeData(`user_${username}`, { username, password });
      Alert.alert('Sucess', 'User registered successfully!');
      navigation.navigate('Login');
    } else {
      Alert.alert('Error', 'Fill in all the fields!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Millennium Cards</Text>

      <Text style={styles.label}>User</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholder="Enter your username"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Enter your password"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Image
        source={require('../../assets/dark_magician.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontFamily: 'KronaOn-Regular',
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FFEB3B',
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#000',
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 32,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    fontFamily: "KronaOn-Regular",
    color: '#333',
  },
});

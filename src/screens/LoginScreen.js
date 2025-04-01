import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { getData, storeData } from '../utils/storage';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  const handleLogin = async () => {
    setLoading(true);
    startAnimation();

    const user = await getData(`user_${username}`);

    setTimeout(async () => {
      if (user && user.password === password) {
        await storeData('logged_user', { username });
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home', params: { username } }],
        });
      } else {
        Alert.alert('Erro', 'Invalid username or password');
        setLoading(false);
      }
    }, 2000);
  };

  const startAnimation = () => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.Image
          source={require('../../assets/eye_millennium.png')}
          style={[styles.loadingImage, { transform: [{ rotate: rotateInterpolate }] }]}
        />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Image
        source={require('../../assets/monster_card.png')}
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

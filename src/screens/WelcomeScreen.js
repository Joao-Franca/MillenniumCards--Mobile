import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <Text style={styles.title}>Millennium Cards</Text>

        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cadastroButton]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.cadastroText}>Sign up</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={require('../../assets/yugi.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D32F2F',
    justifyContent: 'space-between', // separa topo e imagem
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 0,
  },
  topContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: 'white',
    marginBottom: 20,
    fontFamily: 'KronaOn-Regular',
  },
  button: {
    width: '60%',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#F5C300',
  },
  cadastroButton: {
    backgroundColor: '#1F4E79',
  },
  loginText: {
    color: '#fff',
    fontSize: 25,
    fontFamily: 'Roboto-Bold',
  },
  cadastroText: {
    color: '#fff',
    fontSize: 25,
    fontFamily: 'Roboto-Bold',
  },
  image: {
    width: 320,
    height: 400,
    alignSelf: 'center',
  },
});

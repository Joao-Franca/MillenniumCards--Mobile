import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { storeData } from '../utils/storage';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (username && password) {
      await storeData(`user_${username}`, { username, password });
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      navigation.navigate('Login');
    } else {
      Alert.alert('Erro', 'Preencha todos os campos!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Millennium Cards</Text>

      <Text style={styles.label}>Usuário</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholder="Digite seu usuário"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Digite sua senha"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
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
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  image: {
    width: 180,
    height: 180,
    marginTop: 32,
  },
});

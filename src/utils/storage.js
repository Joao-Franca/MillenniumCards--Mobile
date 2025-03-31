import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getData = async (key) => {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const removeData = async (key) => {
  await AsyncStorage.removeItem(key);
};

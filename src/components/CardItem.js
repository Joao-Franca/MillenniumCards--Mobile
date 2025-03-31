import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CardItem({
  card,
  isFavorite,
  onToggleFavorite,
  isFavoritesScreen = false,
}) {
  const navigation = useNavigation();

  const favoriteIcon = isFavorite
    ? require('../../assets/favorite-filled.png')
    : require('../../assets/favorite.png');

  const backgroundImage = isFavoritesScreen
    ? require('../../assets/eye_red.png')
    : require('../../assets/eye_yellow.png');

  const backgroundColor = isFavoritesScreen ? '#FF9C9C' : '#FFF1BC';
  const borderColor = isFavoritesScreen ? '#D32F2F' : '#F5C300';

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        imageStyle={styles.backgroundImage}
        style={[styles.cardContainer, { backgroundColor, borderColor, borderWidth: 1 }]}
      >
        {/* Bloco com imagem e texto */}
        <TouchableOpacity
          onPress={() => navigation.navigate('CardDetail', { card })}
          style={styles.infoContainer}
        >
          <Image
            source={{ uri: card.card_images[0].image_url_small }}
            style={styles.cardImage}
          />
          <Text style={styles.cardName} numberOfLines={1}>
            {card.name}
          </Text>
        </TouchableOpacity>

        {/* Ícone de favorito separado à direita */}
        <TouchableOpacity onPress={onToggleFavorite}>
          <Image source={favoriteIcon} style={styles.favoriteIcon} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    borderRadius: 12,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    elevation: 2,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.15,
    borderRadius: 12,
  },
  cardImage: {
    width: 50,
    height: 75,
    marginRight: 12,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
  },
  favoriteIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
});

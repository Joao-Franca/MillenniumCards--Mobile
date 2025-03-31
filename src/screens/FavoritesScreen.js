import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Easing,
} from "react-native";
import { getData, storeData } from "../utils/storage";
import CardItem from "../components/CardItem";

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  const loadFavorites = async () => {
    const favs = await getData("favorites");
    if (favs) setFavorites(favs);
  };

  const loadUser = async () => {
    const user = await getData("logged_user");
    if (user?.username) setUsername(user.username);
  };

  const logout = async () => {
    await storeData("logged_user", null);
    navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    });
  };

  const toggleFavorite = async (card) => {
    const updated = favorites.filter((fav) => fav.id !== card.id);
    setFavorites(updated);
    await storeData("favorites", updated);
  };

  const startLoadingAnimation = () => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const handleBackToHome = () => {
    setLoading(true);
    startLoadingAnimation();

    setTimeout(() => {
      setLoading(false);
      navigation.navigate("Home");
    }, 2000);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadFavorites();
      loadUser();
    });
    return unsubscribe;
  }, [navigation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.Image
          source={require("../../assets/eye_millennium.png")}
          style={[styles.loadingImage, { transform: [{ rotate }] }]}
        />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header fixo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToHome}>
          <Image
            source={require("../../assets/back.png")}
            style={styles.headerIcon}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Millennium Cards</Text>

        <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
          <Image
            source={require("../../assets/profile.png")}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CardItem
            card={item}
            isFavorite={true}
            onToggleFavorite={() => toggleFavorite(item)}
            isFavoritesScreen={true}
          />
        )}
        ListHeaderComponent={() => (
          <View style={styles.deckLabel}>
            <Text style={styles.deckLabelText}>Yu-Gi-Oh! deck</Text>
          </View>
        )}
        contentContainerStyle={{
          paddingTop: 70,
          paddingHorizontal: 12,
          paddingBottom: 20,
        }}
      />

      {/* Modal do perfil */}
      <Modal visible={profileModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeIconWrapper}
              onPress={() => setProfileModalVisible(false)}
            >
              <Image
                source={require("../../assets/close.png")}
                style={styles.closeIcon}
              />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Hi, {username || "Usuário"}!</Text>

            <TouchableOpacity
              style={[styles.modalButton, styles.closeButton]}
              onPress={logout}
            >
              <Text style={styles.modalButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#D32F2F",
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  deckLabel: {
    backgroundColor: "#1F4E79",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignSelf: "stretch",
  },
  deckLabelText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
    elevation: 4,
    position: "relative",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1F4E79",
  },
  modalButton: {
    backgroundColor: "#1F4E79",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 12,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#D32F2F",
  },
  closeIconWrapper: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 6,
    zIndex: 2,
  },
  closeIcon: {
    width: 24,
    height: 24,
    tintColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
  },
});

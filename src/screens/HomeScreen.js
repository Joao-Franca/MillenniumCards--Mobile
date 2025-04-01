import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Animated,
  Easing,
} from "react-native";
import { storeData, getData } from "../utils/storage";
import CardItem from "../components/CardItem";

export default function HomeScreen({ navigation, route }) {
  const [cards, setCards] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [filter, setFilter] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchCards();
    loadFavorites();
    loadUser();
  }, []);

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

  const handleNavigateToFavorites = () => {
    setLoading(true);
    startLoadingAnimation();

    setTimeout(() => {
      setLoading(false);
      navigation.navigate("Favorites");
    }, 2000);
  };

  const handleCardPress = (card) => {
    setLoading(true);
    startLoadingAnimation();

    setTimeout(() => {
      setLoading(false);
      navigation.navigate("CardDetail", { card });
    }, 2000);
  };

  const fetchCards = async () => {
    const res = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php");
    const json = await res.json();
    setCards(json.data);
  };

  const toggleFavorite = async (card) => {
    const updatedFavorites = favorites.some((fav) => fav.id === card.id)
      ? favorites.filter((fav) => fav.id !== card.id)
      : [...favorites, card];

    setFavorites(updatedFavorites);
    await storeData("favorites", updatedFavorites);
  };

  const loadFavorites = async () => {
    const favs = await getData("favorites");
    if (favs) setFavorites(favs);
  };

  const loadUser = async () => {
    if (route.params?.username) {
      setUsername(route.params.username);
      await storeData("logged_user", { username: route.params.username });
    } else {
      const user = await getData("logged_user");
      if (user?.username) setUsername(user.username);
    }
  };

  const logout = async () => {
    await storeData("logged_user", null);
    navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    });
  };

  const filteredCards = cards.filter((card) => {
    const nameMatch = card.name.toLowerCase().includes(search.toLowerCase());
    const filterMatch =
      !filter || (card.type && card.type.toLowerCase().includes(filter));
    return nameMatch && filterMatch;
  });

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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleNavigateToFavorites}>
          <Image
            source={require("../../assets/cards.png")}
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

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search for letters"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor="#C5C5C5"
            keyboardType="default" // Defina o tipo do teclado de forma padrão
            autoCorrect={false} // Desativa a correção automática
          />
          <Image
            source={require("../../assets/search.png")}
            style={{ width: 24, height: 24, marginHorizontal: 8 }}
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setModalVisible(true)}
        >
          <Image
            source={require("../../assets/filter.png")}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CardItem
            card={item}
            isFavorite={favorites.some((fav) => fav.id === item.id)}
            onToggleFavorite={() => toggleFavorite(item)}
            onPress={() => handleCardPress(item)} // Add the onPress handler here
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal Filtro */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeIconWrapper}
              onPress={() => setModalVisible(false)}
            >
              <Image
                source={require("../../assets/close.png")}
                style={styles.closeIcon}
              />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Filter Cards by Type</Text>

            {["monster", "spell", "trap"].map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.modalButton}
                onPress={() => {
                  setFilter(type);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#ccc" }]}
              onPress={() => {
                setFilter(null);
                setModalVisible(false);
              }}
            >
              <Text style={[styles.modalButtonText, { color: "#333" }]}>
                Clear filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Perfil */}
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingTop: 80,
  },
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
    fontSize: 18,
    fontFamily: "KronaOn-Regular",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#E3E3E3",
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 8,
    height: 40,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    borderWidth: 0,
    outlineStyle: 'none',   // Removendo o contorno ao focar
  },
  filterButton: {
    backgroundColor: "#1F4E79",
    padding: 8,
    borderRadius: 8,
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
    fontFamily: "Poppins-Medium",
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
    fontFamily: "Roboto-Bold",
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
    fontFamily: "KronaOn-Regular",
    color: "#333",
  },
});

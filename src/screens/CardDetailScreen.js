import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
} from "react-native";
import { getData, storeData } from "../utils/storage";

// Cores representativas
const attributeColors = {
  DARK: "#2F2E41", DIVINE: "#FFD700", EARTH: "#795548",
  FIRE: "#FF5722", LIGHT: "#FFEB3B", WATER: "#2196F3", WIND: "#4CAF50",
};

const raceColors = {
  Aqua: "#26C6DA", Beast: "#8D6E63", "Beast-Warrior": "#FF7043", Cyberse: "#00BCD4",
  Dinosaur: "#A1887F", DivineBeast: "#FBC02D", Dragon: "#EF5350", Fairy: "#F8BBD0",
  Fiend: "#512DA8", Fish: "#4DD0E1", Insect: "#9CCC65", Machine: "#607D8B",
  Plant: "#66BB6A", Psychic: "#BA68C8", Pyro: "#F44336", Reptile: "#7CB342",
  Rock: "#8D6E63", SeaSerpent: "#00ACC1", Spellcaster: "#7986CB", Thunder: "#FFEB3B",
  Warrior: "#5C6BC0", WingedBeast: "#42A5F5", Wyrm: "#90A4AE", Zombie: "#B0BEC5",
};

const getAttributeColor = (attr) => attributeColors[attr?.toUpperCase()] || "#BDBDBD";
const getRaceColor = (race) => raceColors[race] || "#BDBDBD";

export default function CardDetailScreen({ route, navigation }) {
  const { card } = route.params || {};
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadUser = async () => {
      const user = await getData("logged_user");
      if (user?.username) setUsername(user.username);
    };
    loadUser();
  }, []);

  const logout = async () => {
    await storeData("logged_user", null);
    navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
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

  const handleNavigateBack = () => {
    setLoading(true);
    startLoadingAnimation();

    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 2000);
  };

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

  if (!card) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Carta não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Image source={require("../../assets/back.png")} style={styles.headerIcon} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Millennium Cards</Text>

        <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
          <Image source={require("../../assets/profile.png")} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: card.card_images[0].image_url }} style={styles.cardImage} resizeMode="contain" />
        <Text style={styles.cardTitle}>{card.name}</Text>

        <View style={styles.detailsBox}>
          {card.type && (
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Type:</Text>
              <Text style={styles.detailText}>{card.type}</Text>
            </View>
          )}
          {card.attribute && (
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Attribute:</Text>
              <View style={styles.rowAlignRight}>
                <Text style={styles.detailText}>{card.attribute}</Text>
                <View style={[styles.colorTag, { backgroundColor: getAttributeColor(card.attribute), marginLeft: 8 }]} />
              </View>
            </View>
          )}
          {card.race && (
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Race:</Text>
              <View style={styles.rowAlignRight}>
                <Text style={styles.detailText}>{card.race}</Text>
                <View style={[styles.colorTag, { backgroundColor: getRaceColor(card.race), marginLeft: 8 }]} />
              </View>
            </View>
          )}
          {card.level !== undefined && (
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Level:</Text>
              <Text style={styles.detailText}>{card.level}</Text>
            </View>
          )}
          {(card.atk !== undefined || card.def !== undefined) && (
            <View style={styles.atkDefContainer}>
              <View style={[styles.statBox, { backgroundColor: "#D32F2F" }]} >
                <Text style={styles.statLabel}>ATACK</Text>
                <Text style={styles.statValue}>{card.atk ?? "-"}</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: "#1F4E79" }]}>
                <Text style={styles.statLabel}>DEFENSE</Text>
                <Text style={styles.statValue}>{card.def ?? "-"}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={{ alignSelf: "stretch" }}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.cardDesc}>{card.desc}</Text>
        </View>
      </ScrollView>

      {/* Modal de Perfil */}
      <Modal visible={profileModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeIconWrapper} onPress={() => setProfileModalVisible(false)}>
              <Image source={require("../../assets/close.png")} style={styles.closeIcon} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Hi, {username || "Usuário"}!</Text>

            <TouchableOpacity style={[styles.modalButton, styles.closeButton]} onPress={logout}>
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
  container: {
    paddingTop: 100,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  cardImage: {
    width: 250,
    height: 350,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#000",
  },
  detailsBox: {
    marginBottom: 16,
    backgroundColor: "#FFF8E1",
    padding: 16,
    borderRadius: 12,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#F5C300",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  rowAlignRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  detailText: {
    fontSize: 16,
    color: "#333",
  },
  colorTag: {
    width: 24,
    height: 16,
    borderRadius: 4,
  },
  atkDefContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  statBox: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statLabel: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  statValue: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  cardDesc: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: "justify",
    color: "#444",
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 18,
    color: "red",
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
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});

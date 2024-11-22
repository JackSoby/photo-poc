import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelectPhotos = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissions Required",
          "Media library permissions are required to select photos."
        );
        return;
      }
      console.log("WALKING ON A DREAm")

      // Open the image picker to select multiple photos
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true, // Enable multi-select
        quality: 0, // Adjust image quality (1 = highest)
        selectionLimit: 6,
        base64: false,
        exif: false,
        preferredAssetRepresentationMode: "current"
      });
      console.log("DONE GETTINGZ PHOTOS HELLOOOOOOOOOOOO")

      setLoading(false);

      if (!result.canceled && result.assets) {
        setSelectedPhotos(result.assets); // Store the selected photos
      } else if (result.canceled) {
        Alert.alert("Selection Cancelled", "No photos were selected.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error selecting photos:", error);
      Alert.alert("Error", "An error occurred while selecting photos.");
    }
  };

  const renderPhotoItem = ({ item }) => (
    <Image source={{ uri: item.uri }} style={styles.photo} />
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TouchableOpacity style={styles.button} onPress={handleSelectPhotos}>
        <Text style={styles.buttonText}>Select Photos</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : selectedPhotos.length > 0 ? (
        <FlatList
          data={selectedPhotos}
          keyExtractor={(item) => item.uri} // Use `uri` as the key
          numColumns={3}
          renderItem={renderPhotoItem}
          contentContainerStyle={styles.grid}
        />
      ) : (
        <Text style={styles.placeholderText}>
          No photos selected. Tap the button above to start.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  grid: {
    justifyContent: "space-between",
  },
  photo: {
    width: "30%",
    aspectRatio: 1,
    margin: 5,
    borderRadius: 8,
  },
  placeholderText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 16,
  },
});

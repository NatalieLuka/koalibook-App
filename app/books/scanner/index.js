import { Pressable, StyleSheet, Text, View, Alert, Modal } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { globalStyles } from "../../../styles/globalStyles";
import { COLORS } from "../../../styles/constants";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const BooksAPI = "https://www.googleapis.com/books/v1/volumes?q=isbn:";

export default function CameraPage() {
  const [cameraFacing, setCameraFacing] = useState("back");
  const [activeScanner, setActiveScanner] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const [isbn, setIsbn] = useState("N/A");
  const { user } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [bookInfo, setBookInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBookInfo = async (isbn) => {
    setLoading(true);
    try {
      const response = await fetch(`${BooksAPI}${isbn}`);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setBookInfo(data.items[0].volumeInfo);

        setModalVisible(true);

        const addBookResponse = await fetch(
          "https://koalibook-api.onrender.com/books",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ book: data.items[0].volumeInfo }),
          }
        );

        if (addBookResponse.ok) {
          Alert.alert("Success", "Book added to your list successfully.");
        } else {
          // Alert.alert("Error", "Failed to add book to your list.");
          Alert.alert(addBookResponse);
        }
      } else {
        Alert.alert("Book not found", "No book found with the provided ISBN.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch book information.");
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>We need your permission to show the camera</Text>
        <Pressable onPress={requestPermission}>
          <Text>grant permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <CameraView
          onBarcodeScanned={(scanningResult) => {
            if (activeScanner) {
              setIsbn(scanningResult.data);
              setActiveScanner(false);
              fetchBookInfo(scanningResult.data);
            }
          }}
          style={styles.camera}
          facing={cameraFacing}
        />
        <Text>ISBN: {isbn}</Text>
        <Pressable
          style={({ pressed }) => [
            globalStyles.button,
            {
              backgroundColor: pressed ? COLORS.primary : COLORS.secondary,
            },
          ]}
          onPress={() => {
            setCameraFacing((prev) => (prev === "front" ? "back" : "front"));
          }}
        >
          <Text style={globalStyles.buttonText}>Flip Camera</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            globalStyles.button,
            {
              backgroundColor: pressed ? COLORS.primary : COLORS.secondary,
            },
          ]}
          onPress={() => setActiveScanner(true)}
        >
          <Text style={globalStyles.buttonText}>Scan again</Text>
        </Pressable>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            {bookInfo && (
              <>
                <Text style={styles.modalText}>Title: {bookInfo.title}</Text>
                <Text style={styles.modalText}>
                  Author: {bookInfo.authors?.join(", ")}
                </Text>
                <Text style={styles.modalText}>
                  Published: {bookInfo.publishedDate}
                </Text>
                <Pressable
                  style={[globalStyles.button, styles.buttonClose]}
                  onPress={() => {
                    Alert.alert(
                      "Book Added",
                      "This book has been added to your list!"
                    );
                    setModalVisible(false);
                  }}
                >
                  <Text style={globalStyles.buttonText}>Add to List</Text>
                </Pressable>
              </>
            )}
            <Pressable
              style={[globalStyles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={globalStyles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </Modal>

        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  camera: {
    width: "80%",
    height: "50%",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  buttonClose: {
    backgroundColor: COLORS.secondary,
  },
});

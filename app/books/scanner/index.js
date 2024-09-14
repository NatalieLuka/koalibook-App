import { Pressable, StyleSheet, Text, View, Alert, Modal } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { globalStyles } from "../../../styles/globalStyles";
import { COLORS } from "../../../styles/constants";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import koalaPlaceholder from "../../../assets/noBookImage.png";

const BooksAPI = "https://www.googleapis.com/books/v1/volumes?q=isbn:";
const API = process.env.EXPO_PUBLIC_API_URL;

export default function CameraPage() {
  const [cameraFacing, setCameraFacing] = useState("back");
  const [activeScanner, setActiveScanner] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const [isbn, setIsbn] = useState("N/A");
  const { getToken } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [bookInfo, setBookInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBookInfo = async (isbn) => {
    setLoading(true);
    try {
      const url = `${BooksAPI}${isbn}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const selfLink = data.items[0].selfLink;
        if (selfLink) {
          const selfLinkResponse = await fetch(selfLink);
          const selfLinkData = await selfLinkResponse.json();
          const bookData = {
            title: data.items[0].volumeInfo.title,
            author: data.items[0].volumeInfo.authors.join(", "),
            description: "No description found.",
            isbn: isbn,
            image: koalaPlaceholder,
            pageCount: data.items[0].volumeInfo.pageCount,
          };
          if (selfLinkData.volumeInfo.description) {
            bookData.description = selfLinkData.volumeInfo.description;
          }
          if (selfLinkData.volumeInfo.imageLinks?.thumbnail) {
            bookData.image = selfLinkData.volumeInfo.imageLinks.thumbnail;
          }
          setBookInfo(bookData);
          setModalVisible(true);
        }
      } else {
        Alert.alert("Book not found", "No book found with the provided ISBN.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addBookToList = async (bookData) => {
    const token = await getToken();

    const addBookResponse = await fetch(`${API}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    });

    const addBookJson = await addBookResponse.json();
    if (addBookResponse.ok) {
      Alert.alert("Book added to your list successfully.");
    } else {
      Alert.alert("Error", "Failed to add book to your list.");
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
        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? COLORS.primary : COLORS.secondary,
            },
          ]}
          onPress={() => {
            setCameraFacing((prev) => (prev === "front" ? "back" : "front"));
          }}
        >
          <Text style={styles.buttonText}>Flip Camera</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? COLORS.primary : COLORS.secondary,
            },
          ]}
          onPress={() => setActiveScanner(true)}
        >
          <Text style={styles.buttonText}>Scan again</Text>
        </Pressable>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={globalStyles.modalContainer}>
            <View style={globalStyles.modalContent}>
              {bookInfo && (
                <>
                  <Text style={globalStyles.modalTitle}>{bookInfo.title}</Text>
                  <Text style={globalStyles.modalSubtitle}>
                    by {bookInfo.author}
                  </Text>
                  <View style={globalStyles.modalButtons}>
                    <Pressable
                      style={globalStyles.modalButton}
                      onPress={() => {
                        addBookToList(bookInfo);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={globalStyles.modalButtonText}>
                        Add to List
                      </Text>
                    </Pressable>

                    <Pressable
                      style={globalStyles.modalButtonCancel}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={globalStyles.modalButtonText}>Close</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
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

  button: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

import { Pressable, StyleSheet, Text, View, Alert, Modal } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { globalStyles } from "../../../styles/globalStyles";
import { COLORS } from "../../../styles/constants";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";

const BooksAPI = "https://www.googleapis.com/books/v1/volumes?q=isbn:";
const API = process.env.EXPO_PUBLIC_API_URL;

export default function CameraPage() {
  const [cameraFacing, setCameraFacing] = useState("back");
  const [activeScanner, setActiveScanner] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const [isbn, setIsbn] = useState("N/A");
  const { user } = useUser();
  const { getToken } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [bookInfo, setBookInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBookInfo = async (isbn) => {
    setLoading(true);
    try {
      const url = `${BooksAPI}${isbn}`;
      const response = await fetch(url);
      console.log(
        "static url:",
        "https://www.googleapis.com/books/v1/volumes?q=isbn:9783551585394"
      );
      console.log("url:", url);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const selfLink = data.items[0].selfLink;
        console.log(
          "static selflink:",
          "https://www.googleapis.com/books/v1/volumes/bgjtEAAAQBAJ"
        );
        console.log("selfLink:", selfLink);
        if (selfLink) {
          const selfLinkResponse = await fetch(selfLink);
          const selfLinkData = await selfLinkResponse.json();
          console.log("------------------");
          console.log("selfLinkData: ", JSON.stringify(selfLinkData, null, 2));
          const bookData = {
            title: data.items[0].volumeInfo.title,
            author: data.items[0].volumeInfo.authors.join(", "),
            description: "No description found.",
            isbn: isbn,
            image: "",
            pageCount: data.items[0].volumeInfo.pageCount,
          };
          if (selfLinkData.volumeInfo.description) {
            bookData.description = selfLinkData.volumeInfo.description;
            bookData.image = selfLinkData.volumeInfo.imageLinks?.thumbnail;
          }
          console.log("data: ", JSON.stringify(data, null, 2));
          console.log("bookData: ", JSON.stringify(bookData, null, 2));
          setBookInfo(bookData);
          setModalVisible(true);
        }
      } else {
        Alert.alert("Book not found", "No book found with the provided ISBN.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch book information.");
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

    const addBookJson = await addBookResponse.json(); // parsed aus dem body das JSON
    console.log(addBookJson);
    if (addBookResponse.ok) {
      Alert.alert("Success", "Book added to your list successfully.");
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
                <Text style={styles.modalText}>Author: {bookInfo.author}</Text>
                {/* <Text style={styles.modalText}>
                  Textsnippet: {bookInfo.textSnippet}
                </Text> */}
                <Pressable
                  style={[globalStyles.button, styles.buttonClose]}
                  onPress={() => {
                    addBookToList(bookInfo);
                    setModalVisible(false);
                    Alert.alert(
                      "Book Added",
                      "This book has been added to your list!"
                    );
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

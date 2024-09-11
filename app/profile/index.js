import {
  Text,
  View,
  Image,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { useUser, useAuth } from "@clerk/clerk-expo";
import ProgressChart from "../../components/ProgressChart";
import { useActiveBook } from "../../context/ActiveBookContext";
import { COLORS } from "../../styles/constants";
import { useState } from "react";

const API = `${process.env.EXPO_PUBLIC_API_URL}/books`;

export default function ProfilePage() {
  const { user } = useUser();
  const { activeBook, setActiveBook } = useActiveBook();
  const { getToken } = useAuth();

  const [isModalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const [selectedDay, setSelectedDay] = useState([]);
  const currentDisplayedPage = activeBook?.currentPage || 0;
  const pageCount = activeBook?.pageCount || 0;

  const progressPercentage = activeBook
    ? (currentDisplayedPage / activeBook.pageCount) * 100
    : 0;

  const updatePages = async () => {
    try {
      const token = await getToken();
      const isbn = activeBook?.isbn;

      const response = await fetch(`${API}/${isbn}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newPage: parseInt(currentPage, 10),
        }),
      });
      if (response.ok) {
        setActiveBook({
          ...activeBook,
          currentPage: parseInt(currentPage, 10),
        });
        setCurrentPage();
        setModalVisible(false);
      } else {
        Alert.alert("Fehler: Die Daten konnten nicht aktualisiert werden.");
      }
    } catch (error) {
      console.error("Fehler beim Senden der Daten:", error);
    }
  };

  return (
    <>
      <Text>Hello {user?.primaryEmailAddress?.emailAddress}</Text>
      <Text style={globalStyles.heading}>My Reading Progress</Text>
      {activeBook ? (
        <View style={styles.activeBookContainer}>
          <Image source={{ uri: activeBook.image }} style={styles.bookImage} />
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{activeBook.title}</Text>
            <Text style={styles.bookPages}>
              Page: {currentDisplayedPage} /{activeBook.pageCount}
            </Text>

            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${progressPercentage}%` },
                ]}
              ></View>
            </View>
            <Pressable
              style={styles.updateButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.updateButtonText}>Update</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text style={styles.noBook}>Kein aktives Buch ausgewählt.</Text>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Current Page</Text>

            <TextInput
              style={styles.input}
              placeholder="Current Page"
              keyboardType="numeric"
              value={currentPage}
              onChangeText={(text) => setCurrentPage(text)}
            />

            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={updatePages}>
                <Text style={styles.modalButtonText}>Update</Text>
              </Pressable>

              <Pressable
                style={styles.modalButtonCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <ProgressChart isbn={activeBook?.isbn} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logout: {
    color: COLORS.error,
    fontWeight: "bold",
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.secondary,
    marginBottom: 20,
  },
  activeBookContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  bookImage: {
    width: 90,
    height: 150,
    borderRadius: 8,
    marginRight: 15,
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.secondary,
    marginBottom: 5,
  },
  bookPages: {
    fontSize: 14,
    color: COLORS.paragraphDark,
    marginBottom: 15,
  },
  progressContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: COLORS.background,
    fontWeight: "bold",
  },
  noBook: {
    color: COLORS.error,
    textAlign: "center",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#FFF9E8", // light ivory
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
    color: "#683508", // paragraphDark
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#364D38", // secondary
    borderRadius: 5,
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#364D38", // secondary color
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  modalButtonCancel: {
    backgroundColor: "#ad0009", // error color
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFF9E8", // light ivory
    fontWeight: "bold",
  },
});

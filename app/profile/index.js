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
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import koalaPlaceholder from "../../assets/noBookImage.png";

const API = `${process.env.EXPO_PUBLIC_API_URL}/books`;

export default function ProfilePage() {
  const { user } = useUser();
  const { activeBook, setActiveBook } = useActiveBook();
  const { getToken } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [enteredPage, setEnteredPage] = useState("");
  const [data, setData] = useState([]);

  const pageCount = activeBook?.pageCount || 0;
  const progressPercentage = (currentPage / pageCount) * 100;
  const isbn = activeBook?.isbn;

  const fetchProgressData = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${API}/${isbn}/progress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error retrieving data:", errorText);
        return;
      }

      const result = await response.json();
      // console.log(result);
      setCurrentPage(result.currentPage);
      const weekProgress = result.currentWeekProgress.map((entry) => ({
        day: entry.weekday,
        pages: entry.pagesRead,
      }));
      setData(weekProgress);
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (isbn) {
        fetchProgressData();
      }
    }, [isbn, currentPage, pageCount])
  );

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
          newPage: parseInt(enteredPage, 10),
        }),
      });
      if (response.ok) {
        setActiveBook({
          ...activeBook,
          currentPage: parseInt(currentPage, 10),
        });
        setCurrentPage("");
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
          <Image
            style={
              activeBook.image !== "22" && activeBook.image
                ? styles.bookImage
                : styles.koalaPlaceholder
            }
            source={
              activeBook.image !== "22" && activeBook.image
                ? { uri: activeBook.image }
                : koalaPlaceholder
            }
          />
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{activeBook.title}</Text>
            <Text style={styles.bookPages}>
              Page: {currentPage} /{activeBook.pageCount}
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
              value={enteredPage}
              onChangeText={(text) => setEnteredPage(text)}
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

      <ProgressChart
        isbn={activeBook?.isbn || "no-isbn"}
        currentPage={activeBook?.currentPage || 0}
        pageCount={activeBook?.pageCount || 1}
        data={data}
      />
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
  koalaPlaceholder: {
    width: 100,
    height: 120,
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
    margin: 75,
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

// const fetchProgressData = async () => {
//   try {
//     const token = await getToken();

//     const response = await fetch(`${API}/${isbn}/progress`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Error retrieving data:", errorText);
//       return;
//     }

//     const result = await response.json();
//     const weekProgress = result.currentWeekProgress.map((entry) => ({
//       day: entry.weekday,
//       pages: entry.pagesRead,
//     }));
//     setData(weekProgress);
//   } catch (error) {
//     console.error("Fehler beim Abrufen der Daten:", error);
//   }
// };

// const progressPercentage = (currentPage / pageCount) * 100;

// useEffect(() => {
//   if (isbn) {
//     fetchProgressData();
//   }
// }, [isbn]);

// useEffect(() => {
//   fetchProgressData();
// }, [currentPage, pageCount]);

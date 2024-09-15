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
  const [totals, setTotals] = useState([]);

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
      setCurrentPage(result.currentPage);
      const weekProgress = result.currentWeekProgress.map((entry) => ({
        day: entry.weekday,
        pages: entry.pagesRead,
      }));
      setData(weekProgress);
      const totalProgress = result.totals.map((entry) => ({
        day: entry.weekday,
        pages: entry.pagesRead,
      }));
      setTotals(totalProgress);
    } catch (error) {
      console.error("Error retrieving data:", error);
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
        Alert.alert("Error: data could not be updated");
      }
    } catch (error) {
      console.error("Error sending data:", error);
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
        <Text style={styles.noBook}>No active book selected.</Text>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={globalStyles.modalContainer}>
          <View style={globalStyles.modalContent}>
            <Text style={globalStyles.modalTitle}>Current Page</Text>

            <TextInput
              style={globalStyles.input}
              placeholder="Current Page"
              keyboardType="numeric"
              value={enteredPage}
              onChangeText={(text) => setEnteredPage(text)}
            />

            <View style={globalStyles.modalButtons}>
              <Pressable style={globalStyles.modalButton} onPress={updatePages}>
                <Text style={globalStyles.modalButtonText}>Update</Text>
              </Pressable>

              <Pressable
                style={globalStyles.modalButtonCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={globalStyles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <ProgressChart data={totals} />
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
});

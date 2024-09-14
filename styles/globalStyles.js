import { StyleSheet } from "react-native";
import { COLORS } from "./constants";

export const globalStyles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.paragraphDark,
    marginBottom: 12,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.paragraphDark,
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.paragraphDark,
    marginBottom: 10,
  },

  listContainer: {
    padding: 16,
    backgroundColor: COLORS.background,
  },
  cardButtonContainer: { gap: 5 },

  image: {
    height: 170,
    width: 100,
    marginBottom: 16,
  },
  koalaPlaceholder: {
    height: 130,
    width: 125,
    marginBottom: 16,
  },

  card: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row", // Flexbox-Reihenanordnung, um Bild und Inhalt nebeneinander zu platzieren
    alignItems: "center",
  },
  // cardTitle: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   color: COLORS.paragraphDark,
  //   marginBottom: 4,
  // },
  // cardAuthor: {
  //   marginBottom: 6,
  //   color: COLORS.paragraphDark,
  //   fontWeight: "bold",
  // },
  // cardSubtitle: {
  //   fontSize: 14,
  //   color: COLORS.paragraphLight,
  //   marginBottom: 12,
  // },
  // button: {
  //   backgroundColor: COLORS.secondary,
  //   padding: 10,
  //   borderRadius: 8,
  //   alignItems: "center",
  // },
  // buttonText: {
  //   color: "#fff",
  //   fontSize: 14,
  //   fontWeight: "bold",
  // },
  // listItem: {
  //   fontSize: 16,
  //   color: COLORS.paragraphDark,
  //   paddingVertical: 8,
  // },
  cardImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginRight: 25,
  },

  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },

  cardButtonContainer: {
    flexDirection: "column",
    gap: 5, // Abstand zwischen den Buttons
  },

  button: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8, // Abstand zwischen den Buttons
  },

  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: COLORS.background,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
    color: COLORS.paragraphDark,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 15,
    fontWeight: "bold",
    color: COLORS.paragraphDark,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.secondary,
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
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  modalButtonCancel: {
    backgroundColor: COLORS.error,
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: COLORS.background,
    fontWeight: "bold",
  },
});

import { StyleSheet } from "react-native";
import { COLORS } from "./constants";
// import { FONTS } from "./constants";

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
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.paragraphDark,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.paragraphLight,
    marginBottom: 12,
  },
  button: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  listItem: {
    fontSize: 16,
    color: COLORS.paragraphDark,
    paddingVertical: 8,
  },
});

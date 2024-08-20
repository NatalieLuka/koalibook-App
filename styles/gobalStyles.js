import { StyleSheet } from "react-native";
import { COLORS } from "./constants";
import { FONTS } from "./constants";

export const globalStyles = StyleSheet.create({
  pageContainer: {
    padding: 20,
    flex: 1,
    backgroundColor: COLORS.background,
  },

  heading: {
    fontSize: 32,
    color: COLORS.secondary,
  },

  button: {
    paddingHorizontal: 20,
    backgroundColor: COLORS.accent,
    borderColor: COLORS.secondary,
    borderWidth: 1,
    borderRadius: 6,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
  },
  paragraph: {
    fontFamily: FONTS.default.regular,
    fontSize: 18,
    marginTop: 25,
    marginHorizontal: 20,
  },
});

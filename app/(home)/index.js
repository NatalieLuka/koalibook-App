import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { globalStyles } from "../../styles/gobalStyles";
import { COLORS } from "../../styles/constants";
import { FONTS } from "../../styles/constants";

export default function HomePage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();

  return (
    <>
      <View>
        <Text style={globalStyles.heading}>Welcome to Koalibook</Text>
      </View>
      <View style={styles.loginContainer}>
        <TextInput
          placeholder="Name"
          autoCapitalize="none"
          value={name}
          onChangeText={(text) => {
            setName(text);
          }}
          style={styles.textInput}
        />
        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
          secureTextEntry={true}
          style={styles.textInput}
        />

        <Pressable
          title="Login"
          style={({ pressed }) => [
            globalStyles.button,
            {
              backgroundColor: pressed ? COLORS.primary : COLORS.secondary,
            },
          ]}
          onPress={() => {
            login(name);
          }}
        >
          <Text style={globalStyles.buttonText}>Login</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 10,
  },

  textInput: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    height: 40,
    borderRadius: 6,
    padding: 8,
    fontFamily: FONTS.default.regular,
    fontSize: 18,
    backgroundColor: "white",
  },
});

import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { globalStyles } from "../../styles/globalStyles";
import { COLORS } from "../../styles/constants";
import { FONTS } from "../../styles/constants";
import { useSignIn, useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";

export default function HomePage() {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        setEmail("");
        setPassword("");
        router.push("/profile");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }

  return (
    <>
      <View>
        <Text style={globalStyles.heading}>Welcome to Koalibook</Text>
      </View>
      <View style={styles.loginContainer}>
        <TextInput
          placeholder="E-mail"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
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
          style={({ pressed }) => [
            globalStyles.button,
            {
              backgroundColor: pressed ? COLORS.primary : COLORS.secondary,
            },
          ]}
          onPress={handleSubmit}
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

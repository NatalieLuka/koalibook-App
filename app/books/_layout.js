import { Stack } from "expo-router";
import { COLORS } from "../../styles/constants";
import { useAuth } from "@clerk/clerk-expo";
import { View, Text, Pressable } from "react-native";
import { globalStyles } from "../../styles/globalStyles";

export default function BooksStack() {
  const { signOut } = useAuth();
  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          <Pressable
            style={({ pressed }) => [
              globalStyles.button,
              {
                backgroundColor: pressed ? COLORS.primary : COLORS.secondary,
              },
            ]}
            onPress={signOut}
          >
            <Text style={globalStyles.buttonText}>Logout</Text>
          </Pressable>
        ),
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTitleStyle: {
          color: COLORS.text,
          fontSize: 20,
        },
        contentStyle: {
          backgroundColor: COLORS.background,
          paddingHorizontal: 20,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Books",
        }}
      />
    </Stack>
  );
}

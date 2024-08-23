import { COLORS } from "../../styles/constants";
import { useAuth } from "@clerk/clerk-expo";
import { Text, Pressable } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { Stack, router } from "expo-router";

export default function ProfileStack() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("SignOut Error:", error);
    }
  };

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
            onPress={handleSignOut}
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
          title: "Profile",
        }}
      />
    </Stack>
  );
}

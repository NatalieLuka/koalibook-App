import { StyleSheet, Pressable, View, Text } from "react-native";
import { globalStyles } from "../styles/gobalStyles";
import { Link, router, Slot, Tabs } from "expo-router";
import { COLORS } from "../styles/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, FontAwesome5, Fontisto } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => {
            return <FontAwesome name="home" size={24} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="animals"
        options={{
          title: "All Animals",
          tabBarIcon: ({ color }) => {
            return <FontAwesome5 name="paw" size={24} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="(contact)"
        options={{
          title: "Contact Us",
          tabBarIcon: ({ color }) => {
            return <Fontisto name="email" size={24} color={color} />;
          },
        }}
      />
    </Tabs>
  );
}

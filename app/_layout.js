import { Tabs } from "expo-router";
import { COLORS } from "../styles/constants";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { UserProvider } from "../context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.background,
          tabBarStyle: {
            backgroundColor: COLORS.secondary,
          },
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => {
              return <FontAwesome5 name="home" size={24} color={color} />;
            },
          }}
        />
        <Tabs.Screen
          name="(books)"
          options={{
            title: "My Books",
            tabBarIcon: ({ color }) => {
              return <FontAwesome5 name="book-open" size={24} color={color} />;
            },
          }}
        />
        <Tabs.Screen
          name="(search)"
          options={{
            title: "Search",
            tabBarIcon: ({ color }) => {
              return <FontAwesome name="search" size={24} color={color} />;
            },
          }}
        />

        <Tabs.Screen
          name="(profile)"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => {
              return <FontAwesome5 name="user-alt" size={24} color={color} />;
            },
          }}
        />
      </Tabs>
    </UserProvider>
  );
}

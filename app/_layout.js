import { Tabs } from "expo-router";
import { COLORS } from "../styles/constants";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { UserProvider } from "../context/UserContext";
import { usePathname } from "expo-router";

export default function RootLayout() {
  const pathname = usePathname();
  console.log("pathname", pathname);
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
          tabBarIcon: () => {
            // console.log("route", route);
            const iconColor =
              pathname === "/" ? COLORS.primary : COLORS.background;

            return <FontAwesome5 name="home" size={24} color={iconColor} />;
          },
        }}
      >
        <Tabs.Screen name="(home)" options={{ href: null }} />
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="books"
          options={{
            title: "My Books",
            tabBarIcon: ({ color }) => {
              return <FontAwesome5 name="book-open" size={24} color={color} />;
            },
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color }) => {
              return <FontAwesome name="search" size={24} color={color} />;
            },
          }}
        />

        <Tabs.Screen
          name="profile"
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

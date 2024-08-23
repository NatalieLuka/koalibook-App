import { Pressable, StyleSheet, Text, View, Alert, Modal } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { globalStyles } from "../../../styles/globalStyles";
import { COLORS } from "../../../styles/constants";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function CameraPage() {
  const [cameraFacing, setCameraFacing] = useState("back");
  const [activeScanner, setActiveScanner] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const [isbn, setIsbn] = useState("N/A");
  const { user } = useUser();

  if (!permission) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>We need your permission to show the camera</Text>
        <Pressable onPress={requestPermission}>
          <Text>grant permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <CameraView
          onBarcodeScanned={(scanningResult) => {
            if (activeScanner) {
              setIsbn(scanningResult.data);
              setActiveScanner(false);
            }
          }}
          style={styles.camera}
          facing={cameraFacing}
        />
        <Text>ISBN: {isbn}</Text>
        <Pressable
          style={({ pressed }) => [
            globalStyles.button,
            {
              backgroundColor: pressed ? COLORS.primary : COLORS.secondary,
            },
          ]}
          onPress={() => {
            setCameraFacing((prev) => (prev === "front" ? "back" : "front"));
          }}
        >
          <Text style={globalStyles.buttonText}>Flip Camera</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            globalStyles.button,
            {
              backgroundColor: pressed ? COLORS.primary : COLORS.secondary,
            },
          ]}
          onPress={() => setActiveScanner(true)}
        >
          <Text style={globalStyles.buttonText}>Scan again</Text>
        </Pressable>

        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  camera: {
    width: "80%",
    height: "50%",
  },
});

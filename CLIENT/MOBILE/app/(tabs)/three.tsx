import { Alert, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";

import { Text, View } from "@/components/Themed";
import AudioRecorder from "@/components/AudioPlay";
import socket from "@/utils/socket";

export default function TabTwoScreen() {
  const showAlert = () => {
    Alert.alert(
      "Alert Title",
      "This is the alert message.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: false } // Prevents dismissing the alert by tapping outside
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <Text
        style={styles.button}
        onPress={() => {
          showAlert();
          console.log("hiihihi");
        }}
      >
        {" "}
        Record Audio
      </Text>
      <AudioRecorder />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  button: {
    backgroundColor: "blue",
    borderCurve: "circular",
    padding: 10,
    color: "white",
    borderRadius: 5,
  },
});

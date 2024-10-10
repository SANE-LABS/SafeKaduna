import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import io from "socket.io-client";

// Replace with your backend URL
const socket = io("http://localhost:3001");

const AudioRecorder: React.FC = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        console.error("Audio recording permission not granted");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      // Prepare to record with default options
      await newRecording.prepareToRecordAsync();
      await newRecording.startAsync();

      setRecording(newRecording);
      setIsRecording(true);

      // Start sending audio data to the server
      sendAudioData(newRecording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording stopped and stored at", uri);
      setIsRecording(false);
      setRecording(null);

      if (!uri) return;
      // Optional: Send the recorded audio file to the server
      const response = await fetch(uri);

      const audioBlob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64data = reader.result as string;
        socket.emit("audioData", { audioData: base64data });
      };

      reader.readAsDataURL(audioBlob); // Convert blob to base64
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const sendAudioData = (newRecording: Audio.Recording) => {
    // Send audio data every second (you can adjust the interval)
    const intervalId = setInterval(async () => {
      try {
        const uri = newRecording.getURI();
        if (!uri) return;

        const response = await fetch(uri);
        const audioBlob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64data = reader.result as string;
          socket.emit("audioData", { audioData: base64data });
        };

        reader.readAsDataURL(audioBlob); // Convert blob to base64
      } catch (err) {
        console.error("Failed to send audio data", err);
        clearInterval(intervalId); // Stop sending on error
      }
    }, 1000); // Adjust timing as needed

    // Stop the interval when recording ends
    socket.on("stop_recording", () => clearInterval(intervalId));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isRecording ? "gray" : "blue" },
        ]}
        onPress={startRecording}
        disabled={isRecording}
      >
        <Text style={styles.buttonText}>Start Recording</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: !isRecording ? "gray" : "red" },
        ]}
        onPress={stopRecording}
        disabled={!isRecording}
      >
        <Text style={styles.buttonText}>Stop Recording</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 15,
    borderRadius: 5,
    margin: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default AudioRecorder;

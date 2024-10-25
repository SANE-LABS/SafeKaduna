import { useState, useEffect } from "react";
import { View, StyleSheet, Button } from "react-native";
import { Audio } from "expo-av";
import socket from "../utils/socket";

export default function App() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isChunkRecording, setIsChunkRecording] = useState(false);  // Manage chunk state
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [isStopping, setIsStopping] = useState(false);  // Prevent multiple stop events

  useEffect(() => {
    if (isRecording && !isChunkRecording) {
      startChunkRecording();
    } else {
      stopChunkRecording();
    }

    return () => {
      stopChunkRecording();
    };
  }, [isRecording]);

  async function startRecording() {
    if (permissionResponse?.status !== "granted") {
      console.log("Requesting permission...");
      await requestPermission();
    }

    if (permissionResponse?.status === "granted") {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      setIsRecording(true);
      console.log("Recording started");
    } else {
      console.log("Permission to access microphone not granted");
    }
  }

  async function stopRecording() {
    if (!isStopping) {
      setIsStopping(true);
      setIsRecording(false);
      await stopChunkRecording();
      setIsStopping(false);
    }
  }

  async function startChunkRecording() {
    if (isChunkRecording || isStopping) return;  // Prevent multiple starts or stopping issues
    setIsChunkRecording(true);

    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Chunk recording started");

      setTimeout(async () => {
        await stopAndSendChunk(recording);
        if (isRecording) {
          startChunkRecording();  // Start next chunk if still recording
        }
      }, 10000);  // 10 seconds chunk duration
    } catch (error) {
      console.error("Failed to start chunk recording", error);
      setIsChunkRecording(false);
    }
  }

  async function stopAndSendChunk(currentRecording: Audio.Recording) {
    try {
      if (currentRecording) {
        await currentRecording.stopAndUnloadAsync();
        const uri = currentRecording.getURI();
        console.log("Chunk recording stopped:", uri);

        if (uri) {
          const audioData = await fetchAudioData(uri);
          if (audioData) {
            sendAudioChunk(audioData);
          }
        }

        setRecording(null);
      }
    } catch (error) {
      console.error("Error stopping and sending chunk", error);
    } finally {
      setIsChunkRecording(false);  // Ensure chunk recording state is reset
    }
  }

  async function fetchAudioData(uri: string) {
    try {
      const audioData = await fetch(uri);
      const audioBlob = await audioData.blob();
      return audioBlob;
    } catch (error) {
      console.error("Error fetching audio data:", error);
      return null;
    }
  }

  async function sendAudioChunk(audioBlob: Blob | null) {
    if (!audioBlob) return;
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = () => {
      const base64Audio = reader.result;
      socket.emit("audioChunk", base64Audio);
      console.log("Audio chunk sent.");
    };
  }

  async function stopChunkRecording() {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
        setRecording(null);
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    console.log("Recording stopped");
    setIsChunkRecording(false);  // Ensure chunk state is reset
  }
console.log(process.env.EXPO_PUBLIC_ENVIRONMENT);
  return (
    <View style={styles.container}>
      <Button
        title={isRecording ? "Stop Recording" : "Start Recording"}
        onPress={isRecording ? stopRecording : startRecording}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 10,
  },
});

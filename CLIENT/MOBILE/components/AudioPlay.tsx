import React, { useState, useEffect } from "react";
import { View, Button, Text } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import socket from "@/utils/socket";

const RECORDING_INTERVAL_MS = 10000;

export default function AudioStreamRecorder() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const recordingSettings: Audio.RecordingOptions =
    Audio.RecordingOptionsPresets.HIGH_QUALITY;

  const startRecording = async (): Promise<void> => {
    try {
      console.log("Requesting recording permissions...");
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        console.log("Permission to access microphone is required!");
        return;
      }

      console.log("Starting recording...");
      const { recording } = await Audio.Recording.createAsync(
        recordingSettings
      );
      setRecording(recording);
      setIsRecording(true);

      const id = setInterval(
        () => sendAudioChunk(recording),
        RECORDING_INTERVAL_MS
      );
      setIntervalId(id);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const sendAudioChunk = async (recording: Audio.Recording): Promise<void> => {
    try {
      const uri = recording.getURI();
      if (uri) {
        const audioData = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        socket.emit("audioChunk", { chunk: audioData });
        console.log("Audio chunk sent to server via socket");
        await FileSystem.deleteAsync(uri);
      }
    } catch (error) {
      console.error("Error sending audio chunk:", error);
    }
  };

  const stopRecording = async (): Promise<void> => {
    console.log("Stopping recording...");
    setIsRecording(false);

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording stopped and stored at", uri);
      setRecording(null);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (recording) recording.stopAndUnloadAsync();
    };
  }, [intervalId, recording]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>
        {isRecording ? "Recording..." : "Press Start to begin recording"}
      </Text>
      <Button
        title={isRecording ? "Stop Recording" : "Start Recording"}
        onPress={isRecording ? stopRecording : startRecording}
      />
    </View>
  );
}

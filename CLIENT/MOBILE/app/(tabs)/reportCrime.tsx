import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, useColorScheme } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";

interface LocationType {
  latitude: number | null;
  longitude: number | null;
}

const ReportCrime: React.FC = () => {
  const [attachment, setAttachment] = useState<string | null>(null);
  const [userCategory, setUserCategory] = useState<string>("");
  const [crimeType, setCrimeType] = useState<string>("");
  const [location, setLocation] = useState<LocationType>({
    latitude: null,
    longitude: null,
  });

  // Get the current color scheme (light or dark)
  const colorScheme = useColorScheme();

  useEffect(() => {
    (async () => {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      // Fetch the current location
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  // Handle image attachment
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAttachment(result.assets[0].uri);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    const crimeReport = {
      attachment,
      userCategory,
      crimeType,
      location,
    };
    console.log("Crime Report:", crimeReport);
    // Add logic to submit the crime report to the backend
  };

  // Dynamic styles based on color scheme
  const styles = colorScheme === "dark" ? darkStyles : lightStyles;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report Crime</Text>

      {/* User Category */}
      <Text style={styles.label}>User Category:</Text>
      <Picker
        selectedValue={userCategory}
        onValueChange={(itemValue) => setUserCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="Witness" value="Witness" />
        <Picker.Item label="Victim" value="Victim" />
        <Picker.Item label="Concerned Citizen" value="Concerned Citizen" />
      </Picker>

      {/* Crime Type */}
      <Text style={styles.label}>Crime Type:</Text>
      <Picker
        selectedValue={crimeType}
        onValueChange={(itemValue) => setCrimeType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Crime Type" value="" />
        <Picker.Item label="Theft" value="Theft" />
        <Picker.Item label="Assault" value="Assault" />
        <Picker.Item label="Fraud" value="Fraud" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      {/* Attachment */}
      <Button title="Attach Image" onPress={pickImage} />
      {attachment && (
        <Text style={styles.text}>Image attached successfully</Text>
      )}

      {/* Display current location */}
      <Text style={styles.label}>Location:</Text>
      {location.latitude && location.longitude ? (
        <Text style={styles.text}>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      ) : (
        <Text style={styles.text}>Fetching location...</Text>
      )}


      <Button
        title="Submit Report"
        onPress={handleSubmit}
        color={colorScheme === "dark" ? "#ff6347" : "#1e90ff"}
      />
    </View>
  );
};


const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  label: {
    color: "#333",
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
    backgroundColor: "#f0f0f0",
    marginVertical: 10,
  },
  text: {
    color: "#333",
  },
});


const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  label: {
    color: "#ffffff",
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#ffffff",
    backgroundColor: "#333333",
    marginVertical: 10,
  },
  text: {
    color: "#ffffff",
  },
});

export default ReportCrime;

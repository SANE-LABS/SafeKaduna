import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";

interface LocationData {
  id: number;
  latitude: number;
  longitude: number;
  status: "safe" | "unsafe";
}

const locations: LocationData[] = [
  { id: 1, latitude: 10.5222, longitude: 7.4383, status: "safe" },
  { id: 2, latitude: 10.5135, longitude: 7.4214, status: "unsafe" },
  { id: 3, latitude: 10.5264, longitude: 7.4446, status: "safe" },
  { id: 4, latitude: 10.6093, longitude: 7.3851, status: "unsafe" }, // Zaria Road
  { id: 5, latitude: 10.6027, longitude: 7.4454, status: "safe" }, // Sabon Tasha
  { id: 6, latitude: 10.6769, longitude: 7.3172, status: "unsafe" }, // Rigachikun
  { id: 7, latitude: 10.7276, longitude: 7.4124, status: "safe" }, // Kakuri
  { id: 8, latitude: 10.5416, longitude: 7.4643, status: "unsafe" }, // Narayi
  { id: 9, latitude: 10.4693, longitude: 7.5285, status: "safe" }, // Ungwan Rimi
  { id: 10, latitude: 10.5432, longitude: 7.4389, status: "unsafe" }, // Anguwan Dosa
  { id: 11, latitude: 10.5483, longitude: 7.4221, status: "safe" }, // Malali
  { id: 12, latitude: 10.6039, longitude: 7.4256, status: "unsafe" }, // Tudun Wada
  { id: 13, latitude: 10.4559, longitude: 7.4079, status: "safe" }, // Kudenda
  { id: 14, latitude: 10.6407, longitude: 7.3824, status: "unsafe" }, // Mando
  { id: 15, latitude: 10.6407, longitude: 7.4768, status: "safe" }, // Sabo Gari
  { id: 16, latitude: 10.4693, longitude: 7.5167, status: "unsafe" }, // Kafanchan
  { id: 17, latitude: 10.4836, longitude: 7.4327, status: "safe" }, // Gwagwada
  { id: 18, latitude: 10.5222, longitude: 7.3833, status: "unsafe" }, // Kachia
  { id: 19, latitude: 10.5021, longitude: 7.4802, status: "safe" }, // Zonkwa
  { id: 20, latitude: 10.4432, longitude: 7.5623, status: "unsafe" }, // Kajuru
];

interface UserLocation {
  latitude: number;
  longitude: number;
}

export default function App() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  const initialRegion: Region = {
    latitude: 10.5222,
    longitude: 7.4383,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
            description="This is your current location"
            pinColor="blue"
          />
        )}

        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={
              location.status === "safe" ? "Safe Location" : "Unsafe Location"
            }
            description={`This location is marked as ${location.status}.`}
            pinColor={location.status === "safe" ? "green" : "red"}
          />
        ))}
      </MapView>
    </View>
  );
}

// Define the styles for the map
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "flex-end",
    // alignItems: "center",
  },
  map: {
    // ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
});

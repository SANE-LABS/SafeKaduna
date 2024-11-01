import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";

interface LocationData {
  id: number;
  latitude: number;
  longitude: number;
  status: "safe" | "unsafe" | "slightly safe" | "slightly unsafe";
}

const locations: LocationData[] = [
  { id: 1, latitude: 10.5222, longitude: 7.4383, status: "safe" },
  { id: 2, latitude: 10.5135, longitude: 7.4214, status: "unsafe" },
  { id: 3, latitude: 10.5264, longitude: 7.4446, status: "slightly safe" },
  { id: 4, latitude: 10.6093, longitude: 7.3851, status: "slightly unsafe" },
  { id: 5, latitude: 10.6027, longitude: 7.4454, status: "safe" },
  { id: 6, latitude: 10.6769, longitude: 7.3172, status: "unsafe" },
  { id: 7, latitude: 10.7276, longitude: 7.4124, status: "slightly safe" },
  { id: 8, latitude: 10.5416, longitude: 7.4643, status: "slightly unsafe" },
  { id: 9, latitude: 10.4693, longitude: 7.5285, status: "safe" },
  { id: 10, latitude: 10.5432, longitude: 7.4389, status: "unsafe" },
  { id: 11, latitude: 10.5483, longitude: 7.4221, status: "slightly safe" },
  { id: 12, latitude: 10.6039, longitude: 7.4256, status: "slightly unsafe" },
  { id: 13, latitude: 10.4559, longitude: 7.4079, status: "safe" },
  { id: 14, latitude: 10.6407, longitude: 7.3824, status: "unsafe" },
  { id: 15, latitude: 10.6407, longitude: 7.4768, status: "slightly safe" },
  { id: 16, latitude: 10.4693, longitude: 7.5167, status: "slightly unsafe" },
  { id: 17, latitude: 10.4836, longitude: 7.4327, status: "safe" },
  { id: 18, latitude: 10.5222, longitude: 7.3833, status: "unsafe" },
  { id: 19, latitude: 10.5021, longitude: 7.4802, status: "slightly safe" },
  { id: 20, latitude: 10.4432, longitude: 7.5623, status: "slightly unsafe" },
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


  const getPinColor = (status: string) => {
    switch (status) {
      case "safe":
        return "green";
      case "unsafe":
        return "red";
      case "slightly safe":
        return "yellow";
      case "slightly unsafe":
        return "orange";
      default:
        return "blue";
    }
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
              location.status === "safe"
                ? "Safe Location"
                : location.status === "unsafe"
                ? "Unsafe Location"
                : location.status === "slightly safe"
                ? "Slightly Safe Location"
                : "Slightly Unsafe Location"
            }
            description={`This location is marked as ${location.status}.`}
            pinColor={getPinColor(location.status)}
          />
        ))}
      </MapView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

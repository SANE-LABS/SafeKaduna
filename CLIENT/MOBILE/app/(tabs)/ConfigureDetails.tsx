import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  Alert,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import axios from "axios";
import config from "@/config";

interface EmergencyContact {
  id: string;
  email: string;
  phone: string;
}

const EmergencyContactsScreen = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const apiUrl = config.API_URL;

  const fetchContacts = async () => {
    try {
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        setContacts(response.data);
        console.log(contacts.length, contacts[0]);
      } else {
        throw new Error("Failed to fetch contacts from server.");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      Alert.alert("Error", "Failed to load contacts. Please try again later.");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Add a new contact
  const addContact = async () => {
    if (email && phone) {
      try {
        const newContact = { email, phone };
        const response = await axios.post(apiUrl, newContact);
        if (response.status === 201) {
          await fetchContacts(); // Refresh the contacts list after adding
          setEmail("");
          setPhone("");
        } else {
          throw new Error("Failed to add contact.");
        }
      } catch (error) {
        console.error("Error adding contact:", error);
        Alert.alert("Error", "Failed to add contact.");
      }
    } else {
      Alert.alert("Please fill out both fields");
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const response = await axios.delete(`${apiUrl}/${id}`);
      if (response.status === 200) {
        await fetchContacts(); // Refresh the contacts list after deleting
      } else {
        throw new Error("Failed to delete contact.");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      Alert.alert("Error", "Failed to delete contact.");
    }
  };

  const handleSubmit = async () => {
    if (contacts.length === 0) {
      Alert.alert(
        "No contacts added!",
        "Please add at least one emergency contact."
      );
      return;
    }

    try {
      // Here you would typically send the contacts to a server
      // For now, we'll just display them in an alert
      Alert.alert(
        "Emergency Contacts Submitted",
        JSON.stringify(contacts, null, 2)
      );
    } catch (error) {
      console.error("Error submitting contacts:", error);
      Alert.alert("Error", "Failed to submit contacts.");
    }
  };

  // Dark mode support
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  // Styles based on dark mode
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDarkMode ? "#1c1c1c" : "#f0f0f0",
    },
    input: {
      height: 50,
      borderColor: "gray",
      borderWidth: 1,
      marginBottom: 15,
      paddingHorizontal: 10,
      backgroundColor: isDarkMode ? "#333" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
      borderRadius: 12,
    },
    contactItem: {
      padding: 10,
      borderBottomColor: isDarkMode ? "#555" : "lightgray",
      borderBottomWidth: 1,
      marginBottom: 5,
      backgroundColor: isDarkMode ? "#333" : "#fff",
    },
    contactText: {
      color: isDarkMode ? "#fff" : "#000",
    },
    noContactsText: {
      textAlign: "center",
      marginVertical: 20,
      color: isDarkMode ? "#fff" : "#000",
    },
    deleteButton: {
      color: "red",
      marginTop: 10,
    },
  });

  // Render a single contact item
  const renderContact = ({ item }: { item: EmergencyContact }) => (
    <View style={styles.contactItem}>
      <Text style={styles.contactText}>Email: {item.email}</Text>
      <Text style={styles.contactText}>Phone: {item.phone}</Text>
      <TouchableOpacity onPress={() => deleteContact(item.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Input form for emergency contact */}
      <TextInput
        style={styles.input}
        placeholder="Contact email"
        placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Phone"
        placeholderTextColor={isDarkMode ? "#888" : "#aaa"}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <Button title="Add Contact" onPress={addContact} />

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        ListEmptyComponent={
          <Text style={styles.noContactsText}>No contacts registered yet</Text>
        }
      />

      <Button title="Submit Emergency Contacts" onPress={handleSubmit} />
    </View>
  );
};

export default EmergencyContactsScreen;

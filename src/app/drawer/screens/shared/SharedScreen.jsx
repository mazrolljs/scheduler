import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../../services/firebaseConfig"; // ✅ your firebase connection file
import { Colors } from "../../../../assets/constants/colors";

export default function ShiftSharingScreen() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [endTime, setEndTime] = useState(new Date());
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [location, setLocation] = useState("");

  // Function to save shift data
  const handleSave = async () => {
    if (!location) {
      Alert.alert("Missing Data", "Please enter the location.");
      return;
    }

    try {
      // Combine selected date with start and end times
      const startDateTime = new Date(date);
      startDateTime.setHours(startTime.getHours());
      startDateTime.setMinutes(startTime.getMinutes());

      const endDateTime = new Date(date);
      endDateTime.setHours(endTime.getHours());
      endDateTime.setMinutes(endTime.getMinutes());

      await addDoc(collection(db, "emp_sch_main"), {
        date: date.toISOString().split("T")[0], // selected date
        start_time: formatTime24(startDateTime), // HH:mm
        end_time: formatTime24(endDateTime), // HH:mm
        location_id: location,
        admin_id: "",
        emp_id: "",
        created_at: new Date().toISOString(),
      });

      Alert.alert("✅ Success", "Shift shared successfully!");
      setLocation("");
    } catch (error) {
      console.error("Error adding shift: ", error);
      Alert.alert("❌ Error", "Failed to save shift. Try again.");
    }
  };

  // Helper function to format Date to "HH:mm"
  const formatTime24 = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Share a New Shift</Text>

        {/* Date Picker */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.inputText}>
            {date.toDateString() || "Select Date"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {/* Start Time Picker */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.inputText}>
            Start:{" "}
            {startTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowStartPicker(false);
              if (selectedTime) setStartTime(selectedTime);
            }}
          />
        )}

        {/* End Time Picker */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.inputText}>
            End:{" "}
            {endTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowEndPicker(false);
              if (selectedTime) setEndTime(selectedTime);
            }}
          />
        )}

        {/* Location Input */}
        <TextInput
          style={styles.textInput}
          placeholder="Enter Location ID"
          value={location}
          onChangeText={setLocation}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Shift</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.Pcalight.background,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.dark.background,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    padding: 14,
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 15,
  },
  inputText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  textInput: {
    padding: 14,
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 25,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: "600",
  },
});

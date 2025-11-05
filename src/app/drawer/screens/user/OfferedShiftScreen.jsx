import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../../../services/firebaseConfig";
import { format } from "date-fns";
import {
  generateTimeOptions,
  handleDateInput,
  handleStartTimeChange,
  handleEndTimeChange,
} from "../../../../utils/utils";

export default function OfferedShiftScreen() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("15:00");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [employees, setEmployees] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showEmployeePicker, setShowEmployeePicker] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      const empSnap = await getDocs(collection(db, "users"));
      setEmployees(empSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchLocations = async () => {
      const locSnap = await getDocs(collection(db, "location"));
      setLocations(locSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchEmployees();
    fetchLocations();
  }, []);

  const timeOptions = generateTimeOptions();

  const handleDateInputWrapper = (text) => handleDateInput(text, setDate);

  const handleStartTimeChangeWrapper = (val) =>
    handleStartTimeChange(val, setStartTime, setEndTime);

  const handleEndTimeChangeWrapper = (val) =>
    handleEndTimeChange(val, setEndTime);

  // ✅ Save to emp_sch_main
  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "emp_sch_main"), {
        date: format(date, "yyyy-MM-dd"),
        start_time: startTime,
        end_time: endTime,
        emp_id: selectedEmpId || "",
        is_shared: selectedEmpId === "",
        location_id: selectedLocation || "",
        notes: notes || "",
        created_at: new Date(),
      });
      Alert.alert("✅ Success", "Shift saved successfully!");
      setNotes("");
      setSelectedEmpId("");
      setSelectedLocation("");
      setStartTime("07:00");
      setEndTime("15:00");
      setDate(new Date());
    } catch (error) {
      Alert.alert("❌ Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}>
        Offer a New Shift
      </Text>

      {/* 📅 Date */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(!showDatePicker)}
      >
        <Text style={styles.inputText}>{format(date, "dd-MM-yyyy")}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Type date (dd-mm-yyyy or dd-mm-yy)"
            onChangeText={handleDateInputWrapper}
          />
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={(e, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        </>
      )}

      {/* 🕘 Start Time */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowStartPicker(!showStartPicker)}
      >
        <Text style={styles.inputText}>Start Time: {startTime}</Text>
      </TouchableOpacity>
      {showStartPicker && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={startTime}
            onValueChange={(val) => {
              handleStartTimeChangeWrapper(val);
              setShowStartPicker(false);
            }}
          >
            {timeOptions.map((t) => (
              <Picker.Item key={t} label={t} value={t} />
            ))}
          </Picker>
        </View>
      )}

      {/* 🕔 End Time */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowEndPicker(!showEndPicker)}
      >
        <Text style={styles.inputText}>End Time: {endTime}</Text>
      </TouchableOpacity>
      {showEndPicker && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={endTime}
            onValueChange={(val) => {
              handleEndTimeChangeWrapper(val);
              setShowEndPicker(false);
            }}
          >
            {timeOptions.map((t) => (
              <Picker.Item key={t} label={t} value={t} />
            ))}
          </Picker>
        </View>
      )}

      {/* 📍 Location */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowLocationPicker(!showLocationPicker)}
      >
        <Text style={styles.inputText}>
          {selectedLocation
            ? `Location: ${
                locations.find((l) => l.location_id === selectedLocation)
                  ?.address || selectedLocation
              }`
            : "Select Location"}
        </Text>
      </TouchableOpacity>
      {showLocationPicker && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedLocation}
            onValueChange={(val) => {
              setSelectedLocation(val);
              setShowLocationPicker(false);
            }}
          >
            <Picker.Item label="Select Location" value="" />
            {locations.map((loc) => (
              <Picker.Item
                key={loc.location_id}
                label={loc.address}
                value={loc.location_id}
              />
            ))}
          </Picker>
        </View>
      )}

      {/* 👤 Employee */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowEmployeePicker(!showEmployeePicker)}
      >
        <Text style={styles.inputText}>
          {selectedEmpId
            ? `Employee: ${
                employees.find((emp) => emp.id === selectedEmpId)?.name ||
                selectedEmpId
              }`
            : "Select Employee or leave blank for shared shift"}
        </Text>
      </TouchableOpacity>

      {showEmployeePicker && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedEmpId}
            onValueChange={(val) => {
              setSelectedEmpId(val);
              setShowEmployeePicker(false);
            }}
          >
            <Picker.Item label="Select Employee (or leave blank)" value="" />
            {employees.map((emp) => (
              <Picker.Item
                key={emp.id}
                label={`${emp.name} (${emp.emp_id})`}
                value={emp.id}
              />
            ))}
          </Picker>
        </View>
      )}

      {/* 📝 Notes */}
      <TextInput
        style={styles.textArea}
        placeholder="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      {/* 💾 Save Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={{ color: "#fff", fontSize: 16 }}>Save Shift</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  inputText: { fontSize: 16 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginVertical: 5,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    height: 80,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#5f1616",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
};

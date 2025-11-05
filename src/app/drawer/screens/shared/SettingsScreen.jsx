import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../../../services/firebaseConfig";
import { generateNextEmpId } from "../../../../utils/utils";
export default function SettingsScreen() {
  // === Collapse States ===
  const [showAddEmployee, setShowAddEmployee] = useState(true);
  const [showAddLocation, setShowAddLocation] = useState(true);
  const [showEmployeeInduction, setShowEmployeeInduction] = useState(true);

  // === Employee Form States ===
  const [empName, setEmpName] = useState("");
  const [empAddress, setEmpAddress] = useState("");
  const [empPassword, setEmpPassword] = useState("");
  const [empLocationId, setEmpLocationId] = useState("");
  const [locations, setLocations] = useState([]);
  const [showAddEmployeeLocationPicker, setShowAddEmployeeLocationPicker] =
    useState(false);

  // === Location Form States ===
  const [locationId, setLocationId] = useState("");
  const [locationAddress, setLocationAddress] = useState("");

  // === Employee Induction States ===
  const [inductionEmpId, setInductionEmpId] = useState("");
  const [inductionLocationId, setInductionLocationId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [showInductionLocationPicker, setShowInductionLocationPicker] =
    useState(false);
  const [showInductionEmployeePicker, setShowInductionEmployeePicker] =
    useState(false);

  // === Load Locations & Employees ===
  useEffect(() => {
    const fetchLocations = async () => {
      const locSnap = await getDocs(collection(db, "location"));
      setLocations(locSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    const fetchEmployees = async () => {
      const empSnap = await getDocs(collection(db, "users"));
      setEmployees(empSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchLocations();
    fetchEmployees();
  }, []);

  const generateNextEmpIdWrapper = async () => generateNextEmpId(db);

  // === Add Employee ===
  const handleAddEmployee = async () => {
    if (!empName || !empAddress || !empPassword || !empLocationId) {
      Alert.alert("❌ Error", "Fill all fields for Employee");
      return;
    }
    try {
      const newEmpId = await generateNextEmpIdWrapper();
      await addDoc(collection(db, "users"), {
        emp_id: newEmpId,
        name: empName,
        address: empAddress,
        password: empPassword,
        location_id: empLocationId,
        created_at: new Date(),
      });
      Alert.alert("✅ Success", `Employee ${empName} added`);
      setEmpName("");
      setEmpAddress("");
      setEmpPassword("");
      setEmpLocationId("");
      setShowAddEmployee(false);
      // Refresh employees list
      const empSnap = await getDocs(collection(db, "users"));
      setEmployees(empSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      Alert.alert("❌ Error", error.message);
    }
  };

  // === Add Location ===
  const handleAddLocation = async () => {
    if (!locationId || !locationAddress) {
      Alert.alert("❌ Error", "Enter both Location ID and Address");
      return;
    }
    try {
      await addDoc(collection(db, "location"), {
        location_id: locationId,
        address: locationAddress,
        created_at: new Date(),
      });
      Alert.alert("✅ Success", "Location added");
      setLocationId("");
      setLocationAddress("");
      setShowAddLocation(false);
      // Refresh locations list
      const locSnap = await getDocs(collection(db, "location"));
      setLocations(locSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      Alert.alert("❌ Error", error.message);
    }
  };

  // === Employee Induction ===
  const handleEmployeeInduction = async () => {
    if (!inductionEmpId || !inductionLocationId) {
      Alert.alert("❌ Error", "Select Employee & Location");
      return;
    }
    try {
      await addDoc(collection(db, "emp_location"), {
        emp_id: inductionEmpId,
        location_id: inductionLocationId,
        created_at: new Date(),
      });
      Alert.alert("✅ Success", "Employee induction saved");
      setInductionEmpId("");
      setInductionLocationId("");
      setShowEmployeeInduction(false);
    } catch (error) {
      Alert.alert("❌ Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 10 }}>
        Settings
      </Text>

      {/* Add Employee */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => {
          setShowAddEmployee(!showAddEmployee);
          setShowAddLocation(false);
          setShowEmployeeInduction(false);
        }}
      >
        <Text style={{ fontSize: 18 }}>Add Employee</Text>
      </TouchableOpacity>
      {showAddEmployee && (
        <View style={styles.sectionBody}>
          <TextInput
            placeholder="Name"
            style={styles.input}
            value={empName}
            onChangeText={setEmpName}
          />
          <TextInput
            placeholder="Address"
            style={styles.input}
            value={empAddress}
            onChangeText={setEmpAddress}
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={empPassword}
            onChangeText={setEmpPassword}
          />
          <TouchableOpacity
            style={styles.input}
            onPress={() =>
              setShowAddEmployeeLocationPicker(!showAddEmployeeLocationPicker)
            }
          >
            <Text style={styles.inputText}>
              {empLocationId
                ? `Location: ${
                    locations.find((l) => l.location_id === empLocationId)
                      ?.address || empLocationId
                  }`
                : "Select Location"}
            </Text>
          </TouchableOpacity>
          {showAddEmployeeLocationPicker && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={empLocationId}
                onValueChange={(val) => {
                  setEmpLocationId(val);
                  setShowAddEmployeeLocationPicker(false);
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
          <TouchableOpacity style={styles.button} onPress={handleAddEmployee}>
            <Text style={{ color: "#fff" }}>Save Employee</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add Location */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => {
          setShowAddLocation(!showAddLocation);
          setShowAddEmployee(false);
          setShowEmployeeInduction(false);
        }}
      >
        <Text style={{ fontSize: 18 }}>Add Location</Text>
      </TouchableOpacity>
      {showAddLocation && (
        <View style={styles.sectionBody}>
          <TextInput
            placeholder="Location ID (e.g., LOC-001)"
            style={styles.input}
            value={locationId}
            onChangeText={setLocationId}
          />
          <TextInput
            placeholder="Address"
            style={styles.input}
            value={locationAddress}
            onChangeText={setLocationAddress}
          />
          <TouchableOpacity style={styles.button} onPress={handleAddLocation}>
            <Text style={{ color: "#fff" }}>Save Location</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Employee Induction */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => {
          setShowEmployeeInduction(!showEmployeeInduction);
          setShowAddEmployee(false);
          setShowAddLocation(false);
        }}
      >
        <Text style={{ fontSize: 18 }}>Employee Induction</Text>
      </TouchableOpacity>
      {showEmployeeInduction && (
        <View style={styles.sectionBody}>
          {/* 👤 Employee */}
          <TouchableOpacity
            style={styles.input}
            onPress={() =>
              setShowInductionEmployeePicker(!showInductionEmployeePicker)
            }
          >
            <Text style={styles.inputText}>
              {inductionEmpId
                ? `Employee: ${
                    employees.find((emp) => emp.id === inductionEmpId)?.name ||
                    inductionEmpId
                  }`
                : "Select Employee"}
            </Text>
          </TouchableOpacity>
          {showInductionEmployeePicker && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={inductionEmpId}
                onValueChange={(val) => {
                  setInductionEmpId(val);
                  setShowInductionEmployeePicker(false);
                }}
              >
                <Picker.Item label="Select Employee" value="" />
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

          {/* 📍 Location */}
          <TouchableOpacity
            style={styles.input}
            onPress={() =>
              setShowInductionLocationPicker(!showInductionLocationPicker)
            }
          >
            <Text style={styles.inputText}>
              {inductionLocationId
                ? `Location: ${
                    locations.find((l) => l.location_id === inductionLocationId)
                      ?.address || inductionLocationId
                  }`
                : "Select Location"}
            </Text>
          </TouchableOpacity>
          {showInductionLocationPicker && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={inductionLocationId}
                onValueChange={(val) => {
                  setInductionLocationId(val);
                  setShowInductionLocationPicker(false);
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

          <TouchableOpacity
            style={styles.button}
            onPress={handleEmployeeInduction}
          >
            <Text style={{ color: "#fff" }}>Save Induction</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = {
  sectionHeader: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  sectionBody: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
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
  button: {
    backgroundColor: "#5f1616",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
};

import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../../services/firebaseConfig";
import { generateNextEmpId } from "../../../../utils/utils";
import { Colors } from "../../../../assets/constants/colors";
import { globalStyles } from "../../../../assets/constants/styles";
import {
  fetchEmployees,
  fetchLocations,
} from "../../../../assets/constants/functions";

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // === Collapse States ===
      showAddEmployee: true,
      showAddLocation: true,
      showEmployeeInduction: true,

      // === Employee Form States ===
      empName: "",
      empAddress: "",
      empPassword: "",
      empLocationId: "",
      locations: [],
      showAddEmployeeLocationPicker: false,

      // === Location Form States ===
      locationId: "",
      locationAddress: "",

      // === Employee Induction States ===
      inductionEmpId: "",
      inductionLocationId: "",
      employees: [],
      showInductionLocationPicker: false,
      showInductionEmployeePicker: false,
    };
  }

  componentDidMount() {
    this.fetchLocations();
    this.fetchEmployees();
  }

  fetchLocations = async () => {
    const locations = await fetchLocations();
    this.setState({ locations });
  };

  fetchEmployees = async () => {
    const employees = await fetchEmployees();
    this.setState({ employees });
  };

  generateNextEmpIdWrapper = async () => generateNextEmpId(db);

  // === Add Employee ===
  handleAddEmployee = async () => {
    const { empName, empAddress, empPassword, empLocationId } = this.state;
    if (!empName || !empAddress || !empPassword || !empLocationId) {
      Alert.alert("❌ Error", "Fill all fields for Employee");
      return;
    }
    try {
      const newEmpId = await this.generateNextEmpIdWrapper();
      await addDoc(collection(db, "users"), {
        emp_id: newEmpId,
        name: empName,
        address: empAddress,
        password: empPassword,
        location_id: empLocationId,
        created_at: new Date(),
      });
      Alert.alert("✅ Success", `Employee ${empName} added`);
      this.setState({
        empName: "",
        empAddress: "",
        empPassword: "",
        empLocationId: "",
        showAddEmployee: false,
      });
      // Refresh employees list
      this.fetchEmployees();
    } catch (error) {
      Alert.alert("❌ Error", error.message);
    }
  };

  // === Add Location ===
  handleAddLocation = async () => {
    const { locationId, locationAddress } = this.state;
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
      this.setState({
        locationId: "",
        locationAddress: "",
        showAddLocation: false,
      });
      // Refresh locations list
      this.fetchLocations();
    } catch (error) {
      Alert.alert("❌ Error", error.message);
    }
  };

  // === Employee Induction ===
  handleEmployeeInduction = async () => {
    const { inductionEmpId, inductionLocationId } = this.state;
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
      this.setState({
        inductionEmpId: "",
        inductionLocationId: "",
        showEmployeeInduction: false,
      });
    } catch (error) {
      Alert.alert("❌ Error", error.message);
    }
  };

  render() {
    const {
      showAddEmployee,
      showAddLocation,
      showEmployeeInduction,
      empName,
      empAddress,
      empPassword,
      empLocationId,
      locations,
      showAddEmployeeLocationPicker,
      locationId,
      locationAddress,
      inductionEmpId,
      inductionLocationId,
      employees,
      showInductionLocationPicker,
      showInductionEmployeePicker,
    } = this.state;

    return (
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        <Text style={globalStyles.title}>Settings</Text>

        {/* Add Employee */}
        <TouchableOpacity
          style={globalStyles.card}
          onPress={() =>
            this.setState({
              showAddEmployee: !showAddEmployee,
              showAddLocation: false,
              showEmployeeInduction: false,
            })
          }
        >
          <Text style={globalStyles.subtitle}>Add Employee</Text>
        </TouchableOpacity>
        {showAddEmployee && (
          <View style={globalStyles.card}>
            <TextInput
              placeholder="Name"
              style={globalStyles.input}
              value={empName}
              onChangeText={(text) => this.setState({ empName: text })}
            />
            <TextInput
              placeholder="Address"
              style={globalStyles.input}
              value={empAddress}
              onChangeText={(text) => this.setState({ empAddress: text })}
            />
            <TextInput
              placeholder="Password"
              style={globalStyles.input}
              secureTextEntry
              value={empPassword}
              onChangeText={(text) => this.setState({ empPassword: text })}
            />
            <TouchableOpacity
              style={globalStyles.input}
              onPress={() =>
                this.setState({
                  showAddEmployeeLocationPicker: !showAddEmployeeLocationPicker,
                })
              }
            >
              <Text style={globalStyles.inputText}>
                {empLocationId
                  ? `Location: ${
                      locations.find((l) => l.location_id === empLocationId)
                        ?.address || empLocationId
                    }`
                  : "Select Location"}
              </Text>
            </TouchableOpacity>
            {showAddEmployeeLocationPicker && (
              <View style={globalStyles.pickerContainer}>
                <Picker
                  selectedValue={empLocationId}
                  onValueChange={(val) =>
                    this.setState({
                      empLocationId: val,
                      showAddEmployeeLocationPicker: false,
                    })
                  }
                  style={{ color: Colors.Pcalight.text }}
                >
                  <Picker.Item
                    label="Select Location"
                    value=""
                    style={globalStyles.pickerItem}
                  />
                  {locations.map((loc) => (
                    <Picker.Item
                      key={loc.location_id}
                      label={loc.address}
                      value={loc.location_id}
                      style={globalStyles.pickerItem}
                    />
                  ))}
                </Picker>
              </View>
            )}
            <TouchableOpacity
              style={globalStyles.button}
              onPress={this.handleAddEmployee}
            >
              <Text style={globalStyles.buttonText}>Save Employee</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Add Location */}
        <TouchableOpacity
          style={globalStyles.card}
          onPress={() =>
            this.setState({
              showAddLocation: !showAddLocation,
              showAddEmployee: false,
              showEmployeeInduction: false,
            })
          }
        >
          <Text style={globalStyles.subtitle}>Add Location</Text>
        </TouchableOpacity>
        {showAddLocation && (
          <View style={globalStyles.card}>
            <TextInput
              placeholder="Location ID (e.g., LOC-001)"
              style={globalStyles.input}
              value={locationId}
              onChangeText={(text) => this.setState({ locationId: text })}
            />
            <TextInput
              placeholder="Address"
              style={globalStyles.input}
              value={locationAddress}
              onChangeText={(text) => this.setState({ locationAddress: text })}
            />
            <TouchableOpacity
              style={globalStyles.button}
              onPress={this.handleAddLocation}
            >
              <Text style={globalStyles.buttonText}>Save Location</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Employee Induction */}
        <TouchableOpacity
          style={globalStyles.card}
          onPress={() =>
            this.setState({
              showEmployeeInduction: !showEmployeeInduction,
              showAddEmployee: false,
              showAddLocation: false,
            })
          }
        >
          <Text style={globalStyles.subtitle}>Employee Induction</Text>
        </TouchableOpacity>
        {showEmployeeInduction && (
          <View style={globalStyles.card}>
            {/* 👤 Employee */}
            <TouchableOpacity
              style={globalStyles.input}
              onPress={() =>
                this.setState({
                  showInductionEmployeePicker: !showInductionEmployeePicker,
                })
              }
            >
              <Text style={globalStyles.inputText}>
                {inductionEmpId
                  ? `Employee: ${
                      employees.find((emp) => emp.id === inductionEmpId)
                        ?.name || inductionEmpId
                    }`
                  : "Select Employee"}
              </Text>
            </TouchableOpacity>
            {showInductionEmployeePicker && (
              <View style={globalStyles.pickerContainer}>
                <Picker
                  selectedValue={inductionEmpId}
                  onValueChange={(val) =>
                    this.setState({
                      inductionEmpId: val,
                      showInductionEmployeePicker: false,
                    })
                  }
                  style={{ color: Colors.Pcalight.text }}
                >
                  <Picker.Item
                    label="Select Employee"
                    value=""
                    style={globalStyles.pickerItem}
                  />
                  {employees.map((emp) => (
                    <Picker.Item
                      key={emp.id}
                      label={`${emp.name} (${emp.emp_id})`}
                      value={emp.id}
                      style={globalStyles.pickerItem}
                    />
                  ))}
                </Picker>
              </View>
            )}

            {/* 📍 Location */}
            <TouchableOpacity
              style={globalStyles.input}
              onPress={() =>
                this.setState({
                  showInductionLocationPicker: !showInductionLocationPicker,
                })
              }
            >
              <Text style={globalStyles.inputText}>
                {inductionLocationId
                  ? `Location: ${
                      locations.find(
                        (l) => l.location_id === inductionLocationId
                      )?.address || inductionLocationId
                    }`
                  : "Select Location"}
              </Text>
            </TouchableOpacity>
            {showInductionLocationPicker && (
              <View style={globalStyles.pickerContainer}>
                <Picker
                  selectedValue={inductionLocationId}
                  onValueChange={(val) =>
                    this.setState({
                      inductionLocationId: val,
                      showInductionLocationPicker: false,
                    })
                  }
                  style={{ color: Colors.Pcalight.text }}
                >
                  <Picker.Item
                    label="Select Location"
                    value=""
                    style={globalStyles.pickerItem}
                  />
                  {locations.map((loc) => (
                    <Picker.Item
                      key={loc.location_id}
                      label={loc.address}
                      value={loc.location_id}
                      style={globalStyles.pickerItem}
                    />
                  ))}
                </Picker>
              </View>
            )}

            <TouchableOpacity
              style={globalStyles.button}
              onPress={this.handleEmployeeInduction}
            >
              <Text style={globalStyles.buttonText}>Save Induction</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  }
}

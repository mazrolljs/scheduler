// src/app/drawer/screens/user/OfferedShiftScreen.jsx
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../../services/firebaseConfig";
import { format } from "date-fns";
//import { Colors } from "../../../../assets/constants/colors";
import { globalStyles } from "../../../../assets/constants/styles";
import CustomCalendar from "../../../../assets/components/CustomCalendar";
import CustomTimePicker from "../../../../assets/components/CustomTime";
import {
  fetchEmployees,
  fetchLocations,
} from "../../../../assets/constants/functions";

export default class OfferedShiftScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      showCalendar: false,
      startTime: "07:00 AM",
      endTime: "03:00 PM",
      showStartTimePicker: false,
      showEndTimePicker: false,
      selectedEmpId: "",
      employees: [],
      selectedLocation: "",
      locations: [],
      showLocationPicker: false,
      showEmployeePicker: false,
      notes: "",
    };
  }

  componentDidMount() {
    this.fetchEmployees();
    this.fetchLocations();
  }

  fetchEmployees = async () => {
    const employees = await fetchEmployees();
    this.setState({ employees });
  };

  fetchLocations = async () => {
    const locations = await fetchLocations();
    this.setState({ locations });
  };

  handleSubmit = async () => {
    const { date, startTime, endTime, selectedEmpId, selectedLocation, notes } =
      this.state;
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
      this.setState({
        notes: "",
        selectedEmpId: "",
        selectedLocation: "",
        startTime: "07:00 AM",
        endTime: "03:00 PM",
        date: new Date(),
      });
    } catch (error) {
      Alert.alert("❌ Error", error.message);
    }
  };

  render() {
    const {
      date,
      showCalendar,
      startTime,
      endTime,
      showStartTimePicker,
      showEndTimePicker,
      selectedEmpId,
      employees,
      selectedLocation,
      locations,
      showLocationPicker,
      showEmployeePicker,
      notes,
    } = this.state;

    return (
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        <Text style={globalStyles.subtitle}>Offer a New Shift</Text>

        {/* Date */}
        <TouchableOpacity
          style={globalStyles.input}
          onPress={() => this.setState({ showCalendar: !showCalendar })}
        >
          <Text style={globalStyles.inputText}>
            {format(date, "dd-MM-yyyy")}
          </Text>
        </TouchableOpacity>

        {showCalendar && (
          <CustomCalendar
            selectedDate={date}
            onDateSelect={(d) =>
              this.setState({ date: d, showCalendar: false })
            }
          />
        )}

        {/* Start Time */}
        <TouchableOpacity
          style={globalStyles.input}
          onPress={() => this.setState({ showStartTimePicker: true })}
        >
          <Text style={globalStyles.inputText}>Start Time: {startTime}</Text>
        </TouchableOpacity>

        {showStartTimePicker && (
          <CustomTimePicker
            selectedTime={startTime}
            minuteInterval={10} // set your interval here
            onTimeSelect={(time) =>
              this.setState({ startTime: time, showStartTimePicker: false })
            }
          />
        )}

        {/* End Time */}
        <TouchableOpacity
          style={globalStyles.input}
          onPress={() => this.setState({ showEndTimePicker: true })}
        >
          <Text style={globalStyles.inputText}>End Time: {endTime}</Text>
        </TouchableOpacity>

        {showEndTimePicker && (
          <CustomTimePicker
            selectedTime={endTime}
            minuteInterval={30} // set your interval here
            onTimeSelect={(time) =>
              this.setState({ endTime: time, showEndTimePicker: false })
            }
          />
        )}

        {/* Location */}
        <TouchableOpacity
          style={globalStyles.input}
          onPress={() =>
            this.setState({ showLocationPicker: !showLocationPicker })
          }
        >
          <Text style={globalStyles.inputText}>
            {selectedLocation
              ? `Location: ${locations.find((l) => l.location_id === selectedLocation)?.address || selectedLocation}`
              : "Select Location"}
          </Text>
        </TouchableOpacity>

        {showLocationPicker && (
          <View style={globalStyles.pickerContainer}>
            {locations.map((loc) => (
              <TouchableOpacity
                key={loc.location_id}
                onPress={() =>
                  this.setState({
                    selectedLocation: loc.location_id,
                    showLocationPicker: false,
                  })
                }
              >
                <Text style={globalStyles.inputText}>{loc.address}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Employee */}
        <TouchableOpacity
          style={globalStyles.input}
          onPress={() =>
            this.setState({ showEmployeePicker: !showEmployeePicker })
          }
        >
          <Text style={globalStyles.inputText}>
            {selectedEmpId
              ? `Employee: ${employees.find((e) => e.id === selectedEmpId)?.name || selectedEmpId}`
              : "Select Employee or leave blank for shared shift"}
          </Text>
        </TouchableOpacity>

        {showEmployeePicker && (
          <View style={globalStyles.pickerContainer}>
            {employees.map((emp) => (
              <TouchableOpacity
                key={emp.id}
                onPress={() =>
                  this.setState({
                    selectedEmpId: emp.id,
                    showEmployeePicker: false,
                  })
                }
              >
                <Text
                  style={globalStyles.inputText}
                >{`${emp.name} (${emp.emp_id})`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Notes */}
        <TextInput
          style={globalStyles.textArea}
          placeholder="Notes (optional)"
          value={notes}
          onChangeText={(text) => this.setState({ notes: text })}
          multiline
        />

        {/* Save */}
        <TouchableOpacity
          style={globalStyles.button}
          onPress={this.handleSubmit}
        >
          <Text style={globalStyles.buttonText}>Save Shift</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

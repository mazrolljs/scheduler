import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  View,
  BackHandler,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import {
  db,
  auth,
  generateNextEmpId,
  fetchLocations,
} from "../../services/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
//import { useForm, Controller } from "react-hook-form";
//import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DropDownPicker from "react-native-dropdown-picker";
import { router } from "expo-router";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  middleName: yup.string(),
  familyName: yup.string().required("Family name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
  role: yup.string().required("Role is required"),
  emp_location: yup.array().min(1, "Select at least one location"),
});

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      items: [],
      formData: {
        firstName: "",
        middleName: "",
        familyName: "",
        email: "",
        password: "",
        role: "",
        emp_location: [],
      },
      errors: {},
    };
  }

  componentDidMount() {
    const backAction = () => {
      router.back();
      return true;
    };
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    this.loadLocations();
  }

  componentWillUnmount() {
    if (this.backHandler) {
      this.backHandler.remove();
    }
  }

  loadLocations = async () => {
    try {
      const locs = await fetchLocations(db);
      const dropdownData = locs.map((loc) => ({
        label: `${loc.location_id} - ${loc.address}`,
        value: loc.id,
      }));
      this.setState({ items: dropdownData });
    } catch (error) {
      console.error(error);
    }
  };

  onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      const empId = await generateNextEmpId(db);

      await addDoc(collection(db, "users"), {
        uid: user.uid,
        emp_id: empId,
        firstName: data.firstName.trim(),
        middleName: data.middleName?.trim() ?? "",
        familyName: data.familyName.trim(),
        email: data.email.trim(),
        role: data.role,
        created_at: new Date().toISOString(),
      });

      const empLocationsRef = collection(db, "emp_location");
      for (const loc of data.emp_location) {
        await addDoc(empLocationsRef, {
          emp_id: empId,
          location_id: loc,
        });
      }

      Alert.alert("Success", "Sign up completed!", [
        { text: "OK", onPress: () => router.push("/screens/SignIn") },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  handleInputChange = (field, value) => {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [field]: value,
      },
    }));
  };

  handleSubmit = () => {
    const { formData } = this.state;
    // Validate using yup
    schema
      .validate(formData, { abortEarly: false })
      .then(() => {
        this.setState({ errors: {} });
        this.onSubmit(formData);
      })
      .catch((validationErrors) => {
        const errors = {};
        validationErrors.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        this.setState({ errors });
      });
  };

  render() {
    const { open, items, formData, errors } = this.state;

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Sign Up</Text>

          <TextInput
            style={styles.input}
            placeholder="First Name"
            onChangeText={(value) => this.handleInputChange("firstName", value)}
            value={formData.firstName}
          />
          {errors.firstName && (
            <Text style={styles.error}>{errors.firstName}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Middle Name"
            onChangeText={(value) =>
              this.handleInputChange("middleName", value)
            }
            value={formData.middleName}
          />

          <TextInput
            style={styles.input}
            placeholder="Family Name"
            onChangeText={(value) =>
              this.handleInputChange("familyName", value)
            }
            value={formData.familyName}
          />
          {errors.familyName && (
            <Text style={styles.error}>{errors.familyName}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(value) => this.handleInputChange("email", value)}
            value={formData.email}
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={(value) => this.handleInputChange("password", value)}
            value={formData.password}
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}

          <Text style={{ color: "white", marginBottom: 5 }}>Select Role:</Text>

          <DropDownPicker
            open={open}
            setOpen={(open) => this.setState({ open })}
            items={[
              { label: "Employee", value: "employee" },
              { label: "Admin", value: "admin" },
            ]}
            value={formData.role}
            setValue={(value) => this.handleInputChange("role", value)}
            setItems={() => {}}
            placeholder="Choose Role"
            multiple={false}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
          {errors.role && <Text style={styles.error}>{errors.role}</Text>}

          <Text style={{ color: "white", marginBottom: 5 }}>
            Select Location:
          </Text>

          <DropDownPicker
            open={open}
            setOpen={(open) => this.setState({ open })}
            items={items}
            value={formData.emp_location}
            setValue={(value) => this.handleInputChange("emp_location", value)}
            setItems={() => {}}
            placeholder="Choose Locations"
            multiple={true}
            mode="BADGE"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
          {errors.emp_location && (
            <Text style={styles.error}>{errors.emp_location}</Text>
          )}

          <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#c9d0c9" },
  container: { padding: 20 },
  title: {
    fontSize: 26,
    color: "white",
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "rgba(0,0,0,0.15)",
    color: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  dropdown: {
    backgroundColor: "rgba(0,0,0,0.15)",
    borderColor: "transparent",
    marginBottom: 15,
  },
  dropdownContainer: {
    backgroundColor: "#7c8c7c",
    borderColor: "transparent",
  },
  button: {
    backgroundColor: "#fbbf24",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { fontSize: 18, fontWeight: "700", color: "#5f1616" },
  error: { color: "#fbbf24", marginBottom: 10 },
});

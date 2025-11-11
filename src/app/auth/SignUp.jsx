// Refactored SignUp screen using Tailwind + global styles
// Logic untouched — only UI redesigned as requested.

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  BackHandler,
  Alert,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import {
  db,
  auth,
  generateNextEmpId,
  fetchLocations,
} from "../../services/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import * as yup from "yup";
import DropDownPicker from "react-native-dropdown-picker";
import { router } from "expo-router";
import { Colors } from "../../assets/constants/colors";

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
      openRole: false,
      openLocation: false,
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
    if (this.backHandler) this.backHandler.remove();
  }

  loadLocations = async () => {
    try {
      const locs = await fetchLocations(db);
      const dropdownData = locs.map((loc) => ({
        label: `${loc.location_id} - ${loc.address}`,
        value: loc.id,
      }));
      this.setState({ items: dropdownData });
    } catch (e) {
      console.error(e);
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
        { text: "OK", onPress: () => router.push("/auth/SignIn") },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  handleInputChange = (field, value) => {
    this.setState((prev) => ({
      formData: {
        ...prev.formData,
        [field]: value,
      },
    }));
  };

  handleSubmit = () => {
    const { formData } = this.state;
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
    const { openRole, openLocation, items, formData, errors } = this.state;

    return (
      <SafeAreaView className="flex-1 bg-Pcalight-background px-4">
        <View className="pt-6">
          <Text className="text-3xl text-white font-bold text-center mb-6">
            Sign Up
          </Text>

          {/* First Name */}
          <TextInput
            className="bg-black/20 text-white p-3 rounded-xl mb-2"
            placeholder="First Name"
            placeholderTextColor="#ddd"
            value={formData.firstName}
            onChangeText={(v) => this.handleInputChange("firstName", v)}
          />
          {errors.firstName && (
            <Text className="text-yellow-300 mb-2">{errors.firstName}</Text>
          )}

          {/* Middle Name */}
          <TextInput
            className="bg-black/20 text-white p-3 rounded-xl mb-2"
            placeholder="Middle Name"
            placeholderTextColor="#ddd"
            value={formData.middleName}
            onChangeText={(v) => this.handleInputChange("middleName", v)}
          />

          {/* Family Name */}
          <TextInput
            className="bg-black/20 text-white p-3 rounded-xl mb-2"
            placeholder="Family Name"
            placeholderTextColor="#ddd"
            value={formData.familyName}
            onChangeText={(v) => this.handleInputChange("familyName", v)}
          />
          {errors.familyName && (
            <Text className="text-yellow-300 mb-2">{errors.familyName}</Text>
          )}

          {/* Email */}
          <TextInput
            className="bg-black/20 text-white p-3 rounded-xl mb-2"
            placeholder="Email"
            placeholderTextColor="#ddd"
            autoCapitalize="none"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(v) => this.handleInputChange("email", v)}
          />
          {errors.email && (
            <Text className="text-yellow-300 mb-2">{errors.email}</Text>
          )}

          {/* Password */}
          <TextInput
            className="bg-black/20 text-white p-3 rounded-xl mb-2"
            placeholder="Password"
            placeholderTextColor="#ddd"
            secureTextEntry
            value={formData.password}
            onChangeText={(v) => this.handleInputChange("password", v)}
          />
          {errors.password && (
            <Text className="text-yellow-300 mb-2">{errors.password}</Text>
          )}

          {/* Role Dropdown */}
          <Text className="text-white mt-2 mb-1">Select Role:</Text>
          <DropDownPicker
            open={openRole}
            setOpen={(v) => this.setState({ openRole: v })}
            items={[
              { label: "Employee", value: "employee" },
              { label: "Admin", value: "admin" },
            ]}
            value={formData.role}
            setValue={(v) => this.handleInputChange("role", v)}
            placeholder="Choose Role"
            style={{
              backgroundColor: "rgba(0,0,0,0.2)",
              borderColor: "transparent",
            }}
            dropDownContainerStyle={{
              backgroundColor: Colors.light.text,
              borderColor: "transparent",
            }}
          />
          {errors.role && (
            <Text className="text-yellow-300 mb-2">{errors.role}</Text>
          )}

          {/* Location Dropdown */}
          <Text className="text-white mt-2 mb-1">Select Location:</Text>
          <DropDownPicker
            open={openLocation}
            setOpen={(v) => this.setState({ openLocation: v })}
            items={items}
            value={formData.emp_location}
            setValue={(v) => this.handleInputChange("emp_location", v)}
            placeholder="Choose Locations"
            multiple
            mode="BADGE"
            style={{
              backgroundColor: "rgba(0,0,0,0.2)",
              borderColor: "transparent",
            }}
            dropDownContainerStyle={{
              backgroundColor: Colors.light.text,
              borderColor: "transparent",
            }}
          />
          {errors.emp_location && (
            <Text className="text-yellow-300 mb-2">{errors.emp_location}</Text>
          )}

          {/* Submit */}
          <TouchableOpacity
            className="bg-yellow-400 p-4 rounded-xl mt-4 items-center"
            onPress={this.handleSubmit}
          >
            <Text
              className="text-lg font-bold"
              style={{ color: Colors.dark.background }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-300 rounded-xl m-5 px-12 py-3 self-center"
        >
          <Text className="text-black font-medium text-base text-center">
            Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

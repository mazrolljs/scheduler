import React, { useState, useEffect } from "react";
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
import { db, auth } from "../../services/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DropDownPicker from "react-native-dropdown-picker";
import { router } from "expo-router";
import {
  generateNextEmpId,
  fetchLocations,
} from "../../services/firebaseConfig";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  middleName: yup.string(),
  familyName: yup.string().required("Family name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
  role: yup.string().required("Role is required"),
  emp_location: yup.array().min(1, "Select at least one location"),
});

export default function SignUp() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      emp_location: [],
    },
  });

  useEffect(() => {
    const backAction = () => {
      router.back();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locs = await fetchLocations(db);
        const dropdownData = locs.map((loc) => ({
          label: `${loc.location_id} - ${loc.address}`,
          value: loc.id,
        }));
        setItems(dropdownData);
      } catch (error) {
        console.error(error);
      }
    };
    loadLocations();
  }, []);

  const onSubmit = async (data) => {
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>

        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="First Name"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.firstName && (
          <Text style={styles.error}>{errors.firstName.message}</Text>
        )}

        <Controller
          control={control}
          name="middleName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Middle Name"
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="familyName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Family Name"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.familyName && (
          <Text style={styles.error}>{errors.familyName.message}</Text>
        )}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}

        <Text style={{ color: "white", marginBottom: 5 }}>Select Role:</Text>

        <Controller
          control={control}
          name="role"
          render={({ field: { value, onChange } }) => (
            <DropDownPicker
              open={open}
              setOpen={setOpen}
              items={[
                { label: "Employee", value: "employee" },
                { label: "Admin", value: "admin" },
              ]}
              value={value}
              setValue={(cb) => {
                const newValue = cb(value);
                onChange(newValue);
              }}
              setItems={setItems}
              placeholder="Choose Role"
              multiple={false}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          )}
        />
        {errors.role && <Text style={styles.error}>{errors.role.message}</Text>}

        <Text style={{ color: "white", marginBottom: 5 }}>
          Select Location:
        </Text>

        <Controller
          control={control}
          name="emp_location"
          render={({ field: { value, onChange } }) => (
            <DropDownPicker
              open={open}
              setOpen={setOpen}
              items={items}
              value={value}
              setValue={(cb) => {
                const newValue = cb(value);
                onChange(newValue);
              }}
              setItems={setItems}
              placeholder="Choose Locations"
              multiple={true}
              mode="BADGE"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />
          )}
        />
        {errors.emp_location && (
          <Text style={styles.error}>{errors.emp_location.message}</Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
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

import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

// ✅ Validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});

export default function SignIn() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "email@gmail.com", password: "123123" },
  });

  const onSubmit = async (data) => {
    try {
      // Temporary bypass for testing
      if (data.email === "email@gmail.com" && data.password === "123123") {
        Alert.alert("Login Successful", `Welcome ${data.email}`);
        router.push("/(tabs)/dashboard");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      let errorMessage = "Failed to sign in. Please try again.";
      if (error.message === "Invalid credentials") {
        errorMessage = "Invalid email or password.";
      }
      Alert.alert("Sign In Error", errorMessage);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 justify-center">
      <Text className="text-3xl font-bold text-center mb-8">Sign In</Text>

      {/* EMAIL */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <TextInput
              className="border border-gray-300 rounded-lg p-3"
              placeholder="Email"
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || "Email@gmail.com"}
              autoCapitalize="none"
            />
            {errors.email && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* PASSWORD */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-6">
            <TextInput
              className="border border-gray-300 rounded-lg p-3"
              placeholder="Password"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || "123123"}
            />
            {errors.password && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* SIGN IN BUTTON */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className={`rounded-lg p-4 mb-4 ${isSubmitting ? "bg-gray-400" : "bg-indigo-600"}`}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      {/* SIGN UP LINK */}
      <TouchableOpacity onPress={() => router.push("/screens/SignUp")}>
        <Text className="text-center text-indigo-600">
          Don’t have an account? Sign Up
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.back()}
        className="bg-gray-300 rounded-lg m-5 px-12 py-3 self-center p-4 mb-4"
      >
        <Text className="text-black font-medium text-base text-center">
          Back
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

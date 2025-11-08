import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../services/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup

    .string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});

const SignIn = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "jaws@gmail.com", password: "jaspal" },
  });

  const handleSignIn = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // 🔥 Fetch user details from Firestore where uid matches
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Error", "User profile not found in Firestore!");
        return;
      }

      const userData = querySnapshot.docs[0].data();
      /* ✅ Console all user data
      console.log("🧑‍💼 Logged in user data:", userData);
      querySnapshot.forEach((doc) => {
        console.log("🧠 User document ID:", doc.id);
        console.log("📄 User data:", doc.data());
      });*/

      Alert.alert(
        "Login Successful",
        `Welcome ${
          userData.firstName && userData.familyName
            ? `${userData.firstName} ${userData.familyName}`
            : data.email
        }!`
      );

      router.push("../drawer/DrawerNavigator");
      //console.log("📄 User data:", userData.role);
      // 🧭 Role-based navigation
      /*switch (userData.role) {
        case "admin":
          
          break;
        case "manager":
          router.push("/drawer/managerDashboard");
          break;
        default:
          router.push("/drawer/userDashboard");
          break;
      }*/
    } catch (error) {
      let msg = "Failed to sign in. Please try again.";
      if (error.code === "auth/user-not-found")
        msg = "No user found with this email.";
      else if (error.code === "auth/wrong-password")
        msg = "Incorrect password.";
      else if (error.code === "auth/invalid-email")
        msg = "Invalid email address.";
      Alert.alert("Sign In Error", msg);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 justify-center">
      <Text className="text-3xl font-bold text-center mb-8">Sign In</Text>

      {/* EMAIL */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <TextInput
              className="border border-gray-300 rounded-lg p-3"
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={onChange}
              value={value}
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
        render={({ field: { onChange, value } }) => (
          <View className="mb-6">
            <TextInput
              className="border border-gray-300 rounded-lg p-3"
              placeholder="Password"
              secureTextEntry
              onChangeText={onChange}
              value={value}
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
        onPress={handleSubmit(handleSignIn)}
        disabled={isSubmitting}
        className={`rounded-lg p-4 mb-4 ${isSubmitting ? "bg-gray-400" : "bg-purple-900"}`}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      {/* SIGN UP LINK */}
      <TouchableOpacity onPress={() => router.push("/screens/SignUp")}>
        <Text className="text-center text-purple-900">
          Don’t have an account? Sign Up
        </Text>
      </TouchableOpacity>

      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="bg-gray-300 rounded-lg m-5 px-12 py-3 self-center"
      >
        <Text className="text-black font-medium text-base text-center">
          Back
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignIn;

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
} from "react-native";
import ddd from "../assets/images/CENTRED_APPROACH.png";
import { Colors } from "../assets/constants/colors";

export default function Index() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-Pcalight-background">
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.Pcalight.text}
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View className="items-center justify-center px-4">
          <Image source={ddd} className="w-80 h-32 mb-6" resizeMode="contain" />
          <View className="w-3/4">
            <TouchableOpacity
              onPress={() => router.push("../auth/SignUp")}
              className="bg-purple-900 p-4 my-2 rounded-lg items-center"
            >
              <Text className="text-white text-xl font-semibold text-center">
                Sign Up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("../auth/SignIn")}
              className="bg-purple-900 p-4 my-2 rounded-lg items-center"
            >
              <Text className="text-white text-xl font-semibold text-center">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

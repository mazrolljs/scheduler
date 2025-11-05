import React from "react";
import { View, ScrollView, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../../context/AuthContext";
import { Colors } from "../../../assets/constants/colors";

export default function MainNavigator() {
  const navigation = useNavigation();
  const { role } = useUser();

  const employeeItems = [
    {
      label: "My Schedule",
      image: require("../../../assets/images/app-icons/schedule_normal.png"),
      target: "ScheduleScreen",
    },
    {
      label: "Profile",
      image: require("../../../assets/images/app-icons/user_normal.png"),
      target: "My Profile",
    },
    {
      label: "Offered Shift",
      image: require("../../../assets/images/app-icons/schedule.png"),
      target: "Shift Offered",
    },
    {
      label: "Settings",
      image: require("../../../assets/images/app-icons/settings_normal.png"),
      target: "Settings",
    },
  ];

  const adminItems = [
    {
      label: "Offer Shift",
      image: require("../../../assets/images/app-icons/schedule.png"),
      target: "Shift Offered",
    },
    {
      label: "Settings",
      image: require("../../../assets/images/app-icons/settings_normal.png"),
      target: "Settings",
    },
    {
      label: "Profile",
      image: require("../../../assets/images/app-icons/user_normal.png"),
      target: "My Profile",
    },
    {
      label: "Shared Shift",
      image: require("../../../assets/images/app-icons/history_normal.png"),
      target: "Shift Shared",
    },
    {
      label: "Admin Approval",
      image: require("../../../assets/images/app-icons/settings_normal.png"),
      target: "Admin Approval",
    },
  ];

  const items = role === "admin" ? adminItems : employeeItems;

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8F9FF",
        paddingVertical: 20,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          marginBottom: 20,
          color: "#425b91",
        }}
      >
        Dashboard
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(item.target)}
            style={{
              backgroundColor: Colors.Pcalight.background,
              alignItems: "center",
              justifyContent: "center",
              width: 140,
              height: 140,
              margin: 10,
              borderRadius: 16,
              elevation: 4,
              shadowColor: "#740505",
              shadowOpacity: 0.6,
              shadowRadius: 6,
              shadowOffset: { width: 10, height: 3 },
            }}
          >
            <Image
              source={item.image}
              style={{
                width: 64,
                height: 64,
                marginBottom: 8,
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: Colors.Pcalight.text,
              }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

import React from "react";
import { View, ScrollView, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function MainNavigator() {
  const navigation = useNavigation();

  const items = [
    {
      label: "My Schedule",
      image: require("../../assets/images/schedule_normal.png"),
      target: "ScheduleScreen",
    },
    {
      label: "Profile",
      image: require("../../assets/images/user_normal.png"),
      target: "My Profile",
    },
    {
      label: "History",
      image: require("../../assets/images/history_normal.png"),
      target: "History",
    },
    {
      label: "Settings",
      image: require("../../assets/images/settings_normal.png"),
      target: "Settings",
    },
  ];

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
          color: "#111827",
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
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              width: 140,
              height: 140,
              margin: 10,
              borderRadius: 16,
              elevation: 3,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 3 },
            }}
          >
            <Image
              source={item.image}
              style={{ width: 64, height: 64, marginBottom: 8 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

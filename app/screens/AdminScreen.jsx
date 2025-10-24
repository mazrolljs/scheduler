import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AdminScreen({ navigation }) {
  // In a real app, these handlers would navigate to other screens or trigger logic
  // const handleShiftSharing = () => console.log("Shift Sharing pressed");
  const handleShiftApproval = () => console.log("Shift Approval pressed");
  const handleShiftAllocation = () => console.log("Shift Allocation pressed");
  const handleEmployeeList = () => console.log("Employee List pressed");

  const sections = [
    {
      id: "1",
      title: "Shift Sharing",
      description: "Manage or share shifts with other employees.",
      icon: "share-social-outline",
      onPress: () => navigation.navigate("ShiftSharingScreen"),
    },
    {
      id: "2",
      title: "Shift Approval",
      description: "Approve or reject requested shift changes.",
      icon: "checkmark-done-circle-outline",
      onPress: handleShiftApproval,
    },
    {
      id: "3",
      title: "Shift Allocation",
      description: "Allocate shifts across employees and departments.",
      icon: "calendar-outline",
      onPress: handleShiftAllocation,
    },
    {
      id: "4",
      title: "Employee List",
      description: "View and manage registered employees.",
      icon: "people-outline",
      onPress: handleEmployeeList,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Admin Dashboard</Text>

        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={section.onPress}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={section.icon} size={28} color="#2563eb" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{section.title}</Text>
              <Text style={styles.cardDescription}>{section.description}</Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color="#9ca3af"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 12,
    color: "#111827",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  iconContainer: {
    backgroundColor: "#e0e7ff",
    padding: 10,
    borderRadius: 12,
    marginRight: 14,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1f2937",
  },
  cardDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
});

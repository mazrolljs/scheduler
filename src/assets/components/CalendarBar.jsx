import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDateRange } from "../../utils/utils";

export default function CalendarBar({
  weekStart,
  weekEnd,
  prevWeek,
  nextWeek,
  pointerEvents = "auto",
}) {
  return (
    <View
      style={{
        height: 35,
        backgroundColor: "#4F46E5",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
      }}
      pointerEvents={pointerEvents}
    >
      <Pressable onPress={prevWeek}>
        <Ionicons name="chevron-back" size={24} color="#fff" />
      </Pressable>
      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
        {formatDateRange(weekStart)} – {formatDateRange(weekEnd)}
      </Text>
      <Pressable onPress={nextWeek}>
        <Ionicons name="chevron-forward" size={24} color="#fff" />
      </Pressable>
    </View>
  );
}

import React from "react";
import { View, Text } from "react-native";
import { Colors } from "../constants/colors";

export default function HeaderRow({
  weekDaysWithDates,
  hourColWidth,
  boxWidth,
  gap,
  pointerEvents = "auto",
}) {
  return (
    <View style={{ flexDirection: "row" }} pointerEvents={pointerEvents}>
      <View
        style={{
          width: hourColWidth,
          height: 45,
          backgroundColor: Colors.light.background,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderColor: "#6038be",
        }}
      />
      {weekDaysWithDates.map((dateObj, idx) => {
        const isToday = dateObj.toDateString() === new Date().toDateString();
        return (
          <View
            key={idx}
            style={{
              width: boxWidth,
              height: 45,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isToday ? Colors.PRIMARY : "#ddd",
              borderRightWidth: 1,
              borderBottomWidth: 1,
              borderColor: "#ccc",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 12,
                color: isToday
                  ? Colors.light.background
                  : Colors.dark.background,
              }}
            >
              {dateObj.toLocaleDateString("en-US", { weekday: "short" })}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 12,
                color: isToday
                  ? Colors.light.background
                  : Colors.dark.background,
              }}
            >
              {dateObj.getDate()}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

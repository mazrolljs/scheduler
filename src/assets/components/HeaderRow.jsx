import React from "react";
import { View, Text } from "react-native";

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
          backgroundColor: "#f0f0f0",
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderColor: "#ccc",
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
              backgroundColor: isToday ? "#F59E0B" : "#ddd",
              borderRightWidth: 1,
              borderBottomWidth: 1,
              borderColor: "#ccc",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 12,
                color: isToday ? "#fff" : "#000",
              }}
            >
              {dateObj.toLocaleDateString("en-US", { weekday: "short" })}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 12,
                color: isToday ? "#fff" : "#000",
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

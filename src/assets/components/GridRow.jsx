import React from "react";
import { View, Text, Pressable } from "react-native";
import { Colors } from "../constants/colors";

export default function GridRow({
  hour,
  rowIdx,
  cols,
  hourColWidth,
  boxWidth,
  boxHeight,
  gap,
  filled,
  handlePress,
  panHandlers,
}) {
  return (
    <View key={rowIdx} style={{ flexDirection: "row" }} {...panHandlers}>
      <View
        style={{
          width: hourColWidth,
          height: boxHeight,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.light.background,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderColor: "#ccc",
        }}
      >
        <Text style={{ fontSize: 12 }}>{hour}</Text>
      </View>
      {Array.from({ length: cols }).map((_, colIdx) => (
        <Pressable
          key={colIdx}
          onPress={() => handlePress(colIdx, rowIdx)}
          style={{
            width: boxWidth,
            height: boxHeight,
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderColor: "#ccc",
            backgroundColor: filled[colIdx][rowIdx]
              ? Colors.SECONDARY
              : Colors.light.background,
          }}
        />
      ))}
    </View>
  );
}

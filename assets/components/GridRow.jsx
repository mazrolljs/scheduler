import React from "react";
import { View, Text, Pressable } from "react-native";

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
}) {
  return (
    <View key={rowIdx} style={{ flexDirection: "row" }}>
      <View
        style={{
          width: hourColWidth,
          height: boxHeight,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#eee",
          borderRightWidth: gap,
          borderBottomWidth: gap,
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
            borderRightWidth: gap,
            borderBottomWidth: gap,
            borderColor: "#ccc",
            backgroundColor: filled[colIdx][rowIdx] ? "#4Fb6E5" : "#f2f2f2",
          }}
        />
      ))}
    </View>
  );
}

import React from "react";
import { View, Text } from "react-native";
import GridBoxes from "../../assets/components/GridBoxes";

export default function ScheduleScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Text
        style={{
          textAlign: "center",
          fontSize: 2,
          fontWeight: "bold",
          marginVertical: 1,
        }}
      ></Text>
      <GridBoxes rows={24} cols={7} empId={"emp_004"} />
    </View>
  );
}

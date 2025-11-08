import React from "react";
import { View } from "react-native";
import GridBoxes from "../../../assets/components/GridBoxes";
import { Colors } from "../../../assets/constants/colors";

export default function ScheduleScreen({ route }) {
  const drawMode = route?.params?.drawMode ?? true;
  return (
    <View style={{ flex: 1, backgroundColor: Colors.dark.background }}>
      <GridBoxes rows={24} cols={7} empId={"emp_004"} drawMode={drawMode} />
    </View>
  );
}

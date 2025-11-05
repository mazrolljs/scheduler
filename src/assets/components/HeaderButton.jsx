// components/HeaderPaintButton.js
import React, { useState, useEffect } from "react";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HeaderButton() {
  const navigation = useNavigation();
  //  const route = useRoute();

  // ✅ Start in Paint mode by default
  const [drawMode, setDrawMode] = useState(true);

  // ✅ Send the updated drawMode to the current screen via params
  useEffect(() => {
    navigation.setParams({ drawMode });
  }, [drawMode, navigation]);

  return (
    <Button
      title={drawMode ? "🖌️ Paint" : "🧽 Erase"}
      color={drawMode ? "#007AFF" : "#FF9500"}
      onPress={() => setDrawMode((prev) => !prev)} // ✅ toggle paint/erase
    />
  );
}

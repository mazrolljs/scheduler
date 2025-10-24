import React, { useState } from "react";
import { TouchableOpacity, Image, Text, View } from "react-native";

export default function ClickableCard({ image, pressedImage, label, onPress }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      style={{
        alignItems: "center",
        margin: 12,
      }}
    >
      <View
        style={{
          borderRadius: 16,
          overflow: "hidden",
          elevation: 4,
          backgroundColor: "#fff",
          transform: [{ scale: isPressed ? 0.97 : 1 }],
        }}
      >
        <Image
          source={isPressed ? pressedImage : image}
          style={{
            width: 120,
            height: 120,
            borderRadius: 16,
          }}
          resizeMode="cover"
        />
      </View>
      {label && (
        <Text
          style={{
            marginTop: 8,
            fontWeight: "600",
            color: "#333",
            fontSize: 14,
          }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

import React from "react";
import { TouchableOpacity, Image, Text, View } from "react-native";
import { Colors } from "../constants/colors";

export default class ClickableCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPressed: false,
    };
  }

  handlePressIn = () => {
    this.setState({ isPressed: true });
  };

  handlePressOut = () => {
    this.setState({ isPressed: false });
  };

  render() {
    const { image, pressedImage, label, onPress } = this.props;
    const { isPressed } = this.state;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={this.handlePressIn}
        onPressOut={this.handlePressOut}
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
            backgroundColor: Colors.light.background,
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
              color: Colors.light.text,
              fontSize: 14,
            }}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}

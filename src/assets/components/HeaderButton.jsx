// components/HeaderPaintButton.js
import React from "react";
import { Button } from "react-native";
import { Colors } from "../constants/colors";
//mport { useNavigation } from "@react-navigation/native";

export default class HeaderButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawMode: true, // ✅ Start in Paint mode by default
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.drawMode !== this.state.drawMode) {
      // ✅ Send the updated drawMode to the current screen via params
      this.props.navigation.setParams({ drawMode: this.state.drawMode });
    }
  }

  toggleDrawMode = () => {
    this.setState((prevState) => ({ drawMode: !prevState.drawMode }));
  };

  render() {
    const { drawMode } = this.state;
    return (
      <Button
        title={drawMode ? "🖌️ Paint" : "🧽 Erase"}
        color={drawMode ? Colors.PRIMARY : Colors.SECONDARY}
        onPress={this.toggleDrawMode} // ✅ toggle paint/erase
      />
    );
  }
}

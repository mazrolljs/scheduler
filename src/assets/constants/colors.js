// src/constants/Colors.js

const tintColorLight = "#0a7ea4";
const tintColorDark = "#ffffff";
const primary = "#f49b33";
const secondary = "#22bbbb";

const Colors = {
  Pcalight: {
    text: "#3a1a7e",
    background: "#e6e8ff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#4a9e2a",
    tabIconSelected: tintColorLight,
    backgroundLight: "#d5d9ff",
  },
  light: {
    text: "#590a7e",
    background: "#efe8ef",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: primary,
    tabIconSelected: tintColorLight,
    backgroundLight: "#6038be",
  },
  dark: {
    text: "#ecedee",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9ba1a6",
    tabIconDefault: "#9ba1a6",
    tabIconSelected: tintColorDark,
  },
  PRIMARY: primary,
  SECONDARY: secondary,
};

module.exports = { Colors };

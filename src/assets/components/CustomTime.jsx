// src/assets/components/CustomTimePicker.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { Colors } from "../constants/colors";

const { width } = Dimensions.get("window");

export default function CustomTimePicker({
  selectedTime,
  onTimeSelect,
  fontSize = 16,
  minuteInterval = 30,
}) {
  const [times, setTimes] = useState([]);

  // Generate times based on interval
  useEffect(() => {
    const generateTimes = () => {
      const t = [];
      for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += minuteInterval) {
          let hour12 = h % 12 === 0 ? 12 : h % 12;
          let meridian = h < 12 ? "AM" : "PM";
          t.push(
            `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${meridian}`
          );
        }
      }
      return t;
    };
    setTimes(generateTimes());
  }, [minuteInterval]);

  const [selected, setSelected] = useState(selectedTime || times[0]);

  const handleConfirm = () => {
    onTimeSelect(selected);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: fontSize + 2 }]}>
        Select Time
      </Text>
      <ScrollView
        style={{ maxHeight: 250 }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {times.map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.timeItem,
              t === selected && {
                backgroundColor: Colors.Pcalight.tabIconDefault,
              },
            ]}
            onPress={() => setSelected(t)}
          >
            <Text
              style={[
                styles.timeText,
                t === selected
                  ? { color: Colors.Pcalight.background }
                  : { color: Colors.Pcalight.text },
              ]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmText}>Set Time</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    backgroundColor: Colors.Pcalight.background,
    borderRadius: 10,
    padding: 15,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: Colors.Pcalight.text,
  },
  timeItem: {
    width: 120,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
    borderRadius: 5,
  },
  timeText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  confirmButton: {
    marginTop: 15,
    backgroundColor: Colors.Pcalight.tabIconDefault,
    paddingVertical: 10,
    borderRadius: 6,
  },
  confirmText: {
    color: Colors.Pcalight.background,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

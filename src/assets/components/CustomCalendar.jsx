// src/components/CustomCalendar.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Colors } from "../constants/colors"; // adjust path if needed
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";

const { width } = Dimensions.get("window");

export default function CustomCalendar({
  selectedDate,
  onDateSelect,
  daySize = 40,
  fontSize = 14,
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate all days of the month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysArray = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const renderDay = (day) => {
    const isToday = isSameDay(day, new Date());
    const isSelected = selectedDate && isSameDay(day, selectedDate);

    return (
      <TouchableOpacity
        key={day.toISOString()}
        style={[
          styles.dayContainer,
          { width: daySize, height: daySize },
          isSelected && { backgroundColor: Colors.Pcalight.tabIconDefault },
          isToday && {
            borderColor: Colors.Pcalight.tabIconDefault,
            borderWidth: 1,
          },
        ]}
        onPress={() => onDateSelect(day)}
      >
        <Text
          style={[
            styles.dayText,
            { fontSize },
            isSelected
              ? { color: Colors.Pcalight.background }
              : { color: Colors.Pcalight.text },
          ]}
        >
          {day.getDate()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with month navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowButton}>
          <Text style={[styles.headerText, { fontSize: fontSize + 2 }]}>
            {"<"}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.headerText, { fontSize: fontSize + 2 }]}>
          {format(currentMonth, "MMMM yyyy")}
        </Text>

        <TouchableOpacity onPress={handleNextMonth} style={styles.arrowButton}>
          <Text style={[styles.headerText, { fontSize: fontSize + 2 }]}>
            {" "}
            {">"}{" "}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Weekdays */}
      <View style={styles.weekdaysContainer}>
        {weekdays.map((day) => (
          <Text
            key={day}
            style={[styles.weekdayText, { width: daySize, fontSize }]}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Days */}
      <View style={styles.daysContainer}>{daysArray.map(renderDay)}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width * 0.9, // shrink calendar width
    backgroundColor: Colors.Pcalight.background,
    borderRadius: 10,
    padding: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  arrowButton: {
    paddingHorizontal: 10,
  },
  headerText: {
    color: Colors.Pcalight.text,
    fontWeight: "bold",
  },
  weekdaysContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 5,
  },
  weekdayText: {
    textAlign: "center",
    color: Colors.Pcalight.tabIconDefault,
    fontWeight: "bold",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    borderRadius: 6,
  },
  dayText: {
    textAlign: "center",
  },
});

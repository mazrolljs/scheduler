import React, { useState, useEffect } from "react";
import { Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  getStartOfWeek,
  getWeekDaysWithDates,
  generateHours,
} from "../../assets/utils";
import CalendarBar from "./CalendarBar";
import HeaderRow from "./HeaderRow";
import GridRow from "./GridRow";

export default function CalendarGrid({
  rows = 24,
  cols = 7,
  gap = 3,
  empId = "emp_004", // Employee ID to fetch
}) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const calendarBarHeight = 35;
  const headerHeight = 45;
  const boxHeight =
    (screenHeight - calendarBarHeight - headerHeight) / rows - 5.5;
  const boxWidth = (screenWidth - 60 - gap * (cols - 1)) / cols; // day boxes width
  const hourColWidth = boxWidth * 1.7; // hours column width

  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [filled, setFilled] = useState(
    Array.from({ length: cols }, () => Array(rows).fill(false))
  );
  const [scheduleData, setScheduleData] = useState([]); // store employee schedule

  // --- Fetch employee schedule from Firestore ---
  useEffect(() => {
    if (!empId) return;

    const fetchSchedule = async () => {
      try {
        const startOfWeek = new Date(currentWeekStart);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);

        // Convert to YYYY-MM-DD strings
        const startStr = startOfWeek.toISOString().split("T")[0];
        const endStr = endOfWeek.toISOString().split("T")[0];

        const q = query(
          collection(db, "emp_sch_main"),
          where("emp_id", "==", empId),
          where("date", ">=", startStr),
          where("date", "<=", endStr)
        );
        console.log("Fetching schedule with query:", empId, startStr, endStr);
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched schedule:", list);
        setScheduleData(list);
      } catch (err) {
        console.error("Error fetching employee schedule:", err);
      }
    };

    fetchSchedule();
  }, [empId, currentWeekStart]);

  // --- Map schedule to filled grid ---
  useEffect(() => {
    console.log("Schedule data:", scheduleData);
    const newFilled = Array.from({ length: cols }, () =>
      Array(rows).fill(false)
    );

    scheduleData.forEach((item) => {
      console.log("Schedule data: inside ", item);
      const date = new Date(item.date);
      const colIdx = date.getDay() === 0 ? 6 : date.getDay() - 1; // Mon=0..Sun=6

      const startHour = parseInt(item.start_time.split(":")[0], 10);
      const endHour = parseInt(item.end_time.split(":")[0], 10);
      console.log(
        `🕒 Entry #${item + 1}: ${item.date} | ${item.start_time} - ${item.end_time} | Day Index: ${colIdx}`
      );
      for (let r = startHour; r <= endHour && r < rows; r++) {
        newFilled[colIdx][r] = true;
      }
    });

    setFilled(newFilled);
  }, [cols, rows, scheduleData]);

  const handlePress = (colIdx, rowIdx) => {
    // Optionally allow toggling for testing
    setFilled((prev) => {
      const newFilled = [...prev];
      newFilled[colIdx][rowIdx] = !newFilled[colIdx][rowIdx];
      return newFilled;
    });
  };

  const prevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const nextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const weekStart = getStartOfWeek(currentWeekStart);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const today = new Date();
  const weekDaysWithDates = getWeekDaysWithDates(weekStart);

  const hours = generateHours(rows);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffaf" }} edges={[]}>
      <CalendarBar
        weekStart={weekStart}
        weekEnd={weekEnd}
        prevWeek={prevWeek}
        nextWeek={nextWeek}
      />
      <HeaderRow
        weekDaysWithDates={weekDaysWithDates}
        hourColWidth={hourColWidth}
        boxWidth={boxWidth}
        gap={gap}
      />
      <ScrollView showsVerticalScrollIndicator style={{ flex: 1 }}>
        {hours.map((hour, rowIdx) => (
          <GridRow
            key={rowIdx}
            hour={hour}
            rowIdx={rowIdx}
            cols={cols}
            hourColWidth={hourColWidth}
            boxWidth={boxWidth}
            boxHeight={boxHeight}
            gap={gap}
            filled={filled}
            handlePress={handlePress}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

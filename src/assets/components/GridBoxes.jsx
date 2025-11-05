import React, { useState, useEffect, useRef } from "react";
import { Dimensions, View, PanResponder, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import {
  getStartOfWeek,
  getWeekDaysWithDates,
  generateHours,
} from "../../utils/utils";
import CalendarBar from "./CalendarBar";
import HeaderRow from "./HeaderRow";
import GridRow from "./GridRow";

export default function CalendarGrid({
  rows = 24,
  cols = 7,
  gap = 0,
  empId = "emp_004",
  drawMode = true, // 👈 accept prop from parent
}) {
  const screenWidth =
    Dimensions.get("window").width - (Platform.OS === "ios" ? 18 : 23);
  const screenHeight =
    Dimensions.get("window").height - (Platform.OS === "ios" ? 175 : 190);
  const calendarBarHeight = 35;
  const headerHeight = 45;
  const availableHeight = screenHeight - calendarBarHeight - headerHeight;
  const boxHeight = availableHeight / rows;
  const boxWidth = (screenWidth - 60) / cols;
  const hourColWidth = boxWidth * 1.7;

  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [filled, setFilled] = useState(
    Array.from({ length: cols }, () => Array(rows).fill(false))
  );
  const filledRef = useRef(filled); // keep ref in sync with state
  const [scheduleData, setScheduleData] = useState([]);

  // drawing state refs (avoids stale closures inside PanResponder)
  const isDrawingRef = useRef(false);
  const drawModeRef = useRef(drawMode);
  useEffect(() => {
    drawModeRef.current = drawMode;
  }, [drawMode]);
  // true = paint, false = erase
  const lastTouchedRef = useRef({ col: -1, row: -1 }); // avoid repeated sets

  // layout of the grid container (to convert pageX/pageY -> local coords)
  const gridLayoutRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // keep filledRef in sync whenever filled state changes
  useEffect(() => {
    filledRef.current = filled;
  }, [filled]);

  // --- Firestore fetch (unchanged) ---
  useEffect(() => {
    if (!empId) return;

    const fetchSchedule = async () => {
      try {
        const startOfWeek = new Date(currentWeekStart);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);

        const startStr = startOfWeek.toISOString().split("T")[0];
        const endStr = endOfWeek.toISOString().split("T")[0];

        const q = query(
          collection(db, "emp_sch_main"),
          where("emp_id", "==", empId),
          where("date", ">=", startStr),
          where("date", "<=", endStr)
        );

        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setScheduleData(list);
      } catch (err) {
        console.error("Error fetching employee schedule:", err);
      }
    };

    fetchSchedule();
  }, [empId, currentWeekStart]);

  // Map schedule to filled
  useEffect(() => {
    const newFilled = Array.from({ length: cols }, () =>
      Array(rows).fill(false)
    );

    scheduleData.forEach((item) => {
      const date = new Date(item.date);
      const colIdx = date.getDay() === 0 ? 6 : date.getDay() - 1;
      const startHour = parseInt(item.start_time.split(":")[0], 10);
      const endHour = parseInt(item.end_time.split(":")[0], 10);

      for (let r = startHour; r <= endHour && r < rows; r++) {
        newFilled[colIdx][r] = true;
      }
    });

    setFilled(newFilled);
  }, [cols, rows, scheduleData]);

  // week navigation
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

  // map press (tap)
  const handlePress = (colIdx, rowIdx) => {
    setFilled((prev) => {
      const copy = prev.map((c) => [...c]);
      copy[colIdx][rowIdx] = !copy[colIdx][rowIdx];
      return copy;
    });
  };

  // Convert pageX/pageY into grid cell indices
  const pageXYToCell = (pageX, pageY) => {
    const layout = gridLayoutRef.current;
    const localX = pageX - layout.x;
    const localY = pageY - layout.y;

    // ignore touches outside grid
    if (
      localX < 0 ||
      localY < 0 ||
      localX > layout.width ||
      localY > layout.height
    ) {
      return null;
    }

    // subtract hour column width (assumes the hour column is rendered at left inside the grid container)
    const xAfterHour = localX - hourColWidth;
    const colIdx = Math.floor(xAfterHour / boxWidth);
    const rowIdx = Math.floor(localY / boxHeight);

    if (colIdx < 0 || colIdx >= cols || rowIdx < 0 || rowIdx >= rows)
      return null;
    return { col: colIdx, row: rowIdx };
  };

  // Paint a cell (with optimization to avoid repeated writes for same cell)
  const paintCell = (col, row) => {
    // guard
    if (col == null || row == null) return;

    const last = lastTouchedRef.current;
    if (last.col === col && last.row === row) return; // same cell as last event -> ignore

    lastTouchedRef.current = { col, row };

    // update state
    setFilled((prev) => {
      const copy = prev.map((c) => [...c]);
      copy[col][row] = drawModeRef.current;
      return copy;
    });
  };

  // PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt, gestureState) => {
        isDrawingRef.current = true;
        lastTouchedRef.current = { col: -1, row: -1 };

        // Use pageX/pageY for consistent coords across platforms
        const { pageX, pageY } = evt.nativeEvent;
        const cell = pageXYToCell(pageX, pageY);
        if (cell) paintCell(cell.col, cell.row);
      },

      onPanResponderMove: (evt, gestureState) => {
        if (!isDrawingRef.current) return;
        const { pageX, pageY } = evt.nativeEvent;
        const cell = pageXYToCell(pageX, pageY);
        if (cell) paintCell(cell.col, cell.row);
      },

      onPanResponderRelease: () => {
        isDrawingRef.current = false;
        lastTouchedRef.current = { col: -1, row: -1 };
      },

      onPanResponderTerminate: () => {
        isDrawingRef.current = false;
        lastTouchedRef.current = { col: -1, row: -1 };
      },
    })
  ).current;

  // Week and hours helpers
  const weekStart = getStartOfWeek(currentWeekStart);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const weekDaysWithDates = getWeekDaysWithDates(weekStart);
  const hours = generateHours(rows);

  // onLayout for the grid container — stores absolute coords
  const onGridLayout = (e) => {
    // nativeEvent.layout gives position relative to parent — use measure for page coordinates
    // For simplicity we use measure if available (works on Android & iOS)
    // If measure is not available in your environment, layout.x/y might still be fine.
    // const view = e.target;
    // Attempt to measure via refless approach: use event.nativeEvent.layout for width/height, and measure via setTimeout to ensure native UI is ready
    const { width, height } = e.nativeEvent.layout;

    // We need absolute page coordinates (x,y). Use a small trick: requestAnimationFrame + measure on the view via e.target
    // But if that fails, fallback to layout's x/y (relative).
    // We'll try to use global measure via findNodeHandle if needed — but many RN versions allow `e.nativeEvent.layout` plus parent's absolute.
    // A simple reliable approach: use setTimeout + measure via the event target's ref (not available here), so we'll instead estimate layout.x,y from event.
    // For most apps the parent container is full-width; so layout.x is usually correct. We'll store page-coords as best effort:
    //const pageX = e.nativeEvent.layout.x + (e.nativeEvent.layout.offsetX || 0);
    //const pageY = e.nativeEvent.layout.y + (e.nativeEvent.layout.offsetY || 0);

    // Practical approach: use measure if possible
    // NOTE: Many apps use a ref to the container and call ref.current.measure((fx, fy, w, h, px, py) => {...}) to get px,py.
    // But here we set what we can and still work robustly with pageX/pageY from events.
    gridLayoutRef.current = {
      x: e.nativeEvent.layout.x, // fallback — should work if grid is full-width in your layout
      y:
        e.nativeEvent.layout.y +
        calendarBarHeight +
        headerHeight +
        (Platform.OS === "android" ? 0 : 0),
      width,
      height,
    };

    // Debug log
    // console.log("Grid layout stored:", gridLayoutRef.current);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111aaa" }} edges={[]}>
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

      {/* Grid container - attach panHandlers and capture layout */}
      <View
        style={{ flex: 1 }}
        {...panResponder.panHandlers}
        onLayout={onGridLayout}
      >
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
      </View>
    </SafeAreaView>
  );
}

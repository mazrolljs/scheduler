import React from "react";
import { Dimensions, View, PanResponder, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import {
  getStartOfWeek,
  getWeekDaysWithDates,
  generateHours,
} from "../../utils/utils";
import { Colors } from "../constants/colors";
import CalendarBar from "./CalendarBar";
import HeaderRow from "./HeaderRow";
import GridRow from "./GridRow";

export default class CalendarGrid extends React.Component {
  constructor(props) {
    super(props);
    const { rows = 24, cols = 7 } = props;
    this.state = {
      currentWeekStart: new Date(),
      filled: Array.from({ length: cols }, () => Array(rows).fill(false)),
      scheduleData: [],
    };

    // drawing state refs (avoids stale closures inside PanResponder)
    this.isDrawingRef = { current: false };
    this.drawModeRef = { current: props.drawMode || true };
    this.lastTouchedRef = { current: { col: -1, row: -1 } };
    this.gridLayoutRef = { current: { x: 0, y: 0, width: 0, height: 0 } };
  }

  componentDidMount() {
    this.fetchSchedule();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.drawMode !== this.props.drawMode) {
      this.drawModeRef.current = this.props.drawMode;
    }
    if (prevState.scheduleData !== this.state.scheduleData) {
      this.mapScheduleToFilled();
    }
    if (
      prevState.currentWeekStart !== this.state.currentWeekStart ||
      prevProps.empId !== this.props.empId
    ) {
      this.fetchSchedule();
    }
  }
  // --- Firestore fetch (unchanged) ---
  fetchSchedule = async () => {
    const { empId } = this.props;
    if (!empId) return;

    try {
      const startOfWeek = new Date(this.state.currentWeekStart);
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

      this.setState({ scheduleData: list });
    } catch (err) {
      console.error("Error fetching employee schedule:", err);
    }
  };

  // Map schedule to filled
  mapScheduleToFilled = () => {
    const { cols, rows } = this.props;
    const newFilled = Array.from({ length: cols }, () =>
      Array(rows).fill(false)
    );

    this.state.scheduleData.forEach((item) => {
      const date = new Date(item.date);
      const colIdx = date.getDay() === 0 ? 6 : date.getDay() - 1;
      const startHour = parseInt(item.start_time.split(":")[0], 10);
      const endHour = parseInt(item.end_time.split(":")[0], 10);

      for (let r = startHour; r <= endHour && r < rows; r++) {
        newFilled[colIdx][r] = true;
      }
    });

    this.setState({ filled: newFilled });
  };

  // week navigation
  prevWeek = () => {
    const prev = new Date(this.state.currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    this.setState({ currentWeekStart: prev });
  };

  nextWeek = () => {
    const next = new Date(this.state.currentWeekStart);
    next.setDate(next.getDate() + 7);
    this.setState({ currentWeekStart: next });
  };

  // map press (tap)
  handlePress = (colIdx, rowIdx) => {
    this.setState((prevState) => {
      const copy = prevState.filled.map((c) => [...c]);
      copy[colIdx][rowIdx] = !copy[colIdx][rowIdx];
      return { filled: copy };
    });
  };

  // Convert pageX/pageY into grid cell indices
  pageXYToCell = (pageX, pageY) => {
    const { cols, rows } = this.props;
    const layout = this.gridLayoutRef.current;
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
    const xAfterHour = localX - this.hourColWidth;
    const colIdx = Math.floor(xAfterHour / this.boxWidth);
    const rowIdx = Math.floor(localY / this.boxHeight);

    if (colIdx < 0 || colIdx >= cols || rowIdx < 0 || rowIdx >= rows)
      return null;
    return { col: colIdx, row: rowIdx };
  };

  // Paint a cell (with optimization to avoid repeated writes for same cell)
  paintCell = (col, row) => {
    // guard
    if (col == null || row == null) return;

    const last = this.lastTouchedRef.current;
    if (last.col === col && last.row === row) return; // same cell as last event -> ignore

    this.lastTouchedRef.current = { col, row };

    // update state
    this.setState((prevState) => {
      const copy = prevState.filled.map((c) => [...c]);
      copy[col][row] = this.drawModeRef.current;
      return { filled: copy };
    });
  };

  // PanResponder
  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (evt, gestureState) => {
      this.isDrawingRef.current = true;
      this.lastTouchedRef.current = { col: -1, row: -1 };

      // Use pageX/pageY for consistent coords across platforms
      const { pageX, pageY } = evt.nativeEvent;
      const cell = this.pageXYToCell(pageX, pageY);
      if (cell) this.paintCell(cell.col, cell.row);
    },

    onPanResponderMove: (evt, gestureState) => {
      if (!this.isDrawingRef.current) return;
      const { pageX, pageY } = evt.nativeEvent;
      const cell = this.pageXYToCell(pageX, pageY);
      if (cell) this.paintCell(cell.col, cell.row);
    },

    onPanResponderRelease: () => {
      this.isDrawingRef.current = false;
      this.lastTouchedRef.current = { col: -1, row: -1 };
    },

    onPanResponderTerminate: () => {
      this.isDrawingRef.current = false;
      this.lastTouchedRef.current = { col: -1, row: -1 };
    },
  });

  // onLayout for the grid container — stores absolute coords
  onGridLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    this.gridLayoutRef.current = {
      x: e.nativeEvent.layout.x, // fallback — should work if grid is full-width in your layout
      y:
        e.nativeEvent.layout.y +
        this.calendarBarHeight +
        this.headerHeight +
        (Platform.OS === "android" ? 0 : 0),
      width,
      height,
    };
  };

  render() {
    const { rows = 24, cols = 7, gap = 0 } = this.props;
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

    // Assign to instance for use in methods
    this.calendarBarHeight = calendarBarHeight;
    this.headerHeight = headerHeight;
    this.boxHeight = boxHeight;
    this.boxWidth = boxWidth;
    this.hourColWidth = hourColWidth;

    // Week and hours helpers
    const weekStart = getStartOfWeek(this.state.currentWeekStart);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const weekDaysWithDates = getWeekDaysWithDates(weekStart);
    const hours = generateHours(rows);

    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.dark.background }}
        edges={[]}
      >
        <CalendarBar
          weekStart={weekStart}
          weekEnd={weekEnd}
          prevWeek={this.prevWeek}
          nextWeek={this.nextWeek}
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
          {...this.panResponder.panHandlers}
          onLayout={this.onGridLayout}
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
              filled={this.state.filled}
              handlePress={this.handlePress}
            />
          ))}
        </View>
      </SafeAreaView>
    );
  }
}

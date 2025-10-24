// Common utility functions for the app

// Generate 15-min interval times
export const generateTimeOptions = () => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = h.toString().padStart(2, "0");
      const minute = m.toString().padStart(2, "0");
      options.push(`${hour}:${minute}`);
    }
  }
  return options;
};

// Date input handler (manual typing)
export const handleDateInput = (text, setDate) => {
  const parts = text.split("-");
  if (parts.length >= 2) {
    let day = parts[0];
    let month = parts[1];
    let year = parts[2] || new Date().getFullYear();
    if (year.length === 2) year = "20" + year;
    const parsed = new Date(`${year}-${month}-${day}`);
    if (!isNaN(parsed)) setDate(parsed);
  }
};

// Start time change → auto +8 hours
export const handleStartTimeChange = (val, setStartTime, setEndTime) => {
  setStartTime(val);
  const [h, m] = val.split(":").map(Number);
  let endHour = (h + 8) % 24;
  setEndTime(
    `${endHour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
  );
};

// End time change
export const handleEndTimeChange = (val, setEndTime) => {
  setEndTime(val);
};

// Generate next employee ID
export const generateNextEmpId = async (db) => {
  const {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
  } = require("firebase/firestore");
  const q = query(collection(db, "users"), orderBy("emp_id", "desc"), limit(1));

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    console.log("No existing employees found. Starting with EMP-001");
    return "emp_001";
  }

  const lastId = snapshot.docs[0].data().emp_id;

  // Validate the lastId format before parsing
  const match = lastId && lastId.match(/^emp_(\d+)$/);
  if (!match) {
    // If the format is wrong, fallback to EMP-001 or handle gracefully
    console.warn("⚠️ Invalid emp_id format found:", lastId);
    return "emp_001";
  }

  const num = parseInt(match[1], 10) + 1;
  return `emp_${num.toString().padStart(3, "0")}`;
};

// Calendar utility functions
export const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export const formatDateRange = (date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const getWeekDaysWithDates = (weekStart) =>
  Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

export const generateHours = (rows) =>
  Array.from({ length: rows }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

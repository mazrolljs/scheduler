// Reusable functions
export const fetchEmployees = async () => {
  const { collection, getDocs } = await import("firebase/firestore");
  const { db } = await import("../../services/firebaseConfig");
  const empSnap = await getDocs(collection(db, "users"));
  return empSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const fetchLocations = async () => {
  const { collection, getDocs } = await import("firebase/firestore");
  const { db } = await import("../../services/firebaseConfig");
  const locSnap = await getDocs(collection(db, "location"));
  return locSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

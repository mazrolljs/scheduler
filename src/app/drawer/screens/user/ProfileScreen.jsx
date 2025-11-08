import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../../../context/AuthContext";

export default function ProfileScreen() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text>No user data available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image
            source={{
              uri:
                user.profileImage ||
                "https://i.ibb.co/vxbfSSv5/f6e90bbfdf38.jpg",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>
            {user.firstName} {user.familyName}
          </Text>
          <Text style={styles.role}>{user.role || "N/A"}</Text>
        </View>

        {/* Info Section */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <InfoRow label="Email" value={user.email || "N/A"} />
          <InfoRow label="Date of Birth" value={user.dob || "N/A"} />
          <InfoRow label="Citizenship" value={user.citizenship || "N/A"} />

          {user.citizenship !== "Australian" && (
            <>
              <InfoRow label="Visa Type" value={user.visa || "N/A"} />
              <InfoRow label="Visa Expiry" value={user.visa_expire || "N/A"} />
            </>
          )}

          <InfoRow label="Employee ID" value={user.emp_id || "N/A"} />
          <InfoRow label="Role" value={user.role || "N/A"} />
        </View>

        {/* House Inducted List */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>House Inducted</Text>
          {user.inductedHouses && user.inductedHouses.length > 0 ? (
            <FlatList
              data={user.inductedHouses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text style={styles.listTitle}>{item.name}</Text>
                  <Text style={styles.listDate}>Joined: {item.date}</Text>
                </View>
              )}
            />
          ) : (
            <Text style={styles.emptyText}>No house inducted yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable info row
function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value || "N/A"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9ff",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#ffb703",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  role: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },
  infoValue: {
    fontSize: 15,
    color: "#1f2937",
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  listDate: {
    fontSize: 14,
    color: "#6b7280",
  },
  emptyText: {
    color: "#9ca3af",
    fontStyle: "italic",
  },
});

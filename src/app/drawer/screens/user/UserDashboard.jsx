import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../../../context/AuthContext";
import { globalStyles } from "../../../../assets/constants/styles";

import { fetchInductedHouses } from "../../../../assets/constants/functions";

export default function UserDashboardScreen() {
  const { user, loading } = useUser();
  const [inductedHouses, setInductedHouses] = useState([]);

  useEffect(() => {
    if (user?.emp_id) {
      fetchInductedHouses(user.emp_id).then(setInductedHouses);
    }
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={globalStyles.loading}>
          <Text style={globalStyles.text}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={globalStyles.loading}>
          <Text style={globalStyles.text}>No user data available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        {/* Profile Header */}
        <View style={globalStyles.header}>
          <Image
            source={{
              uri:
                user.profileImage ||
                "https://i.ibb.co/vxbfSSv5/f6e90bbfdf38.jpg",
            }}
            style={globalStyles.avatar}
          />
          <Text style={globalStyles.title}>
            {user.firstName} {user.familyName}
          </Text>
          <Text style={globalStyles.subtitle}>{user.role || "N/A"}</Text>
        </View>

        {/* Info Section */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Personal Information</Text>
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
        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>House Inducted</Text>
          {inductedHouses && inductedHouses.length > 0 ? (
            <FlatList
              data={inductedHouses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={globalStyles.listItem}>
                  <Text style={globalStyles.listTitle}>{item.name}</Text>
                  <Text style={globalStyles.listDate}>Joined: {item.date}</Text>
                </View>
              )}
            />
          ) : (
            <Text style={globalStyles.emptyText}>No house inducted yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable info row
function InfoRow({ label, value }) {
  return (
    <View style={globalStyles.infoRow}>
      <Text style={globalStyles.infoLabel}>{label}:</Text>
      <Text style={globalStyles.infoValue}>{value || "N/A"}</Text>
    </View>
  );
}

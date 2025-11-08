import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  limit,
  query,
} from "firebase/firestore";
import { db } from "../../../../services/firebaseConfig";

export default class HistoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: false,
      name: "",
      email: "",
    };
  }

  // ✅ Fetch users from Firestore
  getUsers = async () => {
    this.setState({ loading: true });
    try {
      const q = query(
        collection(db, "users"),
        orderBy("name", "asc"),
        limit(50)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        this.setState({ users: [] });
        Alert.alert("No data", "No users found in Firestore.");
        return;
      }
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      this.setState({ users: list });
      console.log("Fetched users:", list);
    } catch (error) {
      console.error("Error fetching users:", error);
      Alert.alert("Error", "Failed to fetch users.");
    } finally {
      this.setState({ loading: false });
    }
  };

  // ✅ Add user to Firestore
  addUser = async () => {
    console.log("Connected project:", db.app.options.projectId);

    if (!this.state.name.trim() || !this.state.email.trim()) {
      Alert.alert("Missing Info", "Please enter both name and email.");
      return;
    }

    try {
      await addDoc(collection(db, "users"), {
        name: this.state.name.trim(),
        email: this.state.email.trim(),
        createdAt: new Date(),
      });
      Alert.alert("Success", "User added successfully!");
      this.setState({ name: "", email: "" });
      this.getUsers(); // Refresh list
    } catch (error) {
      console.error("Error adding user:", error);
      Alert.alert("Error", "Failed to add user.");
    }
  };

  handleNameChange = (text) => {
    this.setState({ name: text });
  };

  handleEmailChange = (text) => {
    this.setState({ email: text });
  };

  render() {
    const { users, loading, name, email } = this.state;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
          Firestore Users
        </Text>

        {/* Add User Form */}
        <View style={{ marginBottom: 16 }}>
          <TextInput
            value={name}
            onChangeText={this.handleNameChange}
            placeholder="Enter name"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 10,
              marginBottom: 8,
            }}
          />
          <TextInput
            value={email}
            onChangeText={this.handleEmailChange}
            placeholder="Enter email"
            keyboardType="email-address"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 10,
              marginBottom: 8,
            }}
          />
          <TouchableOpacity
            onPress={this.addUser}
            style={{
              backgroundColor: "#10B981",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Add User
            </Text>
          </TouchableOpacity>
        </View>

        {/* Fetch Users Button */}
        <TouchableOpacity
          onPress={this.getUsers}
          style={{
            backgroundColor: "#3B82F6",
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
          >
            {loading ? "Loading..." : "Get Users"}
          </Text>
        </TouchableOpacity>

        {/* Display Users */}
        <ScrollView>
          {users.length > 0 ? (
            users.map((user) => (
              <View
                key={user.id}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#E5E7EB",
                  paddingVertical: 8,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  {user.name || "No Name"}
                </Text>
                <Text style={{ fontSize: 14, color: "#6B7280" }}>
                  {user.email || "No Email"}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ color: "#9CA3AF", fontSize: 14 }}>
              {loading ? "Loading..." : "No users loaded yet."}
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabLayout from "./(tabs)/TabLayout";
import ProfileScreen from "./screens/user/ProfileScreen";
import SettingsScreen from "./screens/shared/SettingsScreen";
import AdminDashboard from "./screens/admin/AdminDashboard";
import OfferedShift from "./screens/user/OfferedShiftScreen";
import ShiftSharingScreen from "./screens/shared/SharedScreen";
import HeaderButton from "../../assets/components/HeaderButton";
import Index from "../index"; // your logout or landing screen
import { useUser } from "../../context/AuthContext";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { role } = useUser();

  console.log("📄 createDrawerNavigator data:", role);
  const baseScreens = [
    { name: "My Profile", component: ProfileScreen },
    { name: "Settings", component: SettingsScreen },
    { name: "Log Out", component: Index },
  ];

  const adminScreens = [
    ...baseScreens,
    { name: "Shift Offered", component: OfferedShift },
    { name: "Shift Shared", component: ShiftSharingScreen },
    { name: "Admin Approval", component: AdminDashboard },
  ];

  if (role === "admin") {
    console.log("🛠️ Admin screens loaded");
  } else {
    console.log("🛠️ Base screens loaded");
  }

  const screens = role === "admin" ? adminScreens : baseScreens;

  return (
    <Drawer.Navigator
      initialRouteName="HomeTabs"
      screenOptions={{ headerShown: true }}
    >
      {/* Tabs as main content */}
      <Drawer.Screen
        name="HomeTabs"
        component={TabLayout}
        options={{
          title: "Dashboard",
          headerRight: () => <HeaderButton />,
        }}
      />

      {/* Drawer-only screens based on role */}
      {screens.map((screen) => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </Drawer.Navigator>
  );
}

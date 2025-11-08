import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabLayout from "./(tabs)/TabLayout";
import ProfileScreen from "./screens/user/ProfileScreen";
import SettingsScreen from "./screens/shared/SettingsScreen";
import AdminDashboard from "./screens/admin/AdminDashboard";
import OfferedShift from "./screens/user/OfferedShiftScreen";
import ShiftSharingScreen from "./screens/shared/SharedScreen";
import HeaderButton from "../../assets/components/HeaderButton";
import Index from "../index"; // logout or landing screen
import { useUser } from "../../context/AuthContext";
import { Colors } from "../../assets/constants/colors";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { role } = useUser();

  console.log("📄 DrawerNavigator role:", role);

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

  const screens = role === "admin" ? adminScreens : baseScreens;

  return (
    <Drawer.Navigator
      initialRouteName="HomeTabs"
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: Colors.Pcalight.background, // the whole drawer background
        },
        drawerActiveTintColor: Colors.Pcalight.background, // selected item text oricon color change
        drawerInactiveTintColor: Colors.Pcalight.text, // unselected item text oricon color change
        drawerActiveBackgroundColor: Colors.Pcalight.backgroundLight, // selected active item background
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "500",
        },
      }}
    >
      {/* Tabs as main dashboard */}
      <Drawer.Screen
        name="HomeTabs"
        component={TabLayout}
        options={{
          title: "Dashboard",
          headerRight: () => <HeaderButton />,
        }}
      />

      {/* Role-based drawer screens */}
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

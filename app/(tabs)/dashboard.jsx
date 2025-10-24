import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainNavigator from "./MainNavigator";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AdminScreen from "../screens/AdminScreen";
import OfferedShift from "../screens/OfferedShiftScreen";
import ShiftSharingScreen from "../screens/SharedScreen";
import ScheduleScreen from "./ScheduleScreen";
import Index from "../index";
//import HistoryScreen from "../screens/HistoryScreen";

const Profile = ProfileScreen;

const Drawer = createDrawerNavigator();

export default function Dashboard() {
  return (
    <Drawer.Navigator
      initialRouteName="My Shifts"
      screenOptions={{ headerShown: true }}
    >
      <Drawer.Screen name="My Profile" component={Profile} />
      <Drawer.Screen name="My Shifts" component={MainNavigator} />
      <Drawer.Screen name="ScheduleScreen" component={ScheduleScreen} />
      <Drawer.Screen name="Shift Offered" component={OfferedShift} />
      <Drawer.Screen name="Shift Shared" component={ShiftSharingScreen} />
      {/*  <Drawer.Screen name="History" component={HistoryScreen} />*/}
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Admin Approval" component={AdminScreen} />
      <Drawer.Screen name="Log Out" component={Index} />
    </Drawer.Navigator>
  );
}

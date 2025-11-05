# Project Reorganization Plan to Fix UI Styles

## Completed Steps

- [ ] Move global.css from root to src/global.css
- [ ] Update metro.config.js input to "./src/global.css"
- [ ] Update src/app/\_layout.jsx import to "../global.css"
- [ ] Update tailwind.config.js content to ["./src/**/*.{js,jsx,ts,tsx}"]
- [ ] Move src/app/AppNavigator.jsx to src/app/drawer/DrawerNavigator.jsx and update for role-based rendering
- [ ] Move src/app/(drawer)/(tabs)/ contents to src/app/drawer/(tabs)/ (rename MainNavigator.js to .jsx)
- [ ] Organize screens: Ensure src/app/drawer/screens/shared/ has HistoryScreen.jsx, SettingsScreen.jsx, SharedScreen.jsx, OfferedShiftScreen.jsx, ProfileScreen.jsx
- [ ] Move src/app/drawer/screens/admin/AdminScreen.jsx to AdminDashboard.jsx
- [ ] Create src/app/drawer/screens/admin/UserManagement.jsx and ReportsScreen.jsx (placeholders)
- [ ] Create src/app/drawer/screens/user/UserDashboard.jsx, copy ProfileScreen.jsx and OfferedShiftScreen.jsx from shared
- [ ] Reorganize src/assets/images/ into app-icons/, logos/, keep mycollection/
- [ ] Ensure src/assets/Colors.js, utils.js, create constants/roles.js
- [ ] Rename src/context/UserContext.jsx to AuthContext.jsx, create ThemeContext.jsx, RoleContext.jsx
- [ ] Create src/hooks/useAuth.js, useUserRole.js, useFirestoreData.js
- [ ] Ensure src/services/firebaseConfig.js, create authService.js, userService.js, roleService.js
- [ ] Distribute src/assets/utils.js content to src/utils/formatDate.js, etc., create validationSchema.js, notification.js
- [ ] Update all import statements in affected files to reflect new paths
- [ ] Create placeholder files with basic structure
- [ ] Clear Metro cache and restart the app
- [ ] Test UI to verify styles are applied

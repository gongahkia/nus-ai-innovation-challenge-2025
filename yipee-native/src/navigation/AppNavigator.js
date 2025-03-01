import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import InventoryScreen from '../screens/InventoryScreen';
import ScannerScreen from '../screens/ScannerScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const DashboardTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Inventory" component={InventoryScreen} />
    <Tab.Screen name="Scanner" component={ScannerScreen} />
    <Tab.Screen name="Analytics" component={AnalyticsScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainDashboard" component={DashboardTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
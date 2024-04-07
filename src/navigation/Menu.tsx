import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from '../screens/Register';
import LoginScreen from '../screens/Login';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default () => {
  const transitionPresets = Platform.OS === "android" ? TransitionPresets.FadeFromBottomAndroid : {};


  return (
    <Stack.Navigator>
      <Stack.Screen name={"LoginScreen"} component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name={"RegistrationScreen"} component={RegistrationScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

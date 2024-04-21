import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from '../screens/Auth';
import { useAuth } from '../hooks/useAuth';
import HomeScreen from '../screens/Home';
import NameAndPhoneScreen from '../screens/journey/NameAndPhone';
import ImagesScreen from '../screens/journey/Images';
import OffersScreen from '../screens/journey/Offers';
import WorkingHoursScreen from '../screens/journey/WorkingHours';
import BookingInfoScreen from '../screens/BookingInfo';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function General() {
  return (
    <Tab.Navigator>
      <Tab.Screen name={"Dashboard"} component={HomeScreen} />
      <Tab.Screen name={"Calendar"} component={HomeScreen} />
      <Tab.Screen name={"Profile"} component={HomeScreen} />
    </Tab.Navigator>
  );
}

export default () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Stack.Navigator>
        <Stack.Screen name={"Auth"} component={AuthScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Group>
        {!user.first_time_journey_finished && (
          <Stack.Screen name={"General"} component={General} options={{ headerShown: false }} />
        )}
        <Stack.Screen name={"JourneyNameAndPhone"} component={NameAndPhoneScreen} options={{ headerShown: false }} />
        <Stack.Screen name={"JourneyImages"} component={ImagesScreen} options={{ headerShown: false }} />
        <Stack.Screen name={"JourneyOffers"} component={OffersScreen} options={{ headerShown: false }} />
        <Stack.Screen name={"WorkingHours"} component={WorkingHoursScreen} options={{ headerShown: false }} />
        {user.first_time_journey_finished && (
          <Stack.Screen name={"General"} component={General} options={{ headerShown: false }} />
        )}
        <Stack.Screen name={"BookingInfo"} component={BookingInfoScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

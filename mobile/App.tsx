import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as Notifications from 'expo-notifications';
import { ActivityIndicator, View, Text } from 'react-native';

// Screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CoursesScreen from './screens/CoursesScreen';
import LessonsScreen from './screens/LessonsScreen';
import PracticeTestsScreen from './screens/PracticeTestsScreen';
import ProgressScreen from './screens/ProgressScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function CoursesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CoursesList" component={CoursesScreen} options={{ title: 'My Courses' }} />
      <Stack.Screen name="Lessons" component={LessonsScreen} options={{ title: 'Lessons' }} />
    </Stack.Navigator>
  );
}

function PracticeTestsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TestsList" component={PracticeTestsScreen} options={{ title: 'Practice Tests' }} />
    </Stack.Navigator>
  );
}

function HomeTabs() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      {!isOnline && (
        <View style={{ backgroundColor: '#fbbf24', padding: 8, alignItems: 'center' }}>
          <Text style={{ color: '#000', fontSize: 12, fontWeight: '500' }}>
            You're offline - some features may be limited
          </Text>
        </View>
      )}
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: '#1e40af',
          tabBarInactiveTintColor: '#9ca3af',
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
          }}
        />
        <Tab.Screen
          name="CoursesStack"
          component={CoursesStack}
          options={{
            title: 'Courses',
            tabBarLabel: 'Courses',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📚</Text>,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="PracticeTestsStack"
          component={PracticeTestsStack}
          options={{
            title: 'Practice Tests',
            tabBarLabel: 'Tests',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>✅</Text>,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Progress"
          component={ProgressScreen}
          options={{
            title: 'Progress',
            tabBarLabel: 'Progress',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📊</Text>,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⚙️</Text>,
          }}
        />
      </Tab.Navigator>
    </>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Check if user is logged in
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);

        // Register for push notifications
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Notification permission denied');
        }

        // Set up notification listener
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
          console.log('Notification tapped:', response);
          // Handle notification tap
        });

        return () => subscription.remove();
      } catch (e) {
        console.error('Error during app initialization:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="HomeTabs" component={HomeTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

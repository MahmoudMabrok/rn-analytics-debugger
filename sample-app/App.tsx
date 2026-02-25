import 'react-native-screens';
import { enableScreens } from 'react-native-screens';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AnalyticsDebugger, AnalyticsDebuggerDialog } from '@mo3ta-dev/rn-analytics-debugger';
import { HomeScreen } from './src/screens/HomeScreen';
import { DetailsScreen } from './src/screens/DetailsScreen';

// Must be called before any navigation renders
enableScreens();

export type RootStackParamList = {
    Home: undefined;
    Details: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    const [debuggerVisible, setDebuggerVisible] = useState(false);

    useEffect(() => {
        AnalyticsDebugger.getInstance().init({
            enabled: true,
            desktopSync: true,
            desktopIp: '192.168.1.6', // Update this to your machine's IP
            desktopPort: 8080,
        });
    }, []);

    return (
        <>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen
                        name="Home"
                        component={() => (
                            <HomeScreen
                                onOpenDebugger={() => setDebuggerVisible(true)}
                            />
                        )}
                        options={{ title: 'SDK Debugger Demo' }}
                    />
                    <Stack.Screen
                        name="Details"
                        component={DetailsScreen}
                    />
                </Stack.Navigator>
            </NavigationContainer>

            {
                debuggerVisible && <AnalyticsDebuggerDialog
                    onClose={() => setDebuggerVisible(false)}
                />
            }

        </>
    );
}

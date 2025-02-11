import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {

    return (
        <Tabs>
            <Tabs.Screen name="camera" options={{ headerShown: false }} />
        </Tabs>
    );
}

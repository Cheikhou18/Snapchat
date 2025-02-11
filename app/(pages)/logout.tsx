import React from 'react';
import storage from "@/storage";
import { useRouter } from 'expo-router';
import { Text, View, Pressable, StyleSheet } from 'react-native';

export default function Logout() {
    const router = useRouter();

    function logout() {
        storage.remove({ key: "user" });
        return router.replace('/login');
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={() => logout()} style={styles.button}>
                <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
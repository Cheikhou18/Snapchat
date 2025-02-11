import { API_TOKEN } from "@env";
import storage from '@/storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, TextInput, Text, Pressable, TouchableOpacity, View, Alert } from 'react-native';

export default function Login() {
    const router = useRouter();
    const [email, setLogin] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [message, setMessage] = useState<string>();

    function SignIn() {
        if (email && password) {
            fetch("https://snapchat.epidoc.eu/user",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1heC5jaGVuQGVwaXRlY2guZXUiLCJpYXQiOjE3MTgwMDU2Njl9.gCrurHi_lFsio-OitSCBZbGt-PL_hTI5XJVb4-TnE0M"
                    },
                    body: JSON.stringify({ email, password }),
                }
            )
                .then(async (response) => {
                    const result = await response.json();

                    if (response.status === 200) {
                        storage.save({ key: 'user', data: result.data })
                        return router.replace('/camera');
                    }

                    setMessage(result.data);
                })
                .catch((err) => {
                    return setMessage(err.response.data);
                })
        }

        setMessage('Please fill all the fields');
    }

    return (
        <SafeAreaView>
            <Text>Login</Text>
            <TextInput
                placeholder="cheikhou@example.com"
                placeholderTextColor="gray"
                onChangeText={(e) => setLogin(e)}
                value={email}
            />
            <Text>Password</Text>
            <TextInput
                onChangeText={(e) => setPassword(e)}
                value={password}
                secureTextEntry
                placeholder="*********"
                placeholderTextColor="gray"
            />

            {message ? <Text>{message}</Text> : ""}

            <Pressable onPress={() => SignIn()}>
                <Text>Sign in</Text>
            </Pressable>

            <TouchableOpacity>
                <Text>Don't have account ? Sign up</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
};
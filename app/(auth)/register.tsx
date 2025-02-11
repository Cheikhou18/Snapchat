import storage from "@/storage";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function Register() {
    const router = useRouter();
    const API_TOKEN = process.env.API_TOKEN;
    const [message, setMessage] = useState<String>();
    const [form, setForm] = useState({ username: String, email: String, password: String, profilePicture: String });
    function handleLogin() {
        if (form.email === null || form.username === null || form.password === null) {
            return setMessage('Please fill all the fields');
        }

        fetch("https://snapchat.epidoc.eu/user",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1heC5jaGVuQGVwaXRlY2guZXUiLCJpYXQiOjE3MTgwMDU2Njl9.gCrurHi_lFsio-OitSCBZbGt-PL_hTI5XJVb4-TnE0M"
                },
                body: JSON.stringify({ ...form })
            }
        )
            .then(async (response) => {
                const result = await response.json();

                if (response.status === 200) {
                    storage.save({ key: 'user', data: await response.json() })
                    return router.replace('/camera');
                }

                setMessage(result.data);
            })
            .catch((err) => {
                setMessage(err.response.data)
            })
    }

    return (
        <View className="flex-1 justify-center h-screen bg-yellow p-12">
            <View className="gap-3">
                <TextInput placeholder="Username" className="border px-5 py-3 rounded" placeholderTextColor={"black"} onChangeText={(text) => { setForm({ ...form, username: text }) }} />
                <TextInput placeholder="Email" className="border px-5 py-3 rounded" placeholderTextColor={"black"} onChangeText={(text) => { setForm({ ...form, email: text }) }} />
                <TextInput placeholder="Password" className="border px-5 py-3 rounded" placeholderTextColor={"black"} onChangeText={(text) => { setForm({ ...form, password: text }) }} secureTextEntry />

                <Pressable className="items-center border px-4 py-2 rounded-full bg-blue" onPress={() => handleLogin()}>
                    <Text>Sign In</Text>
                </Pressable>

                {message ? <Text>{message}</Text> : ""}
            </View>
        </View>
    );
}

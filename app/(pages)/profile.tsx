import axios from "axios";
import storage from "@/storage";
import { UserType } from "@/types/User";
import { useRouter } from "expo-router";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useState } from "react";

export default function friendsList() {
    const router = useRouter();
    const [message, setMessage] = useState<string>();
    const [currentUser, setCurrentUser] = useState<UserType>();
    const [updatedUser, setUpdatedUser] = useState<UserType>();

    storage
        .load({ key: 'user' })
        .then((user: UserType) => {
            setCurrentUser(user);
            setUpdatedUser(user);
        })
        .catch(() => router.replace('/login'));

    function modifyUser() {
        if (updatedUser.email === undefined || updatedUser.username === undefined, updatedUser.password === undefined) {
            return setMessage('Please fill all the fields');
        }

        fetch('https://snapchat.epidoc.eu/user',
            {
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + currentUser.token,
                    "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1heC5jaGVuQGVwaXRlY2guZXUiLCJpYXQiOjE3MTgwMDU2Njl9.gCrurHi_lFsio-OitSCBZbGt-PL_hTI5XJVb4-TnE0M"
                }
            })
            .then(() => setMessage('Data updated successfully.'))
            .catch(() => setMessage('An error occurred during the update.'));
    }

    function deleteUser() {
        Alert.alert(
            'Delete',
            'Do you wish to delete your account ?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Confirm',
                    onPress: () => handleDelete(),
                }
            ],
            { cancelable: true }
        )

        function handleDelete() {
            fetch('https://snapchat.epidoc.eu/user',
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + currentUser.token,
                        "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1heC5jaGVuQGVwaXRlY2guZXUiLCJpYXQiOjE3MTgwMDU2Njl9.gCrurHi_lFsio-OitSCBZbGt-PL_hTI5XJVb4-TnE0M"
                    }
                })
                .then(() => {
                    storage.remove({ key: "user" });
                    Alert.alert('Your account was deleted successfully.');
                    router.replace('/');
                })
                .catch(() => setMessage('An error occurred during the suppression of your account.'));
        }
    }

    return (
        <View className="flex-1 justify-center items-center gap-4">
            <Text className="text-xl">Profile</Text>

            <View className="gap-1">
                <View className="gap-1">
                    <Text>Email</Text>
                    <TextInput placeholderTextColor={'black'} onChangeText={(e) => setUpdatedUser({ ...updatedUser, email: e })} placeholder="email@email.com" defaultValue={currentUser?.email} value={updatedUser?.email} />
                </View>

                <View className="gap-1">
                    <Text>Username</Text>
                    <TextInput placeholderTextColor={'black'} onChangeText={(e) => setUpdatedUser({ ...updatedUser, username: e })} placeholder="Username" defaultValue={currentUser?.usernmae} value={updatedUser?.username} />
                </View>

                <View className="gap-1">
                    <Text>Password</Text>
                    <TextInput placeholderTextColor={'black'} onChangeText={(e) => setUpdatedUser({ ...updatedUser, password: e })} placeholder="********" secureTextEntry />
                </View>
            </View>

            {message ? <Text>{message}</Text> : ""}

            <View className="flex-1">
                <Pressable onPress={() => modifyUser()}>
                    <Text className="px-4 py-2 border rounded">Update account</Text>
                </Pressable>

                <Pressable onPress={() => deleteUser()}>
                    <Text className="px-4 py-2 border rounded bg-red">Delete account</Text>
                </Pressable>
            </View>
        </View>
    );

}
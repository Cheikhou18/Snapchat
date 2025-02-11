import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as FileSystem from 'expo-file-system';
import storage from "../../storage";
import * as ImageManipulator from 'expo-image-manipulator';
interface Friend {
    _id: string;
    username: string;
}

interface FriendsListProps {
    photoUri: string;
    duration: number;
}

export default function FriendsList({ photoUri, duration }: FriendsListProps) {
    const router = useRouter();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [sending, setSending] = useState<boolean>(false);
    const maxWidth = 1200;
    const maxHeight = 1200;


    useEffect(() => {
        console.log("Loading user data...");
        storage
            .load({ key: 'user' })
            .then(async (user) => {
                console.log("User loaded:", user);
                fetch("https://snapchat.epidoc.eu/user/friends", {
                    method: "GET",
                    headers: {
                        
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + user.token,
                        "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1heC5jaGVuQGVwaXRlY2guZXUiLCJpYXQiOjE3MTgwMDU2Njl9.gCrurHi_lFsio-OitSCBZbGt-PL_hTI5XJVb4-TnE0M"
                    }
                })
                    .then(async (response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const friendsResponse = await response.json();
                        console.log("Friends loaded:", friendsResponse);
                        setFriends(friendsResponse.data || []);
                    })
                    .catch((error) => {
                        console.error("Failed to load friends:", error);
                        setFriends([]);
                        Alert.alert('Error', 'It seems you have no friends yet...');
                    });
            })
            .catch((error) => {
                console.error("Failed to load user:", error);
                return router.replace('/login');
            });
    }, []);

    const convertAndResizeImage = async (uri: string, maxWidth: number, maxHeight: number): Promise<string> => {
        try {
            console.log("Converting and resizing image:", uri);
            const manipResult = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: maxWidth, height: maxHeight } }], {
                compress: 1,
                format: ImageManipulator.SaveFormat.JPEG,
            });
            const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return base64;
        } catch (error) {
            console.error("Failed to convert and resize image:", error);
            throw new Error('Failed to convert and resize image');
        }
    };

    const sendPhotoToFriend = async (friendId: string) => {
        try {
            setSending(true);
            const resizedBase64Image = await convertAndResizeImage(photoUri, maxWidth, maxHeight);
            console.log("Resized and base64-encoded image:", resizedBase64Image);

            const user = await storage.load({ key: 'user' });

            console.log("Sending photo to friend:", friendId);
            const response = await fetch("https://snapchat.epidoc.eu/snap", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                    "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1heC5jaGVuQGVwaXRlY2guZXUiLCJpYXQiOjE3MTgwMDU2Njl9.gCrurHi_lFsio-OitSCBZbGt-PL_hTI5XJVb4-TnE0M"
                },
                body: JSON.stringify({
                    to: friendId,
                    image: "data:image/png;base64," + resizedBase64Image,
                    duration: parseInt(duration)
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
            }

            const result = await response.json();
            console.log("Photo sent result:", result);
            Alert.alert("Success", JSON.stringify(result));

        } catch (error) {
            console.error("Failed to send photo:", error);
            Alert.alert("Error", `Failed to send photo: ${error.message}`);
        } finally {
            setSending(false);
        }
    };



    return (
        <ScrollView>
            <View style={styles.container}>
                {Array.isArray(friends) && friends.length > 0 ? (
                    friends.map((friend) => {
                        return (
                            <TouchableOpacity key={friend._id} onPress={() => sendPhotoToFriend(friend._id)}>
                                <Text style={styles.friendItem}>
                                    {friend.username}
                                </Text>
                            </TouchableOpacity>
                        );
                    })
                ) : (
                    <Text style={styles.noFriendsText}>
                        No friends found.
                    </Text>
                )}
            </View>
            {sending && <Text style={styles.sendingText}>Sending photo...</Text>}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 4,
        margin: 4,
    },
    friendItem: {
        borderWidth: 1,
        padding: 16,
        margin: 16,
        borderRadius: 8,
    },
    noFriendsText: {
        textAlign: 'center',
    },
    sendingText: {
        textAlign: 'center',
        color: 'blue',
        marginTop: 20,
    },
});

import storage from "../../storage";
import { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

export default function friendsList() {
    const router = useRouter();
    const [friends, setFriends] = useState<Array<any>>();

    useEffect(() => {
        storage
            .load({ key: 'user' })
            .then(async (user) => {
                fetch("https://snapchat.epidoc.eu/user/friends", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + user.token,
                        "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1heC5jaGVuQGVwaXRlY2guZXUiLCJpYXQiOjE3MTgwMDU2Njl9.gCrurHi_lFsio-OitSCBZbGt-PL_hTI5XJVb4-TnE0M"
                    }
                })
                    .then(async (response) => {
                        const friends = await response.json();
                        setFriends(friends.data);
                    })
                    .catch(() => {
                        setFriends([{ username: 'It seems you have no friends yet...' }]);
                    });
            })
            .catch(() => {
                return router.replace('/login')
            });
    }, [])

    return (
        <ScrollView>
            <View className="flex m-4">
                {friends?.map((friend) => {
                    return (
                        <View key={friend.username} className="p-4 border rounded">
                            <Text onPress={() => { router.push({ pathname: "/convo", params: { friend: friend } }) }}>{friend.username}</Text>
                        </View>
                    )
                })}
            </View>
        </ScrollView >
    )
}
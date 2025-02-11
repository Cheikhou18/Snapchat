import storage from "../../storage";
import { useEffect, useState } from "react";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { Alert, Modal, ScrollView, Text, View } from "react-native";

interface SnapType {
    _id: string,
    date: string,
    from: string,
    visible: boolean
}

export default function convo() {
    const router = useRouter();
    const { friend } = useLocalSearchParams();
    const [snaps, setSnaps] = useState<Array<SnapType>>();

    useEffect(() => {
        storage.load({ key: "user" })
            .then(async (user) => {
                fetch("https://snapchat.epidoc.eu/snap", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + user.token,
                        "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1heC5jaGVuQGVwaXRlY2guZXUiLCJpYXQiOjE3MTgwMDU2Njl9.gCrurHi_lFsio-OitSCBZbGt-PL_hTI5XJVb4-TnE0M"
                    }
                })
                    .then(async (response) => {
                        console.log(user.token);
                        const snaps = await response.json();

                        if (snaps.data.length === 0) {
                            return;
                        }

                        snaps?.data.map((snap: SnapType) => {
                            if (snap.from === friend.id) {
                                setSnaps({ ...snaps, snap });
                            }
                        })
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            })
            .catch(() => {
                router.replace('/login');
            })

    }, [])

    return (
        <ScrollView>
            <View className="flex m-4">
                {snaps?.map((snap: SnapType) => {
                    snap.visible = false;
                    return (
                        <View>
                            <Text>Date : {snap.date}</Text>
                            <Modal
                                animationType="slide"
                                visible={snap.visible}
                            >
                                <View>
                                    <Text onPress={() => snap.visible = !snap.visible}>Click to view snap</Text>
                                </View>
                            </Modal>
                        </View>
                    )
                })}
            </View>
        </ScrollView>
    );
}
import "./global.css"
import React from "react";
import storage from "@/storage";
import { Link, useRouter } from "expo-router"
import { ImageBackground, Text, View } from "react-native";

export default function Index() {
  const image = { uri: "https://engage.sinch.com/sites/default/files/image/2023-12/Was%20ist%20Snapchat.jpg" }
  const router = useRouter();

  storage
    .load({ key: 'user' })
    .then(() => {
      router.replace('/camera');
    })
    .catch();

  return (
    <View className="justify-center h-screen">
      <ImageBackground source={image} className="flex-1 justify-center items-center h-screen">
        <Text className="text-xl">Welcome</Text>
        <View>
          <Text>New to Snapchat ? <Link href="/register">Sign up</Link></Text>
          <Text>Already have an account ? <Link href="/login">Sign in</Link></Text>
          <Text>Camera Tests <Link href="/camera">Camera</Link></Text>
        </View>
      </ImageBackground>
    </View>
  );
}
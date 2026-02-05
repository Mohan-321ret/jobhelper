import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((data) => {
      if (data) setUser(JSON.parse(data));
    });
  }, []);

  return (
    <View style={{ padding: 24 }}>
      <Text>Home Screen</Text>
      {user && <Text>Welcome, {user.name}</Text>}
    </View>
  );
}

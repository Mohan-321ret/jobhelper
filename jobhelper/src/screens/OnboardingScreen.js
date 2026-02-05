import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

export default function OnboardingScreen({ navigation }) {

  // 🔴 USE YOUR **WEB CLIENT ID** HERE
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "383593235154-if1gbpg2ve1qotpj4nk1vkgei0tuq0nb.apps.googleusercontent.com",
    androidClientId: "383593235154-if1gbpg2ve1qotpj4nk1vkgei0tuq0nb.apps.googleusercontent.com",
    webClientId: "383593235154-if1gbpg2ve1qotpj4nk1vkgei0tuq0nb.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { idToken } = response.authentication;

      console.log("GOOGLE ID TOKEN:", idToken);

      // send token to backend
      sendTokenToBackend(idToken);
    }
  }, [response]);

  const sendTokenToBackend = async (idToken) => {
    try {
      const res = await fetch("http://YOUR_PC_IP:5000/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await res.json();
      console.log("BACKEND RESPONSE:", data);

      await AsyncStorage.setItem("user", JSON.stringify(data));

      navigation.replace("Home");
    } catch (err) {
      console.log("LOGIN ERROR:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>JobHelper</Text>
      <Text style={styles.subtitle}>Continue with Google to get started</Text>

      <TouchableOpacity
        style={styles.googleBtn}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginVertical: 20,
  },
  googleBtn: {
    backgroundColor: "#4285F4",
    padding: 16,
    borderRadius: 8,
  },
  googleText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});

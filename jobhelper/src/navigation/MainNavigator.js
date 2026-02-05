import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InterviewSetupScreen from "../screens/InterviewSetupScreen";
import InterviewScreen from "../screens/InterviewScreen";
import ResultScreen from "../screens/ResultScreen";
import HomeScreen from "../screens/HomeScreen";
import ResumeSetupScreen from "../screens/ResumeSetupScreen";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen name="InterviewScreen" component={InterviewScreen} />

      <Stack.Screen name="InterviewSetup" component={InterviewSetupScreen} />

      <Stack.Screen name="ResumeSetup" component={ResumeSetupScreen} />

      <Stack.Screen name="ResultScreen" component={ResultScreen} />
    </Stack.Navigator>
  );
}

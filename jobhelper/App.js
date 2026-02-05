import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { VoiceProvider } from './src/context/VoiceContext';

export default function App() {
  return (
    <VoiceProvider>
      <View style={styles.container}>
        <AppNavigator />
        <StatusBar style="light" />
      </View>
    </VoiceProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

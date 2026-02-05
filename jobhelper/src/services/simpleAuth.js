import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export function useSimpleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "842112208756-dcfvp5tpcss98jhhbqtrjr8r5u37ggac.apps.googleusercontent.com",
  });

  const signIn = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        console.log('Login successful:', result);
        return result;
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return { signIn };
}
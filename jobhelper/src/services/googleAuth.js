import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase';

// 🔴 IMPORTANT: configure ONCE (outside function)
GoogleSignin.configure({
  webClientId:
    '842112208756-dcfvp5tpcss98jhhbqtrjr8r5u37ggac.apps.googleusercontent.com',
  offlineAccess: false,
});

export async function signInWithGoogle() {
  try {
    // Ensure Google Play Services are available
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Start Google Sign-In
    const userInfo = await GoogleSignin.signIn();

    // Get ID token
    const { idToken } = userInfo;

    // Create Firebase credential
    const googleCredential = GoogleAuthProvider.credential(idToken);

    // Sign in to Firebase
    await signInWithCredential(auth, googleCredential);

    console.log('✅ Google Sign-In successful');
  } catch (error) {
    console.error('❌ Google Sign-In error:', error);
    throw error;
  }
}

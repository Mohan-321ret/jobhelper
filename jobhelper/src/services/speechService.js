import Voice from '@react-native-voice/voice';

// Initialize speech listeners
export const initSpeech = (onResult, onError) => {
  Voice.onSpeechResults = (event) => {
    const spokenText = event.value[0]; // best match
    onResult(spokenText);
  };

  Voice.onSpeechError = (error) => {
    onError(error);
  };
};

// Start listening
export const startListening = async () => {
  try {
    await Voice.start('en-IN'); // Indian English
  } catch (err) {
    console.log('Start error:', err);
  }
};

// Stop listening
export const stopListening = async () => {
  try {
    await Voice.stop();
  } catch (err) {
    console.log('Stop error:', err);
  }
};

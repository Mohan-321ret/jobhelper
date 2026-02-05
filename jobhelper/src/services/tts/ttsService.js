import * as Speech from 'expo-speech';

export const speakText = async (text, voiceType = 'female') => {
  try {
    await Speech.stop();
    
    const options = {
      language: 'en-US',
      pitch: voiceType === 'female' ? 1.1 : 0.9,
      rate: 0.85,
    };
    
    return new Promise((resolve) => {
      Speech.speak(text, {
        ...options,
        onDone: () => resolve(),
        onError: () => resolve(),
      });
    });
  } catch (error) {
    console.error('TTS Error:', error);
  }
};

export const stopSpeech = async () => {
  try {
    await Speech.stop();
  } catch (error) {
    console.error('Stop TTS Error:', error);
  }
};
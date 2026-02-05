import Voice from '@react-native-voice/voice';
import { useEffect, useState } from 'react';

export default function useSpeechToText() {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setListening(true);
    };

    Voice.onSpeechEnd = () => {
      setListening(false);
    };

    Voice.onSpeechResults = (e) => {
      if (e.value?.length) {
        setText(e.value[0]); // best match
      }
    };

    Voice.onSpeechError = (e) => {
      setError(e.error);
      setListening(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    setText('');
    setError(null);
    await Voice.start('en-US');
  };

  const stopListening = async () => {
    await Voice.stop();
  };

  return {
    text,
    listening,
    error,
    startListening,
    stopListening,
  };
}

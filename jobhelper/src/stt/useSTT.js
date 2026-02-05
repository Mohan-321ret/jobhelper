import { useEffect, useState, useRef, useCallback } from "react";
import { Platform } from "react-native";

// Web Speech Recognition
const getWebSpeechRecognition = () => {
  if (typeof window !== 'undefined') {
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }
  return null;
};

// React Native Voice (for mobile)
let Voice = null;
if (Platform.OS !== 'web') {
  try {
    Voice = require('@react-native-voice/voice').default;
  } catch (e) {
    console.log('Voice package not available');
  }
}

export default function useSTT(onFinalText) {
  const [liveText, setLiveText] = useState("");
  const [listening, setListening] = useState(false);
  const finalTextRef = useRef("");
  const recognitionRef = useRef(null);
  const onFinalTextRef = useRef(onFinalText);
  
  // Update the ref when callback changes
  useEffect(() => {
    onFinalTextRef.current = onFinalText;
  }, [onFinalText]);
  
  // Stable callback that uses the ref
  const stableOnFinalText = useCallback((text) => {
    onFinalTextRef.current(text);
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Web Speech Recognition setup
      const SpeechRecognition = getWebSpeechRecognition();
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          console.log('🎤 Web: Speech started');
          setListening(true);
          setLiveText("");
          finalTextRef.current = "";
        };

        recognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          const currentText = finalTranscript || interimTranscript;
          console.log('📝 Web: Results:', currentText);
          setLiveText(currentText);
          if (finalTranscript) {
            finalTextRef.current = finalTranscript;
          }
        };

        recognition.onend = () => {
          console.log('🛑 Web: Speech ended, final text:', finalTextRef.current);
          setListening(false);
          stableOnFinalText(finalTextRef.current);
        };

        recognition.onerror = (event) => {
          console.log('❌ Web: STT error:', event.error);
          setListening(false);
          stableOnFinalText(finalTextRef.current || "");
        };

        recognitionRef.current = recognition;
      } else {
        console.log('⚠️ Web: Speech Recognition not supported');
      }
    } else if (Voice) {
      // React Native Voice setup
      Voice.onSpeechStart = () => {
        console.log('🎤 Mobile: Speech started');
        setListening(true);
        setLiveText("");
        finalTextRef.current = "";
      };

      Voice.onSpeechResults = (e) => {
        const text = e.value?.[0] || "";
        console.log('📝 Mobile: Results:', text);
        setLiveText(text);
        finalTextRef.current = text;
      };

      Voice.onSpeechEnd = () => {
        console.log('🛑 Mobile: Speech ended, final text:', finalTextRef.current);
        setListening(false);
        stableOnFinalText(finalTextRef.current);
      };

      Voice.onSpeechError = (e) => {
        console.log("❌ Mobile: STT error:", e);
        setListening(false);
        stableOnFinalText(finalTextRef.current || "");
      };
    }

    return () => {
      if (Platform.OS !== 'web' && Voice) {
        Voice.destroy().then(Voice.removeAllListeners);
      }
    };
  }, [stableOnFinalText]);

  const startSTT = async () => {
    try {
      console.log('🚀 Starting STT on', Platform.OS);
      if (Platform.OS === 'web' && recognitionRef.current) {
        recognitionRef.current.start();
      } else if (Voice) {
        await Voice.start('en-US');
      }
    } catch (error) {
      console.error('❌ Start STT error:', error);
    }
  };

  const stopSTT = async () => {
    try {
      console.log('🛑 Stopping STT on', Platform.OS);
      if (Platform.OS === 'web' && recognitionRef.current) {
        recognitionRef.current.stop();
      } else if (Voice) {
        await Voice.stop();
      }
    } catch (error) {
      console.error('❌ Stop STT error:', error);
    }
  };

  return { liveText, listening, startSTT, stopSTT };
}

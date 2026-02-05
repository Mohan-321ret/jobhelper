import { createContext, useContext, useState } from 'react';

const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {
  const [voiceType, setVoiceType] = useState('female'); // default

  return (
    <VoiceContext.Provider value={{ voiceType, setVoiceType }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => useContext(VoiceContext);

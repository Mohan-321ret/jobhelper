import { Audio } from "expo-av";

/**
 * Prepare audio mode for recording
 */
export const prepareAudio = async () => {
  await Audio.requestPermissionsAsync();

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });
};

/**
 * Start recording audio
 */
export const startRecording = async () => {
  try {
    await prepareAudio();

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    return recording; // return recording instance
  } catch (error) {
    console.error("❌ Error starting recording:", error);
    throw error;
  }
};

/**
 * Stop recording and return audio file URI
 */
export const stopRecording = async (recording) => {
  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    return uri;
  } catch (error) {
    console.error("❌ Error stopping recording:", error);
    throw error;
  }
};

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { speakText } from "../services/tts/ttsService";
import { useVoice } from "../context/VoiceContext";
import { useSTT } from "../stt";

export default function InterviewScreen({ route, navigation }) {
  const { interviewData } = route.params;
  const { jobRole, experience, jobDescription } = interviewData;
  const { voiceType } = useVoice();

  /* ================= CONSTANTS ================= */
  const MAX_QUESTIONS = 3;
  const RECORDING_DURATION = 30000;

  /* ================= CAMERA & MIC ================= */
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const cameraRef = useRef(null);

  /* ================= INTERVIEW STATE ================= */
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [previousQA, setPreviousQA] = useState([]);
  const [answerText, setAnswerText] = useState("");
  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);
  const recordingTimeoutRef = useRef(null);

  /* ================= BACKEND API ================= */
  const QUESTION_API = "http://localhost:5000/api/interview/question";

  /* ================= FINALIZE STT ================= */
  const finalizeSTT = (finalText) => {
    console.log('🎯 Finalizing STT with text:', finalText);
    
    if (!isWaitingForAnswer) {
      console.log('⚠️ Not waiting for answer, ignoring STT result');
      return;
    }
    
    setIsWaitingForAnswer(false);
    setIsTranscribing(true);

    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }

    const text = finalText || "No response detected";
    setAnswerText(text);

    setIsTranscribing(false);
    autoSubmitAnswer(text);
  };

  /* ================= STT HOOK ================= */
  const { liveText, listening, startSTT, stopSTT } = useSTT(finalizeSTT);

  /* ================= FETCH QUESTION ================= */
  const fetchQuestion = async (qNo, qaHistory) => {
    try {
      console.log('🔍 Fetching question', qNo, 'with history length:', qaHistory.length);
      setLoadingQuestion(true);
      setIsWaitingForAnswer(false);

      const response = await fetch(QUESTION_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: jobRole,
          level: experience,
          jobDescription,
          questionNumber: qNo,
          previousQA: qaHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Question received:', data.question?.substring(0, 50) + '...');
      setCurrentQuestion(data.question);

      console.log('🔊 Speaking question...');
      await speakText(data.question, voiceType);
      console.log('🔊 TTS finished');
      
      setTimeout(() => {
        console.log('🎤 Starting recording after TTS delay');
        startAutoRecording();
      }, 1500);
      
    } catch (error) {
      console.error("❌ Question fetch failed:", error);
      setCurrentQuestion("Unable to load question.");
    } finally {
      setLoadingQuestion(false);
    }
  };

  /* ================= INTRO ================= */
  useEffect(() => {
    startInterviewWithIntro();
  }, []);

  const startInterviewWithIntro = async () => {
    try {
      const introMessage = `Hello! Welcome to your AI interview for the ${jobRole} position. Based on your ${experience} experience level, let's begin.`;
      
      await speakText(introMessage, voiceType);
      
      setTimeout(() => {
        fetchQuestion(1, []);
      }, 2000);
      
    } catch {
      fetchQuestion(1, []);
    }
  };

  /* ================= AUTO STT ================= */
  const startAutoRecording = async () => {
    console.log('🎤 Starting STT, listening state:', listening);
    
    setIsWaitingForAnswer(true);
    setAnswerText("");
    
    try {
      if (listening) {
        console.log('⚠️ Already listening, stopping first');
        await stopSTT();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      await startSTT();
      console.log('✅ STT started successfully');
      
      recordingTimeoutRef.current = setTimeout(() => {
        console.log('⏰ Recording timeout reached');
        stopAutoRecording();
      }, RECORDING_DURATION);
      
    } catch (error) {
      console.error('❌ Error starting STT:', error);
      setIsWaitingForAnswer(false);
      setAnswerText('Speech recognition not available. Please check microphone permissions.');
    }
  };

  const stopAutoRecording = async () => {
    console.log('🛑 Stopping STT, isWaitingForAnswer:', isWaitingForAnswer);
    
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    
    if (listening) {
      await stopSTT();
    }
    
    if (isWaitingForAnswer) {
      console.log('⏰ Timeout reached, forcing finalization');
      finalizeSTT("");
    }
  };

  /* ================= AUTO SUBMIT ================= */
  const autoSubmitAnswer = (text) => {
    console.log('📝 Auto submitting answer:', text);
    console.log('📊 Current state - questionNumber:', questionNumber, 'previousQA length:', previousQA.length);
    
    const updatedQA = [
      ...previousQA,
      { question: currentQuestion, answer: text },
    ];

    setPreviousQA(updatedQA);
    console.log('📊 Updated QA length:', updatedQA.length);

    if (questionNumber >= MAX_QUESTIONS) {
      console.log('🏁 Interview complete, navigating to results');
      navigation.navigate("ResultScreen", {
        resultData: {
          interviewData,
          answers: updatedQA.map((q) => q.answer),
          totalQuestions: MAX_QUESTIONS,
        },
      });
      return;
    }

    const nextQ = questionNumber + 1;
    console.log('➡️ Moving to question', nextQ);
    setQuestionNumber(nextQ);
    setAnswerText("");
    setIsWaitingForAnswer(false);

    setTimeout(() => {
      console.log('🔄 Fetching next question:', nextQ);
      fetchQuestion(nextQ, updatedQA);
    }, 2000);
  };

  /* ================= PERMISSIONS ================= */
  if (!cameraPermission || !micPermission) {
    return (
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.center}>
        <ActivityIndicator size="large" color="#38BDF8" />
        <Text style={styles.permissionText}>Loading permissions...</Text>
      </LinearGradient>
    );
  }

  if (!cameraPermission.granted || !micPermission.granted) {
    return (
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.center}>
        <View style={styles.permissionCard}>
          <Ionicons name="camera" size={48} color="#38BDF8" style={styles.permissionIcon} />
          <Text style={styles.permissionTitle}>Permissions Required</Text>
          <Text style={styles.permissionText}>
            Camera and Microphone access required for the interview
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={() => {
              requestCameraPermission();
              requestMicPermission();
            }}
          >
            <LinearGradient colors={['#38BDF8', '#0EA5E9']} style={styles.permissionButtonGradient}>
              <Text style={styles.permissionButtonText}>Grant Permissions</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
        <View style={styles.cameraWrapper}>
          <CameraView ref={cameraRef} style={styles.camera} facing="front" />
          <LinearGradient 
            colors={['rgba(15,23,42,0.9)', 'rgba(15,23,42,0.6)']} 
            style={styles.cameraOverlay}
          >
            <View style={styles.overlayContent}>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.overlayText}>AI Interview Live</Text>
              </View>
              <Text style={styles.timerText}>30:00</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.panel}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>AI Interview</Text>
              <Text style={styles.jobRole}>{jobRole} • {experience}</Text>
            </View>
            <TouchableOpacity 
              style={styles.exitButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <View style={styles.questionCard}>
            {loadingQuestion ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#38BDF8" size="large" />
                <Text style={styles.loadingText}>Preparing question...</Text>
              </View>
            ) : (
              <>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionNumber}>
                    Question {questionNumber} / {MAX_QUESTIONS}
                  </Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${(questionNumber / MAX_QUESTIONS) * 100}%` }
                      ]} 
                    />
                  </View>
                </View>

                <Text style={styles.question}>{currentQuestion}</Text>

                <View style={styles.answerSection}>
                  <View style={styles.answerHeader}>
                    <Text style={styles.answerLabel}>Your Answer</Text>
                    {isWaitingForAnswer && listening && (
                      <View style={styles.recordingIndicator}>
                        <View style={styles.recordingDot} />
                        <Text style={styles.recordingText}>Recording...</Text>
                      </View>
                    )}
                  </View>
                  
                  <TextInput
                    style={styles.textArea}
                    multiline
                    editable={false}
                    value={
                      isWaitingForAnswer && listening
                        ? liveText || "Listening..."
                        : isTranscribing
                        ? "Analyzing your answer..."
                        : answerText
                    }
                    placeholder="Your answer will appear here..."
                    placeholderTextColor="#64748B"
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1 },
  cameraWrapper: { height: "35%", position: 'relative' },
  camera: { flex: 1 },
  cameraOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 16,
  },
  overlayContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 6,
  },
  overlayText: { color: "#FFF", fontWeight: "600", fontSize: 12 },
  timerText: { color: "#38BDF8", fontWeight: "600", fontSize: 16 },
  panel: { flex: 1, padding: 20, gap: 20 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  headerContent: { flex: 1 },
  title: { fontSize: 24, fontWeight: "bold", color: "#38BDF8" },
  jobRole: { fontSize: 14, color: "#94A3B8", marginTop: 4 },
  exitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionCard: {
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#94A3B8',
    marginTop: 12,
    fontSize: 16,
  },
  questionHeader: {
    marginBottom: 16,
  },
  questionNumber: {
    color: "#38BDF8",
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 14,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 2,
  },
  question: { 
    fontSize: 18, 
    color: "#FFF", 
    lineHeight: 26,
    marginBottom: 20,
  },
  answerSection: {
    gap: 12,
  },
  answerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  recordingText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  textArea: {
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderRadius: 12,
    padding: 16,
    color: "#FFF",
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#475569",
    fontSize: 16,
    textAlignVertical: 'top',
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  permissionCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  permissionIcon: {
    marginBottom: 16,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  permissionText: { 
    color: "#94A3B8", 
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  permissionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  permissionButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  permissionButtonText: {
    color: "#0F172A",
    fontWeight: "bold",
    fontSize: 16,
  },
});

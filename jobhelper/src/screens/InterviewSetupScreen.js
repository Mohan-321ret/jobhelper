import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useVoice } from "../context/VoiceContext";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function InterviewSetupScreen({ navigation }) {
  const [jobRole, setJobRole] = useState("");
  const [experience, setExperience] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [voiceType, setVoiceType] = useState("");

  const { setVoiceType: setGlobalVoiceType } = useVoice();

  const handleStartInterview = () => {
    if (!jobRole || !experience || !jobDescription || !voiceType) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    navigation.navigate("InterviewScreen", {
      interviewData: {
        jobRole,
        experience,
        jobDescription,
        voiceType,
      },
    });
  };

  const experienceOptions = [
    { label: "Select Experience", value: "" },
    { label: "Fresher (0-1 years)", value: "Fresher" },
    { label: "Junior (1-2 years)", value: "1-2 years" },
    { label: "Senior (3+ years)", value: "3+ years" },
  ];

  return (
    <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#38BDF8" />
            </TouchableOpacity>
            <Text style={styles.title}>Interview Setup</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="briefcase" size={16} color="#38BDF8" /> Job Role
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Java Developer, React Native Developer"
                  placeholderTextColor="#64748B"
                  value={jobRole}
                  onChangeText={setJobRole}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="trending-up" size={16} color="#38BDF8" /> Experience Level
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={experience}
                  onValueChange={setExperience}
                  style={styles.picker}
                  dropdownIconColor="#38BDF8"
                >
                  {experienceOptions.map((option, index) => (
                    <Picker.Item 
                      key={index}
                      label={option.label} 
                      value={option.value}
                      color="#FFF"
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="document-text" size={16} color="#38BDF8" /> Job Description
              </Text>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe the role, required skills, responsibilities..."
                  placeholderTextColor="#64748B"
                  value={jobDescription}
                  onChangeText={setJobDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="mic" size={16} color="#38BDF8" /> Interviewer Voice
              </Text>
              <View style={styles.voiceContainer}>
                <TouchableOpacity
                  style={[
                    styles.voiceButton,
                    voiceType === "Male" && styles.voiceSelected,
                  ]}
                  onPress={() => {
                    setVoiceType("Male");
                    setGlobalVoiceType("male");
                  }}
                >
                  <Ionicons 
                    name="man" 
                    size={24} 
                    color={voiceType === "Male" ? "#0F172A" : "#64748B"} 
                  />
                  <Text
                    style={[
                      styles.voiceText,
                      voiceType === "Male" && styles.voiceTextSelected,
                    ]}
                  >
                    Male Voice
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.voiceButton,
                    voiceType === "Female" && styles.voiceSelected,
                  ]}
                  onPress={() => {
                    setVoiceType("Female");
                    setGlobalVoiceType("female");
                  }}
                >
                  <Ionicons 
                    name="woman" 
                    size={24} 
                    color={voiceType === "Female" ? "#0F172A" : "#64748B"} 
                  />
                  <Text
                    style={[
                      styles.voiceText,
                      voiceType === "Female" && styles.voiceTextSelected,
                    ]}
                  >
                    Female Voice
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartInterview}
            >
              <LinearGradient 
                colors={['#38BDF8', '#0EA5E9']} 
                style={styles.startButtonGradient}
              >
                <Ionicons name="play" size={20} color="#0F172A" style={styles.startIcon} />
                <Text style={styles.startButtonText}>Start Interview</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  placeholder: {
    width: 40,
  },
  form: {
    paddingHorizontal: 20,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 4,
  },
  inputContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  input: {
    padding: 16,
    color: '#FFF',
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  picker: {
    color: '#FFF',
    height: 56,
  },
  textAreaContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  textArea: {
    padding: 16,
    color: '#FFF',
    fontSize: 16,
    minHeight: 120,
  },
  voiceContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  voiceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  voiceSelected: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  voiceText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  voiceTextSelected: {
    color: '#0F172A',
    fontWeight: 'bold',
  },
  startButton: {
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  startIcon: {
    marginRight: 4,
  },
  startButtonText: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

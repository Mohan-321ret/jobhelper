import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";

export default function ResultScreen({ route, navigation }) {
  const { resultData } = route.params;
  const { interviewData, answers, totalQuestions } = resultData;

  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5000/api/evaluation/evaluate";
// my ip = 10.34.53.206

  useEffect(() => {
    fetchEvaluation();
  }, []);

  const fetchEvaluation = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching evaluation for:', {
        role: interviewData.jobRole,
        level: interviewData.experience,
        answersCount: answers.length
      });

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: interviewData.jobRole,
          level: interviewData.experience,
          jobDescription: interviewData.jobDescription,
          answers: answers,
        }),
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Evaluation received:', data);
      setEvaluation(data.evaluation);
    } catch (err) {
      console.error("❌ Evaluation fetch error:", err);
      setError(`Unable to load interview feedback: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38BDF8" />
        <Text style={styles.loadingText}>Evaluating your interview...</Text>
      </View>
    );
  }

  if (error || !evaluation) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Interview Feedback</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Scores</Text>
          <Text style={styles.score}>Overall: {evaluation.overallScore}/10</Text>
          <Text style={styles.score}>Communication: {evaluation.communication}/10</Text>
          <Text style={styles.score}>Technical: {evaluation.technical}/10</Text>
          <Text style={styles.score}>Problem Solving: {evaluation.problemSolving}/10</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Strengths</Text>
          {evaluation.strengths.map((item, index) => (
            <Text key={index} style={styles.bullet}>• {item}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Areas to Improve</Text>
          {evaluation.improvements.map((item, index) => (
            <Text key={index} style={styles.bullet}>• {item}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Final Verdict</Text>
          <Text style={styles.verdict}>{evaluation.finalVerdict}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("InterviewSetup")}
        >
          <Text style={styles.buttonText}>New Interview</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#38BDF8",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#38BDF8",
    marginBottom: 10,
  },
  score: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 4,
  },
  bullet: {
    color: "#FFF",
    fontSize: 15,
    marginBottom: 6,
  },
  verdict: {
    color: "#E5E7EB",
    fontSize: 16,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#38BDF8",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#0F172A",
    fontWeight: "bold",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
  },
  loadingText: {
    color: "#94A3B8",
    marginTop: 10,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 16,
  },
});

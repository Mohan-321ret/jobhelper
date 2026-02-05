import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
} from "react-native";

export default function ResumeInterviewScreen({ route }) {
  const { resumeText } = route.params;

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [questionNumber, setQuestionNumber] = useState(1);

  useEffect(() => {
    fetchQuestion("");
  }, []);

  const fetchQuestion = async (previousAnswer) => {
    setLoading(true);

    const response = await fetch(
      "http://localhost/api/resume-interview/question",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          previousAnswer,
          questionNumber,
        }),
      }
    );

    const data = await response.json();

    setQuestion(data.question);
    setQuestionNumber((prev) => prev + 1);
    setLoading(false);
  };

  return (
    <View style={{ padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Interview Question
          </Text>

          <Text style={{ marginTop: 12, fontSize: 16 }}>
            {question}
          </Text>
        </>
      )}
    </View>
  );
}

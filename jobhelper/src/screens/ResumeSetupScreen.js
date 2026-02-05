const startInterview = async () => {
  if (!resume) return;

  const formData = new FormData();

  formData.append("resume", {
    uri: resume.uri,
    name: resume.name,
    type: resume.mimeType,
  });

  try {
    const response = await fetch(
      "http://192.168.0.100:5000/api/resume-interview/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!data.success) {
      alert("Resume processing failed ❌");
      return;
    }

    // ✅ Navigate to resume interview screen
    navigation.navigate("ResumeInterviewScreen", {
      resumeText: data.resumeText,
    });

  } catch (error) {
    alert("Backend not reachable ❌");
  }
};

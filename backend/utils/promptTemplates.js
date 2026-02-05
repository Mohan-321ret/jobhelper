// // This function creates a prompt for interview questions
// export const interviewQuestionPrompt = (role, level) => `
// You are a technical interviewer.

// Ask ONE interview question.
// Role: ${role}
// Difficulty: ${level}

// Only return the question.
// `;



//wed - 3.40pm
export const interviewQuestionPrompt = ({
  role,
  level,
  jobDescription,
  questionNumber,
  previousQA,
}) => {
  let history = "None";

  if (previousQA && previousQA.length > 0) {
    history = previousQA
      .map(
        (qa, index) =>
          `Q${index + 1}: ${qa.question}\nA${index + 1}: ${qa.answer}`
      )
      .join("\n");
  }

  return `
You are a professional AI interviewer.

Job Role: ${role}
Experience Level: ${level}
Job Description: ${jobDescription || "Not provided"}

Previous Questions and Answers:
${history}

Now ask interview question number ${questionNumber}.

Rules:
- Ask ONLY ONE interview question
- Do NOT repeat previous questions
- Increase difficulty gradually
- Keep it relevant to the role
- Do NOT add explanations
- Return ONLY the question text
`;
};


export const interviewEvaluationPrompt = ({
  role,
  level,
  jobDescription,
  answers,
}) => {
  const answersList = answers
    .map((answer, index) => `Answer ${index + 1}: ${answer}`)
    .join("\n\n");

  return `Evaluate this interview and respond with ONLY a JSON object. No markdown, no code blocks, no extra text.

Role: ${role}
Level: ${level}
Job description: ${jobDescription}

Answers:
${answersList}

Respond with this exact JSON structure:
{
  "overallScore": 8,
  "communication": 7,
  "technical": 6,
  "problemSolving": 7,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "finalVerdict": "evaluation summary"
}`;
};


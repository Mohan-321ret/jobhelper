import OpenAI from "openai";

let client = null;

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY not loaded");
  }

  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return client;
};

export const generateResumeInterviewQuestion = async ({
  resumeText,
  previousAnswer,
  questionNumber,
}) => {
  const openai = getOpenAIClient();

  const prompt = `
You are a technical interviewer.

Candidate Resume:
${resumeText}

Previous Answer:
${previousAnswer || "None"}

Question Number:
${questionNumber}

Rules:
- Ask ONLY ONE interview question
- Base it strictly on resume skills and experience
- Increase difficulty gradually
- Do not repeat questions
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
};

import askAI from "./services/ai.service.js";

const test = async () => {
  const reply = await askAI(
    "Ask one beginner Android interview question"
  );
  console.log("Groq Response:\n", reply);
};

test();

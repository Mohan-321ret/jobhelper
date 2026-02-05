// import askAI from "../services/ai.service.js";
// import { interviewQuestionPrompt } from "../utils/promptTemplates.js";

// export const startInterview = async (req, res) => {
//   try {
//     // 1️⃣ Get data from frontend
//     const { role, level } = req.body;

//     // 2️⃣ Validate input
//     if (!role || !level) {
//       return res.status(400).json({
//         error: "Role and level are required",
//       });
//     }

//     // 3️⃣ Create AI prompt
//     const prompt = interviewQuestionPrompt(role, level);

//     // 4️⃣ Ask AI
//     const question = await askAI(prompt);

//     // 5️⃣ Send response to frontend
//     res.json({ question });
//   } catch (error) {
//     res.status(500).json({
//       error: "Failed to generate interview question",
//     });
//   }
// };


// 3.40 - wed
// import  askAI  from "../services/ai.service.js";
// import { interviewQuestionPrompt } from "../utils/promptTemplates.js";

// export const getInterviewQuestion = async (req, res) => {
//   try {
//     const {
//       role,
//       level,
//       jobDescription,
//       questionNumber,
//       previousQA,
//     } = req.body;

//     // ✅ Validate required fields
//     if (!role || !level || !questionNumber) {
//       return res.status(400).json({
//         error: "role, level, and questionNumber are required",
//       });
//     }

//     // ✅ Build prompt using template
//     const prompt = interviewQuestionPrompt({
//       role,
//       level,
//       jobDescription,
//       questionNumber,
//       previousQA,
//     });

//     // ✅ Ask AI (Groq)
//     const question = await askAI(prompt);

//     res.status(200).json({ question });
//   } catch (error) {
//     console.error("Interview Question Error:", error);
//     res.status(500).json({
//       error: "Failed to generate interview question",
//     });
//   }
// };


// 25 -sunday
import askAI from "../services/ai.service.js";
import { interviewQuestionPrompt } from "../utils/promptTemplates.js";

export const getInterviewQuestion = async (req, res) => {
  try {
    // 🔹 Extract data sent from frontend
    const {
      role,
      level,
      jobDescription,
      questionNumber,
      previousQA,
    } = req.body;

    // 🔹 Debug (VERY useful while developing)
    console.log("REQ BODY FROM FRONTEND:", req.body);

    // 🔹 Validate required fields
    if (!role || !level || !questionNumber) {
      return res.status(400).json({
        error: "role, level, and questionNumber are required",
      });
    }

    // 🔹 Ensure previousQA is always an array
    const safePreviousQA = Array.isArray(previousQA)
      ? previousQA
      : [];

    // 🔹 Build AI prompt using template
    const prompt = interviewQuestionPrompt({
      role,
      level,
      jobDescription,
      questionNumber,
      previousQA: safePreviousQA,
    });

    // 🔹 Call AI service (Groq)
    const question = await askAI(prompt);

    // 🔹 Send question back to frontend
    return res.status(200).json({
      question,
    });
  } catch (error) {
    console.error("Interview Question Error:", error);
    return res.status(500).json({
      error: "Failed to generate interview question",
    });
  }
};


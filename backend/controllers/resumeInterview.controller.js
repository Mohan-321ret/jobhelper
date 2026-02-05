import { extractResumeText } from "../services/resume.service.js";
import { generateResumeInterviewQuestion } 
from "../services/resumeInterviewAI.service.js";

// 1️⃣ Upload resume + extract text
export const uploadResumeAndExtract = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false });
    }

    const resumeText = await extractResumeText(req.file);

    res.json({
      success: true,
      resumeText,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// 2️⃣ Generate resume-based interview question
export const getResumeInterviewQuestion = async (req, res) => {
  try {
    const { resumeText, previousAnswer, questionNumber } = req.body;

    const question = await generateResumeInterviewQuestion({
      resumeText,
      previousAnswer,
      questionNumber,
    });

    res.json({
      success: true,
      question,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

import askAI from "../services/ai.service.js";
import { interviewEvaluationPrompt } from "../utils/promptTemplates.js";

export const evaluateInterview = async (req, res) => {
  try {
    const { role, level, jobDescription, answers } = req.body;

    if (!answers || answers.length === 0) {
      return res.status(400).json({
        error: "Interview answers are required for evaluation",
      });
    }

    const prompt = interviewEvaluationPrompt({
      role,
      level,
      jobDescription,
      answers,
    });

    const aiResponse = await askAI(prompt);
    console.log('Raw AI Response:', aiResponse);
    
    // Aggressive cleaning of the response
    let cleanedResponse = aiResponse
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .trim();
    
    // Find the actual JSON object
    const firstBrace = cleanedResponse.indexOf('{');
    const lastBrace = cleanedResponse.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('No JSON object found in response');
    }
    
    const jsonString = cleanedResponse.substring(firstBrace, lastBrace + 1);
    console.log('Extracted JSON:', jsonString);
    
    const evaluation = JSON.parse(jsonString);
    console.log('Parsed successfully:', evaluation);

    res.status(200).json({ evaluation });
  } catch (error) {
    console.error("Evaluation Controller Error:", error.message);
    res.status(500).json({
      error: "Failed to evaluate interview",
    });
  }
};

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import resumeInterviewRoutes from "./routes/resumeInterview.routes.js";
import evaluationRoutes from "./routes/evaluation.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import authRoutes from "./routes/auth.js"; // ✅ CORRECT

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/interview", interviewRoutes);
app.use("/api/evaluation", evaluationRoutes);
app.use("/api/resume-interview", resumeInterviewRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

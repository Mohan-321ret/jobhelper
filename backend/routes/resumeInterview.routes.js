import express from "express";
import multer from "multer";
import {
  uploadResumeAndExtract,
  getResumeInterviewQuestion,
} from "../controllers/resumeInterview.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// upload resume
router.post("/upload", upload.single("resume"), uploadResumeAndExtract);

// get interview question
router.post("/question", getResumeInterviewQuestion);

export default router;

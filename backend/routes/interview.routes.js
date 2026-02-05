import express from "express";
import { getInterviewQuestion  } from "../controllers/interview.controller.js";

const router = express.Router();

router.post("/question", getInterviewQuestion);

export default router;

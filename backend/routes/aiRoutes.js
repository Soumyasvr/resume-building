import express from "express";

import protect from '../middilewares/authMiddleware.js';
import { enhaceProfessionalSummary, enhanceJobDescription, uploadResume } from "../controllers/aiContoller.js";

const aiRouter = express.Router();

aiRouter.post("/enhance-pro-sum", protect, enhaceProfessionalSummary);
aiRouter.post("/enhance-job-description", protect, enhanceJobDescription);
aiRouter.post("/upload-resume", protect, uploadResume);

export default aiRouter;
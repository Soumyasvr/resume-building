import express from "express";
import { createResume, deleteResume, getResumeById, getResumeByIdPublic, updateResume } from "../controllers/resumeController.js";

import protect from '../middilewares/authMiddleware.js';
import upload from "../configs/multer.js";

const resumeRouter = express.Router();

resumeRouter.post("/create",protect, createResume)
resumeRouter.delete("/delete/:resumeId", protect, deleteResume)
resumeRouter.get("/get/:resumeId", protect, getResumeById)
resumeRouter.put("/update", protect, upload.single("image"),  updateResume)
resumeRouter.get("/public/:resumeId", getResumeByIdPublic)


export default resumeRouter;
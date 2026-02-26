


//controller for creating user resume
import imageKit from "../configs/imagekit.js";
import Resume from "../models/Resume.js";
import fs from "fs";

//POST: /api/users/resume
export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {title} = req.body;

        // create new resume
        const newResume = await Resume.create({
            title,
            userId
        })
        // return success response
        return res.status(201).json({message: "Resume created successfully", resume: newResume});
    } catch (error) {
        return res.status(400).json({message: "Error creating user resume", error: error.message});
    }   
}

// controller for deleting user resume
//DELETE: /api/users/resume/:id
export const deleteResume = async (req, res) => {
    
    try {
        const userId = req.userId;
        const {resumeId} = req.params;
        await Resume.findOneAndDelete({userId, _id: resumeId});
        // return success response
        return res.status(200).json({message: "Resume deleted successfully"});
    } catch (error) {
        return res.status(500).json({message: "Error deleting resume", error: error.message});
    }
}

//controller for get user resume by id
//GET: /api/users/resume/:id
export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;
        const resume = await Resume.findOne({userId, _id: resumeId});
        if(!resume){
            return res.status(404).json({message: "Resume not found"});
        } 
        resume._v = undefined; // hide version key in response
        resume.createdAt = undefined; // hide createdAt key in response
        resume.updatedAt = undefined; // hide updatedAt key in response
        // return success response  
        return res.status(200).json({resume});
    } catch (error) {
        return res.status(500).json({message: "Error fetching resume", error: error.message});
    }
}

//get resume by id public 
//GET: /api/resume/public 

export const getResumeByIdPublic = async (req, res) => {
    try {
        const {resumeId} = req.params;
        const resume = await Resume.findOne({public: true, _id: resumeId});
        if(!resume){
            return res.status(404).json({message: "Resume not found"});
        } 
        
        return res.status(200).json({resume});
    } catch (error) {
        return res.status(500).json({message: "Error fetching public resume", error: error.message});
    }
}

//controller for updating user resume
//PUT: /api/users/resume/:id
export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId, resumeData, removeBackground} = req.body;
        const image = req.file;


        let resumeDataCopy; 

        if(typeof resumeData === "string"){
            resumeDataCopy = JSON.parse(resumeData);
        }else{
            resumeDataCopy = structuredClone(resumeData);
        }

        if(image){

            const imageBufferData = fs.createReadStream(image.path);

            const response = await imageKit.files.upload({
                            file: imageBufferData,
                            fileName: "resume.png",
                            folder: "user-resumes",
                            transformation: {
                                pre: "w-300, h-300, fo-face,z-0.75" + (removeBackground ? ",e-bgremove" : "")
                            }
                            });
              resumeDataCopy.personal_info.image = response.url;              
        }

        const resume = await Resume.findOneAndUpdate({
            userId,
            _id: resumeId
        }, resumeDataCopy, {new: true});
        return res.status(200).json({message: "Resume updated successfully", resume});
    } catch (error) {
        return res.status(500).json({message: "Error updating resume", error: error.message});
    }
}
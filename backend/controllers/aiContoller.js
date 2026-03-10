//controller for enhacement of summary 
//POST: //api/ai/enhance-summary

import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

export const enhaceProfessionalSummary = async (req, res) => {
    try {
        const {userContent} = req.body;

        

        const response = await ai.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [
                {   role: "system",
                    content: "You are an export in resume writing. Your task is to enhance the professional summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-frinedly, and only return text no options or anything else." 
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
        })
        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent});
    } catch (error) {
        console.log("FULL ERROR:", error);
        console.log("ERROR MESSAGE:", error.message);
        console.log("ERROR RESPONSE:", error.response?.data);
        res.status(500).json({message: "Error enhancing professional summary", error: error.message});
    }
}

//controller for enhacement of job description
//POST: //api/ai/enahance-job-description

export const enhanceJobDescription = async (req, res) => {
    try {
        const {userContent} = req.body;

        

        const response = await ai.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [
                {   role: "system",
                    content: "You are an export in resume writing. Your task is to enhance the job description should be 1-2 sentences also highlighting key responsibilities, and achievements. Use action verbs and quantifiable results where possible. Make it compelling and ATS-frinedly, and only return text no options or anything else." 
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
        })
        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent});
    } catch (error) {
        console.log("FULL ERROR:", error);
        console.log("ERROR MESSAGE:", error.message);
        console.log("ERROR RESPONSE:", error.response?.data);
        res.status(500).json({message: "Error enhancing job description", error: error.message});
    }
}

//controller for uploading resume to database
//POST: //api/ai/upload-resume

export const uploadResume = async (req, res) => {
    try {
        const {resumeText} = req.body;
        const userId = req.userId;

        if(!resumeText){
            return res.status(400).json({message: "Resume text is required"});
        }

        const systemPrompt = "You are an expert AI Agent to extract data from resume";

        const userPromt = `Extract data from this resume: ${resumeText} provide data in the following JSON format with no additional text before or after 
        
        {
        professional_summary: {type: String, default: ""},
        skills: [{type: String}],
        personal_info: {
            image: {type: String, default: ""},
            full_name: {type: String, default: ""},
            profession: {type: String, default: ""},
            email: {type: String, default: ""},
            phone: {type: String, default: ""},
            location: {type: String, default: ""},
            linkedIn: {type: String, default: ""},
            website: {type: String, default: ""},
        },
        experience: [{
            company: {type: String},
            position: {type: String},
            start_date: {type: String},
            end_date: {type: String},
            description: {type: String},
            is_current: {type: Boolean, default: false}
        }],
        project: [{
            name: {type: String},
            type: {type: String},
                description: {type: String},
            }],
            education: [{
                institution: {type: String},
                degree: {type: String},
                field: {type: String},
                graduation_date: {type: String},
                gpa: {type: String},
            }],
        }

        `;

        const response = await ai.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [
                {   role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPromt,
                },
            ],
            response_format: {type: "json_object"}
        })
        const extractedData = response.choices[0].message.content;
        const parsedData = JSON.parse(extractedData);
        const newResume = await Resume.create({userId, title: parsedData.title, ...parsedData});
        return res.status(200).json({resumeId: newResume._id});
    } catch (error) {
        res.status(500).json({message: "Error extracting data from resume", error: error.message});
    }
}

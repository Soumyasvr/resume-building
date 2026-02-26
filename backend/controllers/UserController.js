import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";


const generateToken = (userId) => {
    const token = jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: "7d"});
    return token;
}



// controller for user registration
//POST: /api/users/register
export const registerUser = async (req, res) => {
    try {
        const{name, email, password} = req.body;
       // check if user already exists
       if(!name || !email || !password){
        return res.status(400).json({message: "Please fill all the fields"});
       }

       // check if user already exists
         const userExists = await UserModel.findOne({email});
         if(userExists){
            return res.status(400).json({message: "User already exists"});
         }

         // create new user
         const hashedPassword = await bcrypt.hash(password, 10);
         
         const newUser = await UserModel.create({name, email, password: hashedPassword}); 
         
         // return success response

         const token = generateToken(newUser._id);
         newUser.password = undefined; // hide password in response
         
         return res.status(201).json({message: "User created successfully", token, user: newUser});
    } catch (error) {
        res.status(400).json({message: "Error creating user", error: error.message});
    }
}

// controller for user login
//POST: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const{email, password} = req.body;
       
       // check if user exists
         const userExists = await UserModel.findOne({email});
         if(!userExists){
            return res.status(400).json({message: "User does not exist"});
         }

         // check if password is correct

         if(!userExists.comparePassword(password)){
            return res.status(400).json({message: "Invalid credentials"});
         }

         // return success response

         

         const token = generateToken(userExists._id);
         userExists.password = undefined; // hide password in response
         
         return res.status(201).json({message: "User logged in successfully", token, user: userExists});
        
    } catch (error) {
        res.status(400).json({message: "Error logging in user", error: error.message});
    }
}

// controller for getting user profile
//GET: /api/users/profile
export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;
        // check if user exists

        const user = await UserModel.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        // return success response
        user.password = undefined; // hide password in response
        return res.status(200).json({user});
    } catch (error) {
        res.status(400).json({message: "Error fetching user profile", error: error.message});
    }
}

// controller for getting user resume
//GET: /api/users/resume

export const getUserResume = async (req, res) => {
    try {
        const userId = req.userId;
        const resumes = await Resume.find({userId});
        if(!resumes || resumes.length === 0){
            return res.status(404).json({message: "Resume not found"});
        }
        return res.status(200).json({resumes});
    } catch (error) {
        res.status(400).json({message: "Error fetching user resume", error: error.message});
    }
}
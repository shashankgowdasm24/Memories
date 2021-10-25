import mongoose  from "mongoose";
import User from "../models/user.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if(!existingUser) return res.status(404).json({message:"Not found"})

        const isPassCorrect = await bcrypt.compare(password,existingUser.password);

        if(!isPassCorrect) return res.status(400).json({message:"Invalid credential"})

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'shashank', { expiresIn: "1h" });

        res.send(200).json({ result:existingUser, token })

    } catch (error) {
        res.status(500).json({message: "somthing went wrong"});
    }
}

export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if(existingUser) return res.status(404).json({message:"user already exist"});

        if(password !== confirmPassword) return res.status(400).json({message:"Password doesn't match"})
    
        const hashedPassword = await bcrypt.hash(password,12);

        const result = await User.create({email, password:hashedPassword, name:`${firstName} ${lastName}`});

        const token = jwt.sign({ email: result.email, id: result._id }, 'shashank', { expiresIn: "1h" });

        res.send(200).json({ result:result, token })

    } catch (error) {
        res.status(500).json({message: "somthing went wrong"});
    }
}
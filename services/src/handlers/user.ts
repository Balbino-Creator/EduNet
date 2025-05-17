import { Request, Response } from "express"
import { validationResult } from 'express-validator'
import User from "../models/User.model"

export const createUser = async (req : Request, res : Response) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()})
        return
    }
    const user = await User.create(req.body)
    res.json({data: user})
}
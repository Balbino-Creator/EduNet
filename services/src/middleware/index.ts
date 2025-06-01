import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

interface UserPayload {
    id: number;
    role: string;
}

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()})
        return
    }
    next()
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        res.status(401).json({ message: "Token required" })
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
        (req as any).user = decoded
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" })
    }
}
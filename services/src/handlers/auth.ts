import { Request, Response } from "express"
import ldap from "ldapjs"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User, { UserRole } from "../models/User.model"
import { Op } from "sequelize"
import { sendConfirmationEmail } from "../config/emailService"
import ldapClient from "../config/ldap"

export const createAccount = async (req: Request, res: Response) => {
    try {
        const { name, last_names, role, email, password, password_confirmation } = req.body

        if (password !== password_confirmation) {
            res.status(400).json({ error: "Password confirmation does not match." })
            return
        }

        if (role === UserRole.STUDENT) {
            if (email) {
                res.status(400).json({ error: "Students should not provide an email address." })
                return
            }
            const existingUser = await User.findOne({ where: { name } })
            if (existingUser) {
                res.status(400).json({ error: "Username is already in use." })
                return
            }
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            const user = await User.create({ name, last_names, role, password: hashedPassword, confirmed: true })
            res.json({ message: "Student registered successfully." })
            return
        }

        if (!email) {
            res.status(400).json({ error: "Teachers must provide an email address." })
            return
        }

        const dn = `uid=${name},${process.env.LDAP_BASE_DN}`
        const entry = {
            cn: name,
            sn: last_names,
            objectClass: ["inetOrgPerson", "posixAccount"],
            uid: name,
            mail: email,
            userPassword: password,
        }

        ldapClient.add(dn, entry, async (err) => {
            if (err) {
                console.error("Error adding user to LDAP:", err)
                res.status(500).json({ error: "LDAP registration failed." })
                return
            }
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            await User.create({ name, last_names, role, email, password: hashedPassword, confirmed: true })
            res.json({ message: "Teacher registered successfully in LDAP!" })
            return
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { identifier, password } = req.body

        let user: User | null = null
        if (identifier.includes("@")) {
            user = await User.findOne({ where: { email: identifier, role: UserRole.TEACHER } })
        } else {
            user = await User.findOne({ where: { name: identifier, role: UserRole.STUDENT } })
        }

        if (!user) {
            res.status(401).json({ error: "Invalid credentials" })
            return
        }

        if (!user.confirmed) {
            res.status(403).json({ error: "Your account is not confirmed." })
            return
        }

        // Teachers log in via email and ldap
        if (user.role === UserRole.TEACHER) {
            const dn = `uid=${user.name},${process.env.LDAP_BASE_DN}`
            ldapClient.bind(dn, password, (err) => {
                if (err) {
                    console.error("LDAP authentication failed:", err)
                    res.status(401).json({ error: "LDAP authentication failed. Check your credentials." })
                    return
                }
                const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1h" })
                res.json({ message: "Login successful", user, token })
                ldapClient.unbind((unbindErr) => {
                    if (unbindErr) console.error("Error unbinding LDAP connection:", unbindErr)
                })
            })
            return
        }

        // Local authentication for students
        const isValidPassword = await bcrypt.compare(password, user.password || "")
        if (!isValidPassword) {
            res.status(401).json({ error: "Invalid credentials" })
            return
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1h" })
        res.json({ message: "Login successful", user, token })

    } catch (error) {
        console.error("Login error:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const confirmAccount = async (req: Request, res: Response) => {
    try {
        const { token } = req.query
        if (!token) {
            res.status(400).json({ error: "Confirmation token is required." })
            return
        }
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET!) as { email: string }
        const user = await User.findOne({ where: { email: decoded.email } })
        if (!user) {
            res.status(404).json({ error: "User not found." })
            return
        }
        if (user.confirmed) {
            res.status(400).json({ error: "Account is already confirmed." })
            return
        }
        user.confirmed = true
        await user.save()
        res.json({ message: "Account confirmed successfully!" })
    } catch (error) {
        console.error("Error confirming account:", error)
        res.status(400).json({ error: "Invalid or expired token." })
    }
}
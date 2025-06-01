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

        // Check for existing username (uid) or email
        if (role === UserRole.TEACHER) {
            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [
                        { uid: name },
                        { email }
                    ]
                }
            })
            if (existingUser) {
                if (existingUser.uid === name) {
                    res.status(400).json({ error: "A user with this username already exists." })
                    return
                }
                if (existingUser.email === email) {
                    res.status(400).json({ error: "A user with this email already exists." })
                    return
                }
                // fallback
                res.status(400).json({ error: "A user with this username or email already exists." })
                return
            }
        } else if (role === UserRole.STUDENT) {
            const existingUser = await User.findOne({ where: { name } })
            if (existingUser) {
                res.status(400).json({ error: "A user with this username already exists." })
                return
            }
        }

        if (role === UserRole.STUDENT) {
            if (email) {
                res.status(400).json({ error: "Students should not provide an email address." })
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
          cn: name || "",
          sn: last_names || "",
          mail: email || "",
          objectClass: ["inetOrgPerson", "organizationalPerson", "person", "top"],
          userPassword: password
        }
        console.log("LDAP entry to add:", entry)
        if (!entry.cn || !entry.sn || !entry.mail) {
          res.status(400).json({ error: "Missing required LDAP fields." })
          return
        }
        ldapClient.bind(
          process.env.LDAP_BIND_DN!,
          process.env.LDAP_BIND_PASSWORD!,
          (err) => {
            if (err) {
              console.error("LDAP bind failed:", err)
              res.status(500).json({ error: "LDAP bind failed." })
              return
            }
            ldapClient.add(dn, entry, async (addErr) => {
              if (addErr) {
                console.error("Error adding user to LDAP:", addErr)
                let errorMsg = "LDAP registration failed."
                if (addErr.name === "EntryAlreadyExistsError") {
                  errorMsg = "A user with this username already exists."
                } else if (addErr.name === "ConstraintViolationError") {
                  errorMsg = "Missing required LDAP fields or invalid data."
                }
                res.status(400).json({ error: errorMsg })
                return
              }
              const user = await User.create({
                uid: name,
                name,
                last_names,
                role,
                email,
                confirmed: false
              })
              // Generate confirmation token
              const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "1d" })
              // Send confirmation email
              await sendConfirmationEmail(email, token)
              res.json({ message: "Teacher registered successfully. Please check your email to confirm your account." })
              ldapClient.unbind((unbindErr) => {
                if (unbindErr) console.error("Error unbinding LDAP connection:", unbindErr)
              })
            })
          }
        )
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
            res.status(403).json({ error: "You must confirm your email before logging in." })
            return
        }

        // Teachers log in via email and ldap
        if (user.role === UserRole.TEACHER) {
            const user = await User.findOne({ where: { email: identifier, role: UserRole.TEACHER } })
            if (!user) {
              res.status(401).json({ error: "Invalid credentials" })
              return
            }
            const dn = `uid=${user.uid},${process.env.LDAP_BASE_DN}`
            console.log("Trying LDAP bind with DN:", dn)
            const ldapClient = ldap.createClient({
              url: process.env.LDAP_URL,
              timeout: 5000,
              connectTimeout: 5000
            })
            ldapClient.bind(dn, password, (err) => {
              console.log("LDAP bind callback called")
              if (err) {
                console.error("LDAP authentication failed:", err)
                res.status(401).json({ error: "LDAP authentication failed. Check your credentials." })
                ldapClient.unbind()
                return
              }
              // Success: generate token, respond, unbind
              const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1h" })
              res.json({ message: "Login successful", user, token })
              ldapClient.unbind()
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
    // Redirect to frontend success page
    res.redirect("http://localhost:5173/email-success")
  } catch (error) {
    console.error("Error confirming account:", error)
    res.status(400).json({ error: "Invalid or expired token." })
  }
}
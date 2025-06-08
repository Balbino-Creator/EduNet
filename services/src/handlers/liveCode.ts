import { Request, Response } from "express";
import Classroom from "../models/Classroom.model";
import LiveCodeFile from "../models/LiveCodeFile.model";
import ChatMessage from "../models/ChatMessage.model";
import User from "../models/User.model";

// Get all live code state for a classroom
export const getLiveCodeState = async (req: Request, res: Response) => {
  try {
    const { classroomId } = req.params
    const classroom = await Classroom.findByPk(classroomId, {
      include: [
        { model: User, attributes: ["id", "name", "role", "confirmed"] },
        { model: ChatMessage, include: [{ model: User, attributes: ["name"] }] },
        { model: LiveCodeFile }
      ]
    })
    if (!classroom) {
      res.status(404).json({ error: "Classroom not found" })
      return
    }
    // Chat messages
    const messages = classroom.chatMessages.map(msg => ({
      user: msg.user?.name || "Unknown",
      message: msg.message
    }))
    // Participants
    const participants = {
      active: classroom.users.filter(u => u.confirmed).map(u => u.name),
      disconnected: classroom.users.filter(u => !u.confirmed).map(u => u.name)
    }
    // Files
    const files = classroom.liveCodeFiles.map(f => ({
      id: f.id,
      filename: f.filename,
      content: f.content
    }))
    res.json({
      messages: messages || [],
      participants: participants || { active: [], disconnected: [] },
      files: files || [],
      isTeacher: (req as any).user.role === "teacher"
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to load live code state" })
  }
};

// Create/edit file (teachers only)
export const upsertLiveCodeFile = async (req: Request, res: Response) => {
  try {
    const { classroomId } = req.params;
    const { filename, content } = req.body;
    if ((req as any).user.role !== "teacher") {
      res.status(403).json({ error: "Only teachers can edit files" });
      return;
    }
    let file = await LiveCodeFile.findOne({ where: { classroomId, filename } });
    if (file) {
      file.content = content;
      await file.save();
    } else {
      file = await LiveCodeFile.create({ classroomId, filename, content });
    }
    res.json({ file });
  } catch (error) {
    res.status(500).json({ error: "Failed to save file" });
  }
};

// Delete file (teachers only)
export const deleteLiveCodeFile = async (req: Request, res: Response) => {
  try {
    const { classroomId, filename } = req.params;
    if ((req as any).user.role !== "teacher") {
      res.status(403).json({ error: "Only teachers can delete files" });
      return;
    }
    const file = await LiveCodeFile.findOne({ where: { classroomId, filename } });
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }
    await file.destroy();
    res.json({ message: "File deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete file" });
  }
};
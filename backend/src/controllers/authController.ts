import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database";
import { logAudit } from "../services/auditService";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role, stateId, phcId } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        stateId: stateId || null,
        phcId: phcId || null,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        stateId: user.stateId,
        phcId: user.phcId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        stateId: user.stateId,
        phcId: user.phcId,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );

    await logAudit({
      userId: user.id,
      action: "USER_LOGIN",
      entity: "User",
      entityId: user.id,
      details: {
        email: user.email,
        role: user.role,
      },
    });

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

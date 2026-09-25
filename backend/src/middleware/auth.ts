import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
  userId: string;
  role: string;
  stateId?: string | null;
  phcId?: string | null;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

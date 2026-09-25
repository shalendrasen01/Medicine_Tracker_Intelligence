import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";

const router = Router();

router.get(
  "/admin",
  authenticate,
  authorize("CENTRAL_ADMIN"),
  (_req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

export default router;
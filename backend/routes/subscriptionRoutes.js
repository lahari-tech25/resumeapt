import express from "express";
import verifyToken from "../middleware/authmiddleware.js";
import { upgradePlan } from "../controllers/subscriptionController.js";

const router = express.Router();

router.post("/upgrade", verifyToken, upgradePlan);

export default router;
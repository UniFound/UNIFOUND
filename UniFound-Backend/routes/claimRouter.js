import express from "express";
import {
  createClaim,
  getClaims,
  getClaimById,
  updateClaim,
  deleteClaim,
  updateClaimStatus,
} from "../controllers/claimController.js";

const router = express.Router();

// 🟢 Create a new claim
router.post("/", createClaim);

// 🟢 Get all claims (optional userId query param)
router.get("/", getClaims);

// 🟢 Get single claim by ID
router.get("/:id", getClaimById);

// 🟢 Update claim by ID
router.put("/:id", updateClaim);

// 🟢 Permanent delete claim by ID
router.delete("/:id", deleteClaim);

router.patch("/:id/status", updateClaimStatus);

export default router;
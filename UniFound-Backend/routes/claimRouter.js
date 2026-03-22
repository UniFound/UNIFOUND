import express from "express";
import {
  createClaim,
  getAllClaims,
  getUserClaims,
  getItemClaims,
  updateClaim,
  approveClaim,
  rejectClaim,
  deleteClaim
} from "../controllers/claimController.js";

const claimRouter = express.Router();

claimRouter.post("/", createClaim);
claimRouter.get("/", getAllClaims);
claimRouter.get("/user/:userId", getUserClaims);
claimRouter.get("/item/:itemId", getItemClaims);
claimRouter.put("/:id", updateClaim);
claimRouter.put("/:id/approve", approveClaim);
claimRouter.put("/:id/reject", rejectClaim);
claimRouter.delete("/:id", deleteClaim);

export default claimRouter;
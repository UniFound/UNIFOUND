import mongoose from "mongoose";
import Claim from "../models/claim.js";
import User from "../models/user.js";
import Item from "../models/item.js";

// 🔹 Create a new claim with auto-generated claimId (CLAIM001, CLAIM002…)
export const createClaim = async (req, res) => {
  try {
    const {
      itemId,
      userId, // This is coming from localStorage (e.g., "USER001")
      description,
      evidenceText,
      evidenceImage,
      contactNumber,
      email,
      meetingLocation,
      meetingTime,
    } = req.body;

    // 1. Validate itemId (Assuming itemId is a standard MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: "Invalid itemId" });
    }

    // 2. Check if item exists using findById
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // 3. Check if user exists using the CUSTOM userId field (not _id)
    // We remove the ObjectId validation here because your userId is a custom string.
    const user = await User.findOne({ userId: userId }); 
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔹 Generate custom claimId
    const count = await Claim.countDocuments();
    const customClaimId = `CLAIM${(count + 1).toString().padStart(3, "0")}`;

    const newClaim = new Claim({
      claimId: customClaimId,
      itemId,
      userId: user._id, // Store the actual MongoDB _id for population to work later
      description,
      evidenceText,
      evidenceImage,
      contactNumber,
      email,
      meetingLocation,
      meetingTime,
      status: "Pending",
      history: [{ status: "Pending", updatedBy: user._id, note: "Claim created" }],
    });

    const savedClaim = await newClaim.save();
    res.status(201).json(savedClaim);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating claim", error });
  }
};

// 🔹 Get all claims (admin or user-specific)
export const getClaims = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;

    const claims = await Claim.find(filter)
      .populate("itemId")
      .populate("userId")
      .sort({ createdAt: -1 });

    res.status(200).json(claims);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching claims", error });
  }
};

// 🔹 Get single claim by ID
export const getClaimById = async (req, res) => {
  try {
    const { id } = req.params;
    const claim = await Claim.findById(id)
      .populate("itemId")
      .populate("userId");
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    res.status(200).json(claim);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching claim", error });
  }
};

// 🔹 Update claim (status, evidence, admin note)
export const updateClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote, updatedBy, evidenceImage, evidenceText } = req.body;

    const claim = await Claim.findById(id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    if (status) claim.status = status;
    if (adminNote) claim.adminNote = adminNote;
    if (evidenceImage) claim.evidenceImage = evidenceImage;
    if (evidenceText) claim.evidenceText = evidenceText;

    if (status || adminNote) {
      claim.history.push({
        status: claim.status,
        updatedBy,
        note: adminNote || `Status updated to ${claim.status}`,
      });
    }

    const updatedClaim = await claim.save();
    res.status(200).json(updatedClaim);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating claim", error });
  }
};

// 🔹 Permanent delete
export const deleteClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClaim = await Claim.findByIdAndDelete(id);
    if (!deletedClaim) return res.status(404).json({ message: "Claim not found" });

    res.status(200).json({ message: "Claim permanently deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting claim", error });
  }
};
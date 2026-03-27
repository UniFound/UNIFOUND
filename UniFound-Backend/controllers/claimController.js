import mongoose from "mongoose";
import Claim from "../models/claim.js";
import Item from "../models/item.js";
import User from "../models/user.js"; 

// 1. Create a new claim
export const createClaim = async (req, res) => {
  try {
    const { itemId, userId, description, evidenceText, evidenceImage, contactNumber, email, meetingLocation, meetingTime } = req.body;

    // Check if user exists using custom userId (String)
    const userExists = await User.findOne({ userId: userId });
    if (!userExists) {
      return res.status(404).json({ success: false, message: "User not found with this ID" });
    }

    // Check if item exists using custom itemId (String)
    const itemExists = await Item.findOne({ itemId: itemId });
    if (!itemExists) {
      return res.status(404).json({ success: false, message: "Item not found with this ID" });
    }

    // Generate unique claimId
    const count = await Claim.countDocuments({});
    const generatedId = `CLAIM${(count + 1).toString().padStart(3, '0')}`;

    const newClaim = new Claim({
      claimId: generatedId,
      itemId: itemId, // Custom String ID
      userId: userId, // Custom String ID
      description,
      evidenceText,
      evidenceImage,
      contactNumber,
      email,
      meetingLocation,
      meetingTime,
      status: "Pending"
    });

    const savedClaim = await newClaim.save();
    res.status(201).json({ success: true, message: "Claim submitted successfully", data: savedClaim });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating claim", error: error.message });
  }
};

// 2. Get all claims (with manual lookup for Item and User)
export const getClaims = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = { isDeleted: false };
    if (userId) filter.userId = userId;

    const claims = await Claim.find(filter).sort({ createdAt: -1 });

    // Manually attach item and user details for each claim
    const enrichedClaims = await Promise.all(claims.map(async (claim) => {
      const itemDetails = await Item.findOne({ itemId: claim.itemId });
      const userDetails = await User.findOne({ userId: claim.userId }).select("-password"); // Password එක එවන්න එපා
      
      return { 
        ...claim._doc, 
        item: itemDetails,
        user: userDetails
      };
    }));

    res.status(200).json({ success: true, count: enrichedClaims.length, data: enrichedClaims });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching claims", error: error.message });
  }
};

// 3. Get single claim by custom claimId
export const getClaimById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const claim = await Claim.findOne({ claimId: id });
    if (!claim) return res.status(404).json({ success: false, message: `Claim ${id} not found` });

    const itemDetails = await Item.findOne({ itemId: claim.itemId });
    const userDetails = await User.findOne({ userId: claim.userId }).select("-password");

    res.status(200).json({ 
      success: true, 
      data: {
        ...claim._doc,
        item: itemDetails,
        user: userDetails
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. Update claim by claimId
export const updateClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedClaim = await Claim.findOneAndUpdate(
      { claimId: id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedClaim) return res.status(404).json({ success: false, message: "Claim not found" });

    res.status(200).json({ success: true, message: "Claim updated", data: updatedClaim });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 5. Delete claim by claimId
export const deleteClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClaim = await Claim.findOneAndDelete({ claimId: id });

    if (!deletedClaim) return res.status(404).json({ success: false, message: "Claim not found" });

    res.status(200).json({ success: true, message: "Claim permanently deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
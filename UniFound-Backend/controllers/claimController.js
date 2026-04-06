import mongoose from "mongoose";
import Claim from "../models/claim.js";
import User from "../models/user.js";
import Item from "../models/item.js";

// 🔹 Create a Claim
export const createClaim = async (req, res) => {
  try {
    const {
      itemId,
      userId, 
      lostItemId, 
      description,
      evidenceText,
      evidenceImage,
      contactNumber,
      email,
      meetingLocation,
      meetingTime,
      category, // 👈 අලුතින් එකතු කළා
      color,    // 👈 අලුතින් එකතු කළා
    } = req.body;

    console.log("➡️ [Backend Triggered] Data received for Item:", itemId);

    // 1. Validate itemId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      console.log("❌ Invalid ObjectId format for itemId:", itemId);
      return res.status(400).json({ message: "Invalid itemId format" });
    }

    // 2. DB එකේ Item එක හොයනවා
    const item = await Item.findById(itemId);
    if (!item) {
      console.log("❌ Item NOT found for ID:", itemId);
      return res.status(422).json({ message: "Item not found in DB!" });
    }

    // 3. User ව හොයනවා
    const user = await User.findOne({ userId: userId }); 
    if (!user) {
      console.log("❌ User NOT found for ID:", userId);
      return res.status(422).json({ message: "User not found in DB!" });
    }

    // 🔹 Generate custom claimId
    const count = await Claim.countDocuments();
    const customClaimId = `CLAIM${(count + 1).toString().padStart(3, "0")}`;

    const newClaim = new Claim({
      claimId: customClaimId,
      itemId, 
      userId, 
      lostItemId: lostItemId || null, 
      description,
      evidenceText,
      evidenceImage,
      contactNumber,
      email,
      meetingLocation,
      meetingTime,
      category, // 👈 DB එකට save වෙනවා
      color,    // 👈 DB එකට save වෙනවා
      status: "Pending",
      history: [{ status: "Pending", updatedBy: user.userId, note: "Claim created" }],
    });

    const savedClaim = await newClaim.save();
    console.log("✅ Claim Saved Successfully:", savedClaim.claimId);
    res.status(201).json(savedClaim);
  } catch (error) {
    console.error("🔥 Error in createClaim:", error);
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
      .populate("lostItemId")  
      .lean()
      .sort({ createdAt: -1 });

    console.log(`[Claims found]: ${claims.length} for User: ${userId}`);

    const claimsWithDetails = await Promise.all(
      claims.map(async (claim) => {
        let userName = "Unknown User";
        
        if (claim.userId) {
          const userObj = await User.findOne({ userId: claim.userId }).lean();
          if (userObj) {
            userName = `${userObj.firstName} ${userObj.lastName}`;
          }
        }

        return {
          ...claim,
          userName, 
          itemData: claim.itemId || null, 
          lostItemData: claim.lostItemId || null 
        };
      })
    );

    res.status(200).json(claimsWithDetails);
  } catch (error) {
    console.error("Error in getClaims:", error);
    res.status(500).json({ message: "Error fetching claims", error });
  }
};

// 🔹 Get Claim by ID with Enhanced Auto-Matching
export const getClaimById = async (req, res) => {
  try {
    const { id } = req.params; 

    let claim;
    
    // 1. Claim එක හොයාගමු
    if (mongoose.Types.ObjectId.isValid(id)) {
      claim = await Claim.findById(id).populate("itemId").populate("lostItemId").lean();
    } else {
      claim = await Claim.findOne({ claimId: id }).populate("itemId").populate("lostItemId").lean();
    }

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    // 2. User ගේ නම ගන්නවා
    let userName = "Unknown User";
    if (claim.userId) {
      const userObj = await User.findOne({ userId: claim.userId }).lean();
      if (userObj) {
        userName = `${userObj.firstName} ${userObj.lastName}`;
      }
    }

    const currentItem = claim.itemId; // Claim කරලා තියෙන Found Item එක
    let autoMatches = [];
    let directMatchPercentage = 0;

    // 3. Auto-Matching Logic (Updated with new fields)
    if (currentItem) {
      const oppositeStatus = currentItem.status === "lost" ? "found" : "lost";
      const potentialMatches = await Item.find({ 
        status: oppositeStatus,
        isDeleted: false 
      }).lean();

      potentialMatches.forEach(item => {
        let score = 0;

        // 🌟 Score Calculation
        
        // Category එක match වෙනවා නම් (ප්‍රමුඛතාවය වැඩියි)
        const claimCategory = claim.category || currentItem.category;
        if (item.category === claimCategory) score += 50;
        
        // Color එක match වෙනවා නම්
        const claimColor = claim.color || currentItem.color;
        if (item.color && claimColor && item.color.toLowerCase() === claimColor.toLowerCase()) {
          score += 25; // Score points වැඩි කළා
        }

        // Location එක match වෙනවා නම්
        if (item.location === currentItem.location) score += 15;
        
        // එකම දවසේ නම්
        const date1 = new Date(item.createdAt).toDateString();
        const date2 = new Date(currentItem.createdAt).toDateString();
        if (date1 === date2) score += 10;

        // ලකුණු 50 ට වඩා වැඩි ඒවා match ලිස්ට් එකට දානවා
        if (score >= 50) {
          autoMatches.push({
            item,
            matchPercentage: score > 100 ? 100 : score // Max 100%
          });
        }

        // Claim එකේ lostItemId එකක් තිබ්බොත් direct match percentage එක ගන්නවා
        if (claim.lostItemId && claim.lostItemId._id.toString() === item._id.toString()) {
          directMatchPercentage = score > 100 ? 100 : score;
        }
      });

      // වැඩිම score තියෙන ඒවා මුලට දානවා
      autoMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
    }

    res.status(200).json({
      ...claim,
      userName,
      itemData: claim.itemId || null,
      lostItemData: claim.lostItemId || null,
      autoMatches,             
      directMatchPercentage      
    });

  } catch (error) {
    console.error("Error in getClaimById:", error);
    res.status(500).json({ message: "Error fetching claim details", error: error.message });
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

// 🔹 Update Claim Status
export const updateClaimStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status } = req.body; 

    const updatedClaim = await Claim.findByIdAndUpdate(
      id,
      { status: status },
      { new: true } 
    );

    if (!updatedClaim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    res.status(200).json(updatedClaim);
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
};
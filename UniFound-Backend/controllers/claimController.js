import mongoose from "mongoose";
import Claim from "../models/claim.js";
import User from "../models/user.js";
import Item from "../models/item.js";

// 🔹 Create a Claim
export const createClaim = async (req, res) => {
  console.log("🚀 [API CALL] createClaim started");

  try {
    // 1. Check if Body exists (බොහෝ විට මෙතැනදී req.body empty විය හැක)
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log("❌ Request body is empty!");
      return res.status(400).json({ message: "No data received in request body" });
    }

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
      category,
      color,
    } = req.body;

    // 2. Validate essential IDs
    if (!itemId || !userId) {
      console.log("❌ Missing required fields: itemId or userId");
      return res.status(400).json({ message: "itemId and userId are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      console.log("❌ Invalid itemId format:", itemId);
      return res.status(400).json({ message: "Invalid itemId format" });
    }

    // 3. Database Check for Item
    const item = await Item.findById(itemId);
    if (!item) {
      console.log("❌ Item not found in DB for ID:", itemId);
      return res.status(404).json({ message: "Item not found in database" });
    }

    // 4. Database Check for User
    const user = await User.findOne({
      $or: [
        { userId: userId },
        { _id: mongoose.Types.ObjectId.isValid(userId) ? userId : null }
      ]
    });

    if (!user) {
      console.log("❌ User not found in DB for ID:", userId);
      return res.status(404).json({ message: "User not found in database" });
    }

    // 5. Generate custom claimId
    const count = await Claim.countDocuments();
    const customClaimId = `CLAIM${(count + 1).toString().padStart(3, "0")}`;
    const finalUserId = user.userId || user._id.toString();

    // 6. Create Object
    const newClaim = new Claim({
      claimId: customClaimId,
      itemId,
      userId: finalUserId,
      lostItemId: (lostItemId && mongoose.Types.ObjectId.isValid(lostItemId)) ? lostItemId : null,
      description: description || "",
      evidenceText: evidenceText || "",
      evidenceImage: evidenceImage || "",
      contactNumber: contactNumber || "",
      email: email || "",
      meetingLocation: meetingLocation || "",
      meetingTime: meetingTime || "",
      category: category || item.category,
      color: color || item.color,
      status: "Pending",
      history: [{ 
        status: "Pending", 
        updatedBy: finalUserId, 
        note: "Claim created",
        timestamp: new Date()
      }],
    });

    // 7. Save to Database
    const savedClaim = await newClaim.save();
    console.log("✅ Claim Saved:", savedClaim.claimId);
    
    return res.status(201).json(savedClaim);

  } catch (error) {
    // ඉතාම පැහැදිලිව Error එක Terminal එකේ පෙන්වීමට:
    console.log("\n**************** ERROR REPORT ****************");
    console.error("Critical Error in createClaim:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    
    if (error.name === 'ValidationError') {
      console.error("❌ Validation Failed for following fields:");
      Object.keys(error.errors).forEach(key => {
        console.error(`-> ${key}: ${error.errors[key].message}`);
      });
    }
    console.log("**********************************************\n");

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      details: error.errors ? error.errors : null
    });
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

    const claimsWithDetails = await Promise.all(
      claims.map(async (claim) => {
        let userName = "Unknown User";
        if (claim.userId) {
          const userObj = await User.findOne({ 
            $or: [{ userId: claim.userId }, { _id: mongoose.Types.ObjectId.isValid(claim.userId) ? claim.userId : null }] 
          }).lean();
          if (userObj) userName = `${userObj.firstName} ${userObj.lastName}`;
        }
        return { ...claim, userName, itemData: claim.itemId || null, lostItemData: claim.lostItemId || null };
      })
    );

    res.status(200).json(claimsWithDetails);
  } catch (error) {
    res.status(500).json({ message: "Error fetching claims", error });
  }
};

// 🔹 Get Claim by ID with Auto-Matching
export const getClaimById = async (req, res) => {
  try {
    const { id } = req.params; 
    let claim;
    
    if (mongoose.Types.ObjectId.isValid(id)) {
      claim = await Claim.findById(id).populate("itemId").populate("lostItemId").lean();
    } else {
      claim = await Claim.findOne({ claimId: id }).populate("itemId").populate("lostItemId").lean();
    }

    if (!claim) return res.status(404).json({ message: "Claim not found" });

    let userName = "Unknown User";
    const userObj = await User.findOne({ 
      $or: [{ userId: claim.userId }, { _id: mongoose.Types.ObjectId.isValid(claim.userId) ? claim.userId : null }] 
    }).lean();
    if (userObj) userName = `${userObj.firstName} ${userObj.lastName}`;

    const currentItem = claim.itemId;
    let autoMatches = [];
    let directMatchPercentage = 0;

    if (currentItem) {
      const potentialMatches = await Item.find({ status: currentItem.status === "lost" ? "found" : "lost", isDeleted: false }).lean();
      potentialMatches.forEach(item => {
        let score = 0;
        const claimCategory = claim.category || currentItem.category;
        if (item.category === claimCategory) score += 50;
        const claimColor = claim.color || currentItem.color;
        if (item.color && claimColor && item.color.toLowerCase() === claimColor.toLowerCase()) score += 25;
        if (item.location === currentItem.location) score += 15;
        if (score >= 50) autoMatches.push({ item, matchPercentage: score > 100 ? 100 : score });
      });
      autoMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
    }

    res.status(200).json({ ...claim, userName, itemData: claim.itemId || null, autoMatches });
  } catch (error) {
    res.status(500).json({ message: "Error fetching claim details", error: error.message });
  }
};

// 🔹 Update claim
export const updateClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote, updatedBy, evidenceImage, evidenceText } = req.body;
    const claim = await Claim.findById(id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    if (status) claim.status = status;
    if (adminNote) claim.adminNote = adminNote;
    if (status || adminNote) {
      claim.history.push({ status: claim.status, updatedBy, note: adminNote || `Status updated to ${claim.status}` });
    }
    const updatedClaim = await claim.save();
    res.status(200).json(updatedClaim);
  } catch (error) {
    res.status(500).json({ message: "Error updating claim", error });
  }
};

// 🔹 Delete claim
export const deleteClaim = async (req, res) => {
  try {
    const deletedClaim = await Claim.findByIdAndDelete(req.params.id);
    if (!deletedClaim) return res.status(404).json({ message: "Claim not found" });
    res.status(200).json({ message: "Claim permanently deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting claim", error });
  }
};

// 🔹 Update Claim Status
export const updateClaimStatus = async (req, res) => {
  try {
    const updatedClaim = await Claim.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!updatedClaim) return res.status(404).json({ message: "Claim not found" });
    res.status(200).json(updatedClaim);
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
};
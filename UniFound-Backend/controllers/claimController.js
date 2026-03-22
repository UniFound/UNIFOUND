import Claim from "../models/claim.js";

// ✅ Create Claim
export const createClaim = async (req, res) => {
  try {
    const {
      itemId,
      userId,
      description,
      evidenceText,
      contactNumber,
      meetingLocation
    } = req.body;

    // 🔴 Basic validation
    if (!itemId || !userId || !description || !evidenceText || !contactNumber || !meetingLocation) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // 🔍 Check item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // ⚠️ Prevent duplicate claim (same user same item)
    const existingClaim = await Claim.findOne({ itemId, userId });
    if (existingClaim) {
      return res.status(400).json({ message: "You already claimed this item" });
    }

    // ✅ Create claim
    const claim = await Claim.create(req.body);

    res.status(201).json({
      message: "Claim submitted successfully",
      claim
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📄 Get All Claims (Admin)
export const getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ isDeleted: false })
      .populate("userId", "name email")
      .populate("itemId", "title category status");

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 👤 Get Claims by User
export const getUserClaims = async (req, res) => {
  try {
    const claims = await Claim.find({
      userId: req.params.userId,
      isDeleted: false
    }).populate("itemId", "title status");

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📦 Get Claims for an Item
export const getItemClaims = async (req, res) => {
  try {
    const claims = await Claim.find({
      itemId: req.params.itemId,
      isDeleted: false
    }).populate("userId", "name email");

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Approve Claim (Admin)
export const approveClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    claim.status = "Approved";
    await claim.save();

    res.json({ message: "Claim approved", claim });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ❌ Reject Claim (Admin)
export const rejectClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    claim.status = "Rejected";
    await claim.save();

    res.json({ message: "Claim rejected", claim });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✏️ Update Claim (User)
export const updateClaim = async (req, res) => {
  try {
    const updated = await Claim.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ❌ Soft Delete Claim
export const deleteClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    claim.isDeleted = true;
    await claim.save();

    res.json({ message: "Claim deleted (soft)" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
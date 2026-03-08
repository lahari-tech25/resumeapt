import User from "../models/User.js";

export const upgradePlan = async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.plan = "pro";

    await user.save();

    res.json({
      message: "Plan upgraded successfully",
      plan: user.plan
    });

  } catch (error) {

    console.error("Upgrade error:", error);

    res.status(500).json({
      message: "Failed to upgrade plan"
    });

  }

};
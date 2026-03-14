const Farmer = require("../models/Farmer");

const getPaymentSettings = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ farmerEmail: req.user.email });
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });
    return res.status(200).json({ payment: farmer.paymentSettings || {} });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updatePaymentSettings = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ farmerEmail: req.user.email });
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });
    const allowedFields = ["accountHolderName", "accountNumber", "bankName", "ifscCode", "upiId", "paymentGateway"];
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        farmer.paymentSettings = farmer.paymentSettings || {};
        farmer.paymentSettings[key] = req.body[key];
      }
    });
    await farmer.save();
    return res.status(200).json({ message: "Payment settings updated", payment: farmer.paymentSettings });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const submitFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    if (!feedback) return res.status(400).json({ message: "Feedback is required" });
    // Store feedback — for now just acknowledge
    console.log(`Feedback from ${req.user.email}: ${feedback}`);
    return res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getPaymentSettings, updatePaymentSettings, submitFeedback };
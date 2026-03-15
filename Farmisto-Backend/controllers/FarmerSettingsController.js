const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

const getPaymentSettings = asyncHandler(async (req, res) => {
  const farmer = await User.findOne({ email: req.user.email, role: "farmer" });
  if (!farmer) return res.status(404).json({ message: "Farmer not found" });
  return res.status(200).json({ payment: farmer.paymentSettings || {} });
});

const updatePaymentSettings = asyncHandler(async (req, res) => {
  const farmer = await User.findOne({ email: req.user.email, role: "farmer" });
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
});

const submitFeedback = asyncHandler(async (req, res) => {
  const { feedback } = req.body;
  if (!feedback) return res.status(400).json({ message: "Feedback is required" });
  console.log(`Feedback from ${req.user.email}: ${feedback}`);
  return res.status(200).json({ message: "Feedback submitted successfully" });
});

module.exports = { getPaymentSettings, updatePaymentSettings, submitFeedback };

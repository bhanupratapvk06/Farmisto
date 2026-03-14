const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error("Unhandled async error:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  });
};

module.exports = asyncHandler;

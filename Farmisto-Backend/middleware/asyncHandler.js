const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error("Unhandled async error:", err);
    const response = {
      message: "Internal server error",
      error: err.message,
    };
    if (err.code) response.code = err.code;
    if (err.keyValue) response.duplicateKey = err.keyValue;
    res.status(500).json(response);
  });
};

module.exports = asyncHandler;

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const FarmerRoutes = require("./routes/FarmerRoutes.js");
const UserRoutes = require("./routes/userRoutes.js");
const MarketRoutes = require("./routes/MarketRoutes.js");
const PaymentRoutes = require("./routes/PaymentRoutes.js");
const PromoRoutes = require("./routes/PromoRoutes.js")
const connectCloudinary = require("./config/cloudinary.js");
const MongooseConnect = require("./config/Db.js");
const CartRoutes = require('./routes/cartRoutes.js');

dotenv.config();

const PORT = process.env.PORT || 4000;

// Connect to Cloudinary and MongoDB
connectCloudinary();
MongooseConnect();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/',async(req,res) => {
  res.status(200).json({
    message: "Welcome to Farmisto API",
    success: true,
  });
})

// Routes
app.use("/farmer", FarmerRoutes);
app.use("/market", MarketRoutes);
app.use("/user", UserRoutes);
app.use("/cart", CartRoutes);
app.use('/payments',PaymentRoutes)
app.use("/promo",PromoRoutes);

app.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.status(200).json({
    message: "Logged out successfully",
    success: true,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

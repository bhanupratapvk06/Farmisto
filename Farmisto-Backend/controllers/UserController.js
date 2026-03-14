const User = require("../models/User");
const { GenerateToken } = require("../middleware/TokenAuth");
const Cart = require("../models/Cart");
const Farmer = require("../models/Farmer");
const Market = require("../models/Market");
const { hashPassword, comparePassword } = require("../middleware/hashing");
const asyncHandler = require("../middleware/asyncHandler");

const UserRegister = asyncHandler(async (req, res) => {
  const { userName, email, password, userLocation } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  const isUserAlreadyRegistered = await User.findOne({ email });
  if (isUserAlreadyRegistered) {
    return res.status(400).json({ message: "User already exists" });
  }

  const HashPassword = await hashPassword(password);
  const user = await User.create({
    userName,
    email,
    password: HashPassword,
    userLocation,
  });

  const token = GenerateToken(user);
  return res.status(201).json({ message: "User registered successfully", User: user, token });
});

const UserLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  const UserInDB = await User.findOne({ email });
  if (!UserInDB) {
    return res.status(400).json({ message: "User not exists" });
  }

  const isPasswordMatched = await comparePassword(password, UserInDB.password);
  if (!isPasswordMatched) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = GenerateToken(UserInDB);
  res.setHeader("Authorization", `Bearer ${token}`);
  return res.status(200).json({ message: "Login successful", token, user: UserInDB });
});

const BuyItem = asyncHandler(async (req, res) => {
  const { itemName, itemPrice, imageUrl, quantity, id, farmer, itemUnit } = req.body;
  if (!itemName || !itemPrice || !imageUrl || !quantity || !id || !farmer) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  const ItemToCart = await Cart.create({
    id,
    itemName,
    itemPrice,
    imageUrl,
    quantity,
    buyer: req.user.id,
    itemUnit,
    farmer: {
      id: farmer.id,
      name: farmer.name,
      email: farmer.email,
    },
  });

  return res.status(201).json({
    message: "Item added to cart",
    item: ItemToCart,
    buyer: { _id: req.user.id, name: req.user.name },
  });
});

const GetUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "No user id provided!" });
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }
  return res.status(200).json({ user });
});

const getFarmerByEmail = asyncHandler(async (req, res) => {
  const { farmerEmail } = req.body;
  if (!farmerEmail) {
    return res.status(400).json({ message: "No farmer email provided!" });
  }
  const farmer = await Farmer.findOne({ farmerEmail });
  if (!farmer) {
    return res.status(404).json({ message: "Farmer not found!" });
  }
  return res.status(200).json({ farmer });
});

const GetItemsByFarmerEmail = asyncHandler(async (req, res) => {
  const { farmerEmail } = req.body;
  if (!farmerEmail) {
    return res.status(400).json({ message: "No farmer email provided!" });
  }
  const items = await Market.find({ "seller.email": farmerEmail });
  if (!items.length) {
    return res.status(200).json({ message: "No items available!", items: [] });
  }
  return res.status(200).json({ message: "Items fetched successfully!", items });
});

module.exports = {
  UserRegister,
  UserLogin,
  BuyItem,
  GetUser,
  getFarmerByEmail,
  GetItemsByFarmerEmail,
};

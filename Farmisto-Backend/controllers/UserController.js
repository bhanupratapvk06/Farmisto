const User = require("../models/User");
const { GenerateToken } = require("../middleware/TokenAuth");
const Cart = require("../models/Cart");
const Market = require("../models/Market");
const { hashPassword, comparePassword } = require("../middleware/hashing");
const asyncHandler = require("../middleware/asyncHandler");
const { fetchLocation } = require("./GeoController");

const UserRegister = asyncHandler(async (req, res) => {
  const { userName, email, password, role, userLocation } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  const isUserAlreadyRegistered = await User.findOne({ email }).lean();
  if (isUserAlreadyRegistered) {
    return res.status(400).json({ message: "User already exists" });
  }

  const HashPassword = await hashPassword(password);

  const user = await User.create({
    userName,
    email,
    password: HashPassword,
    role: role || "consumer",
    userLocation: userLocation && userLocation.latitude ? userLocation : undefined,
  });

  // For farmers, fetch location asynchronously to get address details
  if (role === "farmer" && userLocation?.latitude && userLocation?.longitude) {
    fetchLocation(userLocation.latitude, userLocation.longitude)
      .then((GeoLocate) => {
        if (GeoLocate && GeoLocate.length > 0) {
          const addressArray = GeoLocate[0].formatted_address
            .split(",")
            .map((item) => item.trim());
          const len = addressArray.length;
          User.findByIdAndUpdate(user._id, {
            farmerCity: addressArray[len - 3],
            farmerStateZip: addressArray[len - 2],
            farmerAddress: GeoLocate[0].formatted_address,
            farmerCountry: addressArray[len - 1],
          }).catch((err) => console.error("Failed to update farmer location:", err));
        }
      })
      .catch((err) => console.error("Failed to fetch location:", err));
  }

  const token = GenerateToken(user);
  const { password: _, ...userWithoutPassword } = user.toObject();
  return res.status(201).json({
    message: "User registered successfully",
    user: userWithoutPassword,
    token,
    redirect: role === "farmer" ? "/farmer/dashboard" : "/",
  });
});

const UserLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  const userInDB = await User.findOne({ email }).lean();
  if (!userInDB) {
    return res.status(400).json({ message: "User not found" });
  }

  const isPasswordMatched = await comparePassword(password, userInDB.password);
  if (!isPasswordMatched) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = GenerateToken(userInDB);
  const { password: _, ...userWithoutPassword } = userInDB;
  res.setHeader("Authorization", `Bearer ${token}`);
  return res.status(200).json({
    message: "Login successful",
    token,
    user: userWithoutPassword,
    redirect: userInDB.role === "farmer" ? "/farmer/dashboard" : "/",
  });
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
  const user = await User.findById(id).lean();
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }
  const { password: _, ...userWithoutPassword } = user;
  return res.status(200).json({ user: userWithoutPassword });
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
  GetItemsByFarmerEmail,
};

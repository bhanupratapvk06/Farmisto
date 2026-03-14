const User = require("../models/User");
const { GenerateToken } = require("../middleware/TokenAuth");
const Cart = require("../models/Cart");
const Farmer = require("../models/Farmer");
const Market = require("../models/Market");
const { hashPassword, comparePassword } = require("../middleware/hashing");

const UserRegister = async (req, res) => {
  const { userName, email, password, userLocation } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  try {
    const isUserAlreadyRegistered = await User.findOne({ email });

    if (isUserAlreadyRegistered) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const HashPassword = await hashPassword(password);

    const user = await User.create({
      userName: userName,
      email: email,
      password: HashPassword,
      userLocation: userLocation,
    });

    res.status(200).json({ msg: "User registered successfully", User: user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const UserLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const UserInDB = await User.findOne({ email });

    if (!UserInDB) {
      return res.status(400).json({ msg: "User not exists" });
    }

    const isPasswordMatched = await comparePassword(
      password,
      UserInDB.password
    );

    if (!isPasswordMatched) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const token = GenerateToken(UserInDB);
    res.setHeader("Authorization", `Bearer ${token}`);
    return res.status(200).json({ msg: "Login successful", token , user: UserInDB });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const BuyItem = async (req, res) => {
  const { itemName, itemPrice, imageUrl, quantity,id,farmer,itemUnit} = req.body;
  if (!itemName || !itemPrice || !imageUrl || !quantity || !id || !farmer) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  try {
    const ItemToCart = await Cart.create({
      id: id,
      itemName: itemName,
      itemPrice: itemPrice,
      imageUrl: imageUrl,
      quantity: quantity,
      buyer: req.user.id,
      itemUnit:itemUnit,
      farmer: {
        id: farmer.id,
        name: farmer.name,
        email: farmer.email,
      },
    });
    console.log("Buy:", ItemToCart)

    return res.status(200).json({
      msg: "Item added to cart",
      item: ItemToCart,
      buyer: {
        _id: req.user.id,
        name: req.user.name,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error while adding item to cart", error: error.message });
  }
};

const GetUser = async(req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ msg: "No user id provided!" });
  }
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
  }
}

const getFarmerByEmail = async (req, res) => {
  const {farmerEmail} = req.body;
  if (!farmerEmail) {
    return res.status(400).json({ msg: "No farmer email provided!" });
  }
  try {
    const farmer = await Farmer.findOne({ farmerEmail: farmerEmail });
    if (!farmer) {
      return res.status(404).json({ msg: "Farmer not found!" });
    }
    return res.status(200).json({ farmer });
  } catch (error) {
    console.error(error, "Farmer fetching Failed!");
  }
};

const GetItemsByFarmerEmail = async (req, res) => {
  const {farmerEmail} = req.body;
  if (!farmerEmail) {
    return res.status(400).json({ msg: "No farmer email provided!" });
  }
  try {
    const items = await Market.find({"seller.email": farmerEmail});
    if (!items.length) {
      return res.status(200).json({ message: "No items available!" });
    }
    return res.status(200).json({ message: "Items fetched successfully!", items });
  } catch (error) {
    return res.status(500).json({ message: "Error while fetching items!", error: error.message });
  }
};

module.exports = {
  UserRegister,
  UserLogin,
  BuyItem,
  GetUser,
  getFarmerByEmail,
  GetItemsByFarmerEmail,
};

const { GenerateToken } = require("../middleware/TokenAuth.js");
const Farmer = require("../models/Farmer");
const { fetchLocation } = require("./GeoController");
const bcrypt = require("bcryptjs");
const Payment = require("../models/Payment");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const connectCloudinary = require("../config/cloudinary");
const { comparePassword, hashPassword } = require("../middleware/hashing.js");
const asyncHandler = require("../middleware/asyncHandler");
connectCloudinary();

const FarmerRegister = asyncHandler(async (req, res) => {
  const { farmerName, farmerEmail, farmerPassword, farmerLocation } = req.body;

  if (!farmerName || !farmerEmail || !farmerPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const isEmailRegistered = await Farmer.findOne({ farmerEmail });
  if (isEmailRegistered) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const hashedPassword = await hashPassword(farmerPassword);

  const GeoLocate = await fetchLocation(
    farmerLocation.latitude,
    farmerLocation.longitude
  );

  if (!GeoLocate || GeoLocate.length === 0) {
    return res.status(400).json({ message: "Invalid location details provided" });
  }

  const addressArray = GeoLocate[0].formatted_address
    .split(",")
    .map((item) => item.trim());
  const len = addressArray.length;
  const geoCity = addressArray[len - 3];
  const geoStateZip = addressArray[len - 2];
  const geoCountry = addressArray[len - 1];
  const geoAddress = GeoLocate[0].formatted_address;

  const farmer = await Farmer.create({
    farmerName,
    farmerEmail,
    farmerCity: geoCity,
    farmerStateZip: geoStateZip,
    farmerAddress: geoAddress,
    farmerCountry: geoCountry,
    farmerPassword: hashedPassword,
    farmerLocation,
  });

  return res.status(201).json({ message: "Farmer registered successfully", farmer });
});
const FarmerLogin = asyncHandler(async (req, res) => {
  const { farmerEmail, farmerPassword } = req.body;
  if (!farmerEmail || !farmerPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const farmer = await Farmer.findOne({ farmerEmail });
  if (!farmer) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const isMatch = await comparePassword(farmerPassword, farmer.farmerPassword);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const token = GenerateToken(farmer);
  res.setHeader("Authorization", `Bearer ${token}`);
  return res.status(200).json({ message: "Login successful", token });
});
const getProfile = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const farmer = await Farmer.findOne({ farmerEmail: email });
  if (!farmer) {
    return res.status(404).json({ message: "Farmer not found" });
  }
  return res.status(200).json({ farmer });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const fields = req.body;

  if (!fields && !req.file) {
    return res.status(400).json({ message: "No fields or file provided!" });
  }

  const profile = await Farmer.findOne({ farmerEmail: email });
  if (!profile) {
    return res.status(404).json({ message: "Farmer profile not found!" });
  }

  const validKeys = [
    "farmerName",
    "farmerMobile",
    "farmerPassword",
    "farmerAddress",
    "farmerCity",
    "farmerStateZip",
    "farmerCountry",
  ];

  Object.keys(fields).forEach((key) => {
    if (validKeys.includes(key)) {
      profile[key] = fields[key];
    }
  });

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "Farmer_Profiles",
    });
    profile.farmerProfilePhoto = result.secure_url;
  }

  await profile.save();

  return res.status(200).json({
    message: "Profile updated successfully",
    data: profile,
  });
});

const editPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both currentPassword and newPassword are required" });
  }

  const farmerId = req.user?.id;
  if (!farmerId) {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }

  const farmerProfile = await Farmer.findById(farmerId);
  if (!farmerProfile) {
    return res.status(404).json({ message: "Farmer not found" });
  }

  const isCorrectPassword = await bcrypt.compare(currentPassword, farmerProfile.farmerPassword);
  if (!isCorrectPassword) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  farmerProfile.farmerPassword = await bcrypt.hash(newPassword, 10);
  await farmerProfile.save();

  return res.status(200).json({
    message: `Password updated successfully for ${farmerProfile.farmerName}`,
  });
});

const GetSalesData = async (req, res) => {
  try {
    const payments = await Payment.find({
      orderStatus: "Delivered",
    });

    const salesData = {
      Weekly: [0, 0, 0, 0],
      Monthly: [0, 0, 0, 0],
      Yearly: [0, 0, 0, 0],
    };

    const currentDate = new Date();

    payments.forEach((payment) => {
      const orderDate = new Date(payment.createdAt);

      const weekDifference = Math.floor(
        (currentDate - orderDate) / (7 * 24 * 60 * 60 * 1000)
      );
      const monthDifference =
        currentDate.getMonth() -
        orderDate.getMonth() +
        12 * (currentDate.getFullYear() - orderDate.getFullYear());
      const yearDifference =
        currentDate.getFullYear() - orderDate.getFullYear();

      if (weekDifference < 4) {
        salesData.Weekly[3 - weekDifference] += payment.totalAmount;
      }

      if (monthDifference < 4) {
        salesData.Monthly[3 - monthDifference] += payment.totalAmount;
      }

      if (yearDifference < 4) {
        salesData.Yearly[3 - yearDifference] += payment.totalAmount;
      }
    });

    res.status(200).json(salesData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const GetDashboard = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ "farmers.email": req.user.email });
  const filtered = payments.filter((item) => item.cartItems != undefined);
  const allFilteredCartItems = filtered
    .flatMap((payment) => payment.cartItems)
    .filter((item) => item.itemUnit != undefined);

  const totalProduce = allFilteredCartItems.reduce((acc, cartItem) => {
    if (cartItem.itemUnit.unit) {
      if (!acc.unit) acc.unit = cartItem.itemUnit.unit;
      acc.amount = (acc.amount || 0) + cartItem.quantity;
    }
    return acc;
  }, {});

  const revenue = payments.reduce((acc, order) => {
    return order.orderStatus === "Delivered" ? acc + order.totalAmount : acc;
  }, 0);

  const transactions = payments.filter((order) => order.orderStatus === "Delivered");

  const userReached = payments.reduce((acc, order) => {
    if (!acc[order.buyer.email]) acc[order.buyer.email] = true;
    return acc;
  }, {});

  const coordinates = await Promise.all(
    transactions.map(async (payment) => {
      const user = await User.findOne({ email: payment.buyer.email });
      if (user && user.userLocation) {
        return { email: payment.buyer.name, location: user.userLocation };
      }
      return null;
    })
  );

  const validCoordinates = coordinates.filter(
    (loc) => loc !== null && loc.location.latitude !== undefined && loc.location.longitude !== undefined
  );
  const uniqueCoordinates = [
    ...new Set(validCoordinates.map((u) => JSON.stringify(u.location))),
  ].map((loc) => JSON.parse(loc));

  const validUniqueCoordinates = uniqueCoordinates.filter(
    (loc) => loc.latitude !== null && loc.longitude !== null
  );

  const periods = { weeks: 6, months: 12, years: 5 };
  const salesData = {
    Weekly: Array(periods.weeks).fill(0),
    Monthly: Array(periods.months).fill(0),
    Yearly: Array(periods.years).fill(0),
  };
  const currentDate = new Date();

  transactions.forEach((payment) => {
    const orderDate = new Date(payment.createdAt);
    const weekDiff = Math.floor((currentDate - orderDate) / (7 * 24 * 60 * 60 * 1000));
    const monthDiff = currentDate.getMonth() - orderDate.getMonth() + 12 * (currentDate.getFullYear() - orderDate.getFullYear());
    const yearDiff = currentDate.getFullYear() - orderDate.getFullYear();
    if (weekDiff < periods.weeks) salesData.Weekly[periods.weeks - 1 - weekDiff] += payment.totalAmount;
    if (monthDiff < periods.months) salesData.Monthly[periods.months - 1 - monthDiff] += payment.totalAmount;
    if (yearDiff < periods.years) salesData.Yearly[periods.years - 1 - yearDiff] += payment.totalAmount;
  });

  const dashData = {
    produceCount: totalProduce,
    revenue,
    totalTransactions: transactions.length,
    userReach: Object.keys(userReached).length,
    salesData,
    transactions,
    coordinates: validUniqueCoordinates,
  };

  return res.status(200).json({
    message: "Dashboard Fetched Successfully",
    dashboard: dashData,
  });
});

const GetFarmerLocation = asyncHandler(async (req, res) => {
  const farmer = await Farmer.findOne({ farmerEmail: req.user.email });
  if (!farmer) {
    return res.status(404).json({ message: "Farmer not found" });
  }
  return res.status(200).json({
    farmerLocation: {
      latitude: farmer.farmerLocation?.latitude,
      longitude: farmer.farmerLocation?.longitude,
    },
  });
});

// const loggedOut = async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       return res.status(400).json({ msg: "No token provided" });
//     }
//     // clear the token
//     res.setHeader("Authorization", "");
//     return res.status(200).json({ msg: "Logout successful" });
//   } catch (err) {
//     console.error("Error in logout:", err);
//     return res.status(500).json({ msg: "Server Error" });
//   }
// };

module.exports = {
  FarmerRegister,
  FarmerLogin,
  getProfile,
  updateProfile,
  editPassword,
  GetDashboard,
  GetFarmerLocation,
  // loggedOut,
};

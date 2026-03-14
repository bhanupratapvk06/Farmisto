const { GenerateToken } = require("../middleware/TokenAuth.js");
const Farmer = require("../models/Farmer");
const { fetchLocation } = require("./GeoController");
const bcrypt = require("bcryptjs");
const Payment = require("../models/Payment");

const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const connectCloudinary = require("../config/cloudinary");
const { comparePassword, hashPassword } = require("../middleware/hashing.js");
connectCloudinary();

const FarmerRegister = async (req, res) => {
  const { farmerName, farmerEmail, farmerPassword, farmerLocation } = req.body;

  try {
    if (!farmerName || !farmerEmail || !farmerPassword) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const isEmailRegistered = await Farmer.findOne({ farmerEmail });
    if (isEmailRegistered) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const hashedPassword = await hashPassword(farmerPassword);

    const GeoLocate = await fetchLocation(
      farmerLocation.latitude,
      farmerLocation.longitude
    );

    if (!GeoLocate || GeoLocate.length === 0) {
      return res.status(400).json({ msg: "Invalid location details provided" });
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

    res.status(200).json({ message: "Farmer registered successfully", farmer });
  } catch (err) {
    console.error("Error in farmer registration:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};
const FarmerLogin = async (req, res) => {
  const { farmerEmail, farmerPassword } = req.body;
  if (!farmerEmail || !farmerPassword) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  try {
    const farmer = await Farmer.findOne({ farmerEmail });
    if (!farmer) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await comparePassword(
      farmerPassword,
      farmer.farmerPassword
    );
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const token = GenerateToken(farmer);
    res.setHeader("Authorization", `Bearer ${token}`);
    return res.status(200).json({ msg: "Login successful", token });
  } catch (err) {
    console.error("Error in farmer login:", err);
    return res.status(500).json({ msg: "Server Error" });
  }
};
const getProfile = async (req, res) => {
  try {
    const { email } = req.user;
    const farmer = await Farmer.findOne({ farmerEmail: email });
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    return res.status(200).json({ farmer });
  } catch (err) {
    res.status(400).json({
      "Error fetching Profile": err.message,
    });
  }
};

const updateProfile = async (req, res) => {
  const { email } = req.user;
  const fields = req.body;

  if (!fields && !req.file) {
    return res.status(400).json({ message: "No fields or file provided!" });
  }

  try {
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

    res.status(200).json({
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (err) {
    console.error("Error updating profile: ", err);
    res.status(500).json({
      message: "Unable to edit the profile due to server error",
      error: err.message,
    });
  }
};

const editPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const farmerId = req.person?._id;
    if (!farmerId) {
      return new Error("Not a valid User");
    }
    const farmerProfile = await Farmer.findById(farmerId);
    if (!farmerProfile) {
      return new Error("User Not Found");
    }
    const isCorrectPassword = await bcrypt.compare(
      currentPassword,
      farmerProfile?.farmerPassword
    );
    if (!isCorrectPassword) {
      return new Error("Invalid Password");
    }
    const newHashPassword = await bcrypt.hash(newPassword, 10);
    farmerProfile.farmerPassword = newHashPassword;
    await farmerProfile.save();
    res.status(200).json({
      message: `${farmerProfile.farmerName} Password updated Successfuly`,
    });
  } catch (e) {
    res.status(401).send("Not Editable !!1 " + e);
  }
};

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

const GetDashboard = async (req, res) => {
  try {
    const payments = await Payment.find({ "farmers.email": req.user.email });
    const filtered = payments.filter((item) => item.cartItems != undefined);
    const allFilteredCartItems = filtered
      .flatMap((payment) => payment.cartItems)
      .filter((item) => item.itemUnit != undefined);

    const totalProduce = allFilteredCartItems.reduce((acc, cartItem) => {
      if (cartItem.itemUnit.unit) {
        if (!acc.unit) {
          acc.unit = cartItem.itemUnit.unit;
        }
        acc.amount = (acc.amount || 0) + cartItem.quantity;
      }
      return acc;
    }, {});

    const revenue = payments.reduce((acc, order) => {
      return order.orderStatus === "Delivered" ? acc + order.totalAmount : acc;
    }, 0);

    const transactions = payments.filter(
      (order) => order.orderStatus === "Delivered"
    );

    const userReached = payments.reduce((acc, order) => {
      if (!acc[order.buyer.email]) {
        acc[order.buyer.email] = true;
      }
      return acc;
    }, {});

    const coordinates = await Promise.all(
      transactions.map(async (payment) => {
        const user = await User.findOne({ email: payment.buyer.email });
        if (user && user.userLocation) {
          return { email: payment.buyer.name, location: user.userLocation };
        } else {
          return null;
        }
      })
    );

    const validCoordinates = coordinates.filter(
      (location) =>
        location !== null &&
        location.location.latitude !== undefined &&
        location.location.longitude !== undefined
    );
    const uniqueCoordinates = [
      ...new Set(validCoordinates.map((user) => JSON.stringify(user.location))),
    ].map((location) => JSON.parse(location));

    const validUniqueCoordinates = uniqueCoordinates.filter(
      (loc) => loc.latitude !== null && loc.longitude !== null
    );

    const periods = {
      weeks: 6,
      months: 12,
      years: 5,
    };

    const salesData = {
      Weekly: Array(periods.weeks).fill(0),
      Monthly: Array(periods.months).fill(0),
      Yearly: Array(periods.years).fill(0),
    };

    const currentDate = new Date();

    transactions.forEach((payment) => {
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

    const dashData = {
      produceCount: totalProduce,
      revenue: revenue,
      totalTransactions: transactions.length,
      userReach: Object.keys(userReached).length,
      salesData: salesData,
      transactions: transactions,
      coordinates: validUniqueCoordinates,
    };

    return res.json({
      message: "Dashboard Fetched Successfully",
      dashboard: dashData,
    });
  } catch (error) {
    console.error("Error in dashboard:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const GetFarmerLocation = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error in getting farmer location:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

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

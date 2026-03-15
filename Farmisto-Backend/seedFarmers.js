const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config({ path: require('path').join(__dirname, '.env') });

const User = require("./models/User");

const farmers = [
  {
    userName: "farmer6",
    email: "farmer6@gmail.com",
    password: "farmer6",
    role: "farmer",
    userLocation: { latitude: 28.5100, longitude: 77.5500 },
    farmerProfilePhoto: "default_farmer_profile.jpg",
    farmerMobile: 9000000006,
    farmerAddress: "14 Knowledge Park",
    farmerCity: "Greater Noida",
    farmerStateZip: "Uttar Pradesh, 201310",
    farmerCountry: "India",
    paymentSettings: {
      accountHolderName: "Farmer Six",
      accountNumber: "123456789006",
      bankName: "State Bank of India",
      ifscCode: "SBIN0005678",
      upiId: "farmer6@upi",
      paymentGateway: "Razorpay",
    },
  },
  {
    userName: "farmer7",
    email: "farmer7@gmail.com",
    password: "farmer7",
    role: "farmer",
    userLocation: { latitude: 28.3500, longitude: 77.5000 },
    farmerProfilePhoto: "default_farmer_profile.jpg",
    farmerMobile: 9000000007,
    farmerAddress: "28 Dadri Road",
    farmerCity: "Dadri",
    farmerStateZip: "Uttar Pradesh, 203207",
    farmerCountry: "India",
    paymentSettings: {
      accountHolderName: "Farmer Seven",
      accountNumber: "123456789007",
      bankName: "Punjab National Bank",
      ifscCode: "PUNB0005678",
      upiId: "farmer7@upi",
      paymentGateway: "PhonePe",
    },
  },
  {
    userName: "farmer8",
    email: "farmer8@gmail.com",
    password: "farmer8",
    role: "farmer",
    userLocation: { latitude: 28.5800, longitude: 77.3800 },
    farmerProfilePhoto: "default_farmer_profile.jpg",
    farmerMobile: 9000000008,
    farmerAddress: "5 Sector 62",
    farmerCity: "Noida",
    farmerStateZip: "Uttar Pradesh, 201309",
    farmerCountry: "India",
    paymentSettings: {
      accountHolderName: "Farmer Eight",
      accountNumber: "123456789008",
      bankName: "HDFC Bank",
      ifscCode: "HDFC0005678",
      upiId: "farmer8@upi",
      paymentGateway: "Google Pay",
    },
  },
  {
    userName: "farmer9",
    email: "farmer9@gmail.com",
    password: "farmer9",
    role: "farmer",
    userLocation: { latitude: 28.4600, longitude: 77.6300 },
    farmerProfilePhoto: "default_farmer_profile.jpg",
    farmerMobile: 9000000009,
    farmerAddress: "19 Surajpur Site",
    farmerCity: "Greater Noida",
    farmerStateZip: "Uttar Pradesh, 201306",
    farmerCountry: "India",
    paymentSettings: {
      accountHolderName: "Farmer Nine",
      accountNumber: "123456789009",
      bankName: "ICICI Bank",
      ifscCode: "ICIC0005678",
      upiId: "farmer9@upi",
      paymentGateway: "Razorpay",
    },
  },
  {
    userName: "farmer10",
    email: "farmer10@gmail.com",
    password: "farmer10",
    role: "farmer",
    userLocation: { latitude: 19.0760, longitude: 72.8777 },
    farmerProfilePhoto: "default_farmer_profile.jpg",
    farmerMobile: 9000000010,
    farmerAddress: "12 MG Road",
    farmerCity: "Mumbai",
    farmerStateZip: "Maharashtra, 400001",
    farmerCountry: "India",
    paymentSettings: {
      accountHolderName: "Farmer Ten",
      accountNumber: "123456789010",
      bankName: "State Bank of India",
      ifscCode: "SBIN0001234",
      upiId: "farmer10@upi",
      paymentGateway: "Razorpay",
    },
  },
  {
    userName: "farmer11",
    email: "farmer11@gmail.com",
    password: "farmer11",
    role: "farmer",
    userLocation: { latitude: 28.6139, longitude: 77.2090 },
    farmerProfilePhoto: "default_farmer_profile.jpg",
    farmerMobile: 9000000011,
    farmerAddress: "45 Connaught Place",
    farmerCity: "New Delhi",
    farmerStateZip: "Delhi, 110001",
    farmerCountry: "India",
    paymentSettings: {
      accountHolderName: "Farmer Eleven",
      accountNumber: "123456789011",
      bankName: "Punjab National Bank",
      ifscCode: "PUNB0001234",
      upiId: "farmer11@upi",
      paymentGateway: "Razorpay",
    },
  },
  {
    userName: "farmer12",
    email: "farmer12@gmail.com",
    password: "farmer12",
    role: "farmer",
    userLocation: { latitude: 12.9716, longitude: 77.5946 },
    farmerProfilePhoto: "default_farmer_profile.jpg",
    farmerMobile: 9000000012,
    farmerAddress: "78 Brigade Road",
    farmerCity: "Bangalore",
    farmerStateZip: "Karnataka, 560001",
    farmerCountry: "India",
    paymentSettings: {
      accountHolderName: "Farmer Twelve",
      accountNumber: "123456789012",
      bankName: "HDFC Bank",
      ifscCode: "HDFC0001234",
      upiId: "farmer12@upi",
      paymentGateway: "PhonePe",
    },
  },
  {
    userName: "farmer13",
    email: "farmer13@gmail.com",
    password: "farmer13",
    role: "farmer",
    userLocation: { latitude: 13.0827, longitude: 80.2707 },
    farmerProfilePhoto: "default_farmer_profile.jpg",
    farmerMobile: 9000000013,
    farmerAddress: "23 Anna Salai",
    farmerCity: "Chennai",
    farmerStateZip: "Tamil Nadu, 600002",
    farmerCountry: "India",
    paymentSettings: {
      accountHolderName: "Farmer Thirteen",
      accountNumber: "123456789013",
      bankName: "Indian Bank",
      ifscCode: "IDIB0001234",
      upiId: "farmer13@upi",
      paymentGateway: "Google Pay",
    },
  },
  {
    userName: "farmer14",
    email: "farmer14@gmail.com",
    password: "farmer14",
    role: "farmer",
    userLocation: { latitude: 22.5726, longitude: 88.3639 },
    farmerProfilePhoto: "default_farmer_profile.jpg",
    farmerMobile: 9000000014,
    farmerAddress: "56 Park Street",
    farmerCity: "Kolkata",
    farmerStateZip: "West Bengal, 700016",
    farmerCountry: "India",
    paymentSettings: {
      accountHolderName: "Farmer Fourteen",
      accountNumber: "123456789014",
      bankName: "Bank of Baroda",
      ifscCode: "BARB0001234",
      upiId: "farmer14@upi",
      paymentGateway: "Razorpay",
    },
  },
  {
    userName: "farmer15",
    email: "farmer15@gmail.com",
    password: "farmer15",
    role: "farmer",
    userLocation: { latitude: 17.3850, longitude: 78.4867 },
    farmerProfilePhoto: "default_farmer_profile.jpg",
    farmerMobile: 9000000015,
    farmerAddress: "89 Banjara Hills",
    farmerCity: "Hyderabad",
    farmerStateZip: "Telangana, 500034",
    farmerCountry: "India",
    paymentSettings: {
      accountHolderName: "Farmer Fifteen",
      accountNumber: "123456789015",
      bankName: "ICICI Bank",
      ifscCode: "ICIC0001234",
      upiId: "farmer15@upi",
      paymentGateway: "PhonePe",
    },
  },
  {
    userName: "farmer16",
    email: "farmer16@gmail.com",
    password: "farmer16",
    role: "farmer",
    userLocation: { latitude: 18.5204, longitude: 73.8567 },
    farmerProfilePhoto: "default_farmer_profile.jpg",
    farmerMobile: 9000000016,
    farmerAddress: "34 FC Road",
    farmerCity: "Pune",
    farmerStateZip: "Maharashtra, 411004",
    farmerCountry: "India",
    paymentSettings: {
      accountHolderName: "Farmer Sixteen",
      accountNumber: "123456789016",
      bankName: "Axis Bank",
      ifscCode: "UTIB0001234",
      upiId: "farmer16@upi",
      paymentGateway: "Google Pay",
    },
  },
  {
    userName: "farmer17",
    email: "farmer17@gmail.com",
    password: "farmer17",
    role: "farmer",
    userLocation: { latitude: 23.0225, longitude: 72.5714 },
    farmerProfilePhoto: "default_farmer_profile.jpg",
    farmerMobile: 9000000017,
    farmerAddress: "67 CG Road",
    farmerCity: "Ahmedabad",
    farmerStateZip: "Gujarat, 380009",
    farmerCountry: "India",
    paymentSettings: {
      accountHolderName: "Farmer Seventeen",
      accountNumber: "123456789017",
      bankName: "Kotak Mahindra Bank",
      ifscCode: "KKBK0001234",
      upiId: "farmer17@upi",
      paymentGateway: "Razorpay",
    },
  },
  {
    userName: "farmer18",
    email: "farmer18@gmail.com",
    password: "farmer18",
    role: "farmer",
    userLocation: { latitude: 26.9124, longitude: 75.7873 },
    farmerProfilePhoto: "default_farmer_profile.jpg",
    farmerMobile: 9000000018,
    farmerAddress: "90 MI Road",
    farmerCity: "Jaipur",
    farmerStateZip: "Rajasthan, 302001",
    farmerCountry: "India",
    paymentSettings: {
      accountHolderName: "Farmer Eighteen",
      accountNumber: "123456789018",
      bankName: "Union Bank of India",
      ifscCode: "UBIN0001234",
      upiId: "farmer18@upi",
      paymentGateway: "PhonePe",
    },
  },
  {
    userName: "farmer19",
    email: "farmer19@gmail.com",
    password: "farmer19",
    role: "farmer",
    userLocation: { latitude: 9.9312, longitude: 76.2673 },
    farmerProfilePhoto: "default_farmer_profile.jpg",
    farmerMobile: 9000000019,
    farmerAddress: "11 MG Road",
    farmerCity: "Kochi",
    farmerStateZip: "Kerala, 682001",
    farmerCountry: "India",
    paymentSettings: {
      accountHolderName: "Farmer Nineteen",
      accountNumber: "123456789019",
      bankName: "Federal Bank",
      ifscCode: "FDRL0001234",
      upiId: "farmer19@upi",
      paymentGateway: "Google Pay",
    },
  },
  {
    userName: "farmer20",
    email: "farmer20@gmail.com",
    password: "farmer20",
    role: "farmer",
    userLocation: { latitude: 15.2993, longitude: 74.1240 },
    farmerProfilePhoto: "default_farmer_profile.jpg",
    farmerMobile: 9000000020,
    farmerAddress: "22 Panjim Market Road",
    farmerCity: "Panaji",
    farmerStateZip: "Goa, 403001",
    farmerCountry: "India",
    paymentSettings: {
      accountHolderName: "Farmer Twenty",
      accountNumber: "123456789020",
      bankName: "Canara Bank",
      ifscCode: "CNRB0001234",
      upiId: "farmer20@upi",
      paymentGateway: "Razorpay",
    },
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Hash passwords before inserting
    for (const farmer of farmers) {
      farmer.password = await bcrypt.hash(farmer.password, 10);
    }

    // Use upsert to avoid duplicates if re-run
    let inserted = 0;
    let skipped = 0;
    for (const farmer of farmers) {
      const existing = await User.findOne({ email: farmer.email });
      if (existing) {
        console.log(`Skipped ${farmer.email} (already exists)`);
        skipped++;
        continue;
      }
      await User.create(farmer);
      console.log(`Inserted ${farmer.email}`);
      inserted++;
    }

    console.log(`\nDone: ${inserted} inserted, ${skipped} skipped`);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();

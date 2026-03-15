const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: require('path').join(__dirname, '.env') });

const Market = require("./models/Market");
const User = require("./models/User");

const ITEM_IMAGES = {
  Vegetables: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
  Fruits: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400",
  Nuts: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400",
  Dairy: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400",
  Spices: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400",
  Pulses: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400",
};

const CATALOG = {
  Vegetables: [
    { name: "Tomato", price: 40, qty: 100, unitVal: 1, unit: "kg" },
    { name: "Potato", price: 25, qty: 200, unitVal: 1, unit: "kg" },
    { name: "Onion", price: 35, qty: 150, unitVal: 1, unit: "kg" },
    { name: "Carrot", price: 50, qty: 80, unitVal: 500, unit: "g" },
    { name: "Spinach", price: 30, qty: 60, unitVal: 250, unit: "g" },
    { name: "Cabbage", price: 28, qty: 90, unitVal: 1, unit: "kg" },
    { name: "Cauliflower", price: 35, qty: 70, unitVal: 1, unit: "kg" },
    { name: "Brinjal", price: 45, qty: 85, unitVal: 1, unit: "kg" },
    { name: "Lady Finger", price: 55, qty: 75, unitVal: 500, unit: "g" },
    { name: "Capsicum", price: 60, qty: 65, unitVal: 500, unit: "g" },
  ],
  Fruits: [
    { name: "Mango", price: 120, qty: 50, unitVal: 1, unit: "kg" },
    { name: "Banana", price: 50, qty: 100, unitVal: 1, unit: "kg" },
    { name: "Apple", price: 180, qty: 60, unitVal: 1, unit: "kg" },
    { name: "Orange", price: 80, qty: 90, unitVal: 1, unit: "kg" },
    { name: "Papaya", price: 40, qty: 70, unitVal: 1, unit: "kg" },
    { name: "Guava", price: 60, qty: 55, unitVal: 1, unit: "kg" },
    { name: "Pomegranate", price: 200, qty: 40, unitVal: 1, unit: "kg" },
    { name: "Watermelon", price: 25, qty: 80, unitVal: 1, unit: "kg" },
    { name: "Grapes", price: 140, qty: 45, unitVal: 500, unit: "g" },
    { name: "Litchi", price: 160, qty: 35, unitVal: 500, unit: "g" },
  ],
  Nuts: [
    { name: "Almonds", price: 800, qty: 30, unitVal: 500, unit: "g" },
    { name: "Cashews", price: 900, qty: 25, unitVal: 500, unit: "g" },
    { name: "Walnuts", price: 750, qty: 35, unitVal: 500, unit: "g" },
    { name: "Pistachios", price: 1000, qty: 20, unitVal: 250, unit: "g" },
    { name: "Raisins", price: 400, qty: 50, unitVal: 500, unit: "g" },
    { name: "Peanuts", price: 200, qty: 80, unitVal: 1, unit: "kg" },
    { name: "Dates", price: 500, qty: 40, unitVal: 500, unit: "g" },
    { name: "Fox Nuts (Makhana)", price: 600, qty: 30, unitVal: 250, unit: "g" },
    { name: "Chia Seeds", price: 350, qty: 45, unitVal: 250, unit: "g" },
    { name: "Flax Seeds", price: 180, qty: 55, unitVal: 500, unit: "g" },
  ],
  Dairy: [
    { name: "Milk", price: 60, qty: 200, unitVal: 1, unit: "liter" },
    { name: "Curd", price: 50, qty: 150, unitVal: 500, unit: "ml" },
    { name: "Paneer", price: 300, qty: 40, unitVal: 500, unit: "g" },
    { name: "Butter", price: 500, qty: 30, unitVal: 250, unit: "g" },
    { name: "Ghee", price: 600, qty: 35, unitVal: 500, unit: "ml" },
    { name: "Cheese", price: 400, qty: 25, unitVal: 200, unit: "g" },
    { name: "Buttermilk", price: 30, qty: 180, unitVal: 500, unit: "ml" },
    { name: "Cream", price: 150, qty: 50, unitVal: 250, unit: "ml" },
    { name: "Lassi", price: 40, qty: 120, unitVal: 300, unit: "ml" },
    { name: "Khoya", price: 450, qty: 20, unitVal: 250, unit: "g" },
  ],
  Spices: [
    { name: "Turmeric", price: 120, qty: 60, unitVal: 250, unit: "g" },
    { name: "Red Chili", price: 150, qty: 55, unitVal: 250, unit: "g" },
    { name: "Cumin Seeds", price: 200, qty: 50, unitVal: 200, unit: "g" },
    { name: "Coriander Powder", price: 100, qty: 70, unitVal: 250, unit: "g" },
    { name: "Black Pepper", price: 500, qty: 30, unitVal: 100, unit: "g" },
    { name: "Cardamom", price: 800, qty: 20, unitVal: 50, unit: "g" },
    { name: "Cloves", price: 600, qty: 25, unitVal: 50, unit: "g" },
    { name: "Cinnamon", price: 350, qty: 35, unitVal: 100, unit: "g" },
    { name: "Mustard Seeds", price: 90, qty: 65, unitVal: 200, unit: "g" },
    { name: "Fenugreek Seeds", price: 80, qty: 60, unitVal: 200, unit: "g" },
  ],
  Pulses: [
    { name: "Toor Dal", price: 140, qty: 100, unitVal: 1, unit: "kg" },
    { name: "Moong Dal", price: 130, qty: 90, unitVal: 1, unit: "kg" },
    { name: "Chana Dal", price: 100, qty: 110, unitVal: 1, unit: "kg" },
    { name: "Masoor Dal", price: 110, qty: 95, unitVal: 1, unit: "kg" },
    { name: "Urad Dal", price: 150, qty: 85, unitVal: 1, unit: "kg" },
    { name: "Rajma", price: 160, qty: 70, unitVal: 1, unit: "kg" },
    { name: "Chickpeas", price: 120, qty: 100, unitVal: 1, unit: "kg" },
    { name: "Green Gram", price: 125, qty: 80, unitVal: 1, unit: "kg" },
    { name: "Black Eyed Peas", price: 115, qty: 75, unitVal: 1, unit: "kg" },
    { name: "Horse Gram", price: 90, qty: 65, unitVal: 1, unit: "kg" },
  ],
};

// Pick `count` items from an array starting at `offset` (wraps around)
function pickItems(arr, count, offset) {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(arr[(offset + i) % arr.length]);
  }
  return items;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const farmers = await User.find({ role: "farmer" }).sort({ email: 1 });
    if (farmers.length === 0) {
      console.log("No farmers found. Run seedFarmers.js first.");
      process.exit(1);
    }

    console.log(`Found ${farmers.length} farmers`);

    const categories = Object.keys(CATALOG);
    let totalInserted = 0;
    let totalSkipped = 0;

    for (let fi = 0; fi < farmers.length; fi++) {
      const farmer = farmers[fi];
      const itemsForFarmer = [];

      // 2 items from each of 5 categories + 2 from 6th = 12 items per farmer
      const itemsPerCategory = [2, 2, 2, 2, 2, 2]; // 12 items total

      let globalIdx = 0;
      for (let ci = 0; ci < categories.length; ci++) {
        const cat = categories[ci];
        const catalog = CATALOG[cat];
        const count = itemsPerCategory[ci];
        // Offset each farmer differently so they sell different items
        const offset = (fi * 3 + ci * 2) % catalog.length;
        const picked = pickItems(catalog, count, offset);

        for (const item of picked) {
          itemsForFarmer.push({
            itemName: item.name,
            itemPrice: item.price + Math.floor(Math.random() * 10) - 5, // slight price variation
            itemImage: ITEM_IMAGES[cat],
            itemCategory: cat,
            quantity: item.qty + Math.floor(Math.random() * 20) - 10,
            itemUnit: { value: item.unitVal, unit: item.unit },
            itemType: "All",
            seller: {
              id: farmer._id,
              name: farmer.userName,
              email: farmer.email,
            },
          });
          globalIdx++;
        }
      }

      // Insert items for this farmer
      let farmerInserted = 0;
      let farmerSkipped = 0;
      for (const item of itemsForFarmer) {
        const existing = await Market.findOne({
          "seller.email": farmer.email,
          itemName: item.itemName,
        });
        if (existing) {
          farmerSkipped++;
          continue;
        }
        await Market.create(item);
        farmerInserted++;
      }

      console.log(
        `${farmer.userName}: ${farmerInserted} inserted, ${farmerSkipped} skipped`
      );
      totalInserted += farmerInserted;
      totalSkipped += farmerSkipped;
    }

    console.log(
      `\nDone: ${totalInserted} items inserted, ${totalSkipped} skipped`
    );
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();

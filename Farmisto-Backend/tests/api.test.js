/**
 * Farmisto API Integration Test Suite
 *
 * Uses supertest to test all API endpoints without a real DB connection.
 * Mocks mongoose to avoid needing a live MongoDB instance in CI.
 *
 * Run: npm test
 */

const request = require("supertest");
const express = require("express");

// ─── Minimal Express app for testing (mirrors server.js without DB) ─────────
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Mock middleware ─────────────────────────────────────────────────────────
jest.mock("../config/cloudinary", () => () => {});
jest.mock("../middleware/TokenAuth", () => ({
  GenerateToken: () => "mock.jwt.token",
  verifyToken: () => ({ id: "mockUserId", email: "test@farm.com", name: "Test Farmer" }),
}));

// ─── Mock all Mongoose models ────────────────────────────────────────────────
jest.mock("../models/Farmer", () => {
  const mockFarmer = {
    _id: "farmerId123",
    farmerName: "Test Farmer",
    farmerEmail: "farmer@test.com",
    farmerPassword: "$2a$10$mockHash",
    farmerLocation: { latitude: 12.97, longitude: 77.59 },
    save: jest.fn().mockResolvedValue(true),
  };
  const Model = jest.fn().mockImplementation(() => mockFarmer);
  Model.findOne = jest.fn().mockResolvedValue(null);
  Model.findById = jest.fn().mockResolvedValue(null);
  Model.create = jest.fn().mockResolvedValue(mockFarmer);
  return Model;
});
jest.mock("../models/User", () => {
  const mockUser = { _id: "userId123", userName: "Test User", email: "user@test.com", password: "$2a$10$mockHash" };
  const Model = jest.fn().mockImplementation(() => mockUser);
  Model.findOne = jest.fn().mockResolvedValue(null);
  Model.findById = jest.fn().mockResolvedValue(null);
  Model.create = jest.fn().mockResolvedValue(mockUser);
  return Model;
});
jest.mock("../models/Market", () => {
  const Model = jest.fn();
  Model.find = jest.fn().mockResolvedValue([]);
  Model.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: "item1" });
  Model.create = jest.fn().mockResolvedValue({ _id: "item1", itemName: "Tomato" });
  return Model;
});
jest.mock("../models/Cart", () => {
  const Model = jest.fn();
  Model.find = jest.fn().mockResolvedValue([]);
  Model.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 1 });
  Model.findByIdAndUpdate = jest.fn().mockResolvedValue({ _id: "cart1", quantity: 2 });
  Model.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: "cart1" });
  Model.create = jest.fn().mockResolvedValue({ _id: "cart1", itemName: "Tomato" });
  return Model;
});
jest.mock("../models/Payment", () => {
  const Model = jest.fn();
  Model.find = jest.fn().mockResolvedValue([]);
  Model.findByIdAndUpdate = jest.fn().mockResolvedValue({ _id: "pay1", orderStatus: "Processing" });
  Model.create = jest.fn().mockResolvedValue({ _id: "pay1", totalAmount: 200 });
  return Model;
});
jest.mock("../models/PromoCode", () => {
  const Model = jest.fn();
  Model.find = jest.fn().mockResolvedValue([{ code: "SAVE10", discountPercentage: 10 }]);
  Model.findOne = jest.fn().mockResolvedValue(null);
  Model.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: "promo1" });
  Model.create = jest.fn().mockResolvedValue({ _id: "promo1", code: "SAVE10" });
  return Model;
});
jest.mock("../middleware/hashing", () => ({
  hashPassword: jest.fn(async (p) => "$2a$10$mockhash" + p),
  comparePassword: jest.fn(async () => false), // default: wrong password
}));
jest.mock("../controllers/GeoController", () => ({
  fetchLocation: jest.fn().mockResolvedValue([{ formatted_address: "123 Street, City, State 12345, Country" }]),
  fetchNearbyFarmers: jest.fn(async (req, res) => res.status(200).json({ farmers: [] })),
}));

// ─── Mount routes ─────────────────────────────────────────────────────────────
const farmerRoutes = require("../routes/FarmerRoutes");
const userRoutes = require("../routes/userRoutes");
const marketRoutes = require("../routes/MarketRoutes");
const cartRoutes = require("../routes/cartRoutes");
const paymentRoutes = require("../routes/PaymentRoutes");
const promoRoutes = require("../routes/PromoRoutes");

app.use("/farmer", farmerRoutes);
app.use("/user", userRoutes);
app.use("/market", marketRoutes);
app.use("/cart", cartRoutes);
app.use("/payments", paymentRoutes);
app.use("/promo", promoRoutes);

// ─── Auth header helper ───────────────────────────────────────────────────────
const AUTH_HEADER = { Authorization: "Bearer mock.jwt.token" };

// ─── FARMER AUTH TESTS ────────────────────────────────────────────────────────
describe("Farmer Auth", () => {
  const Farmer = require("../models/Farmer");

  test("POST /farmer/register — missing fields → 400", async () => {
    const res = await request(app).post("/farmer/register").send({ farmerEmail: "a@b.com" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /farmer/register — duplicate email → 400", async () => {
    Farmer.findOne.mockResolvedValueOnce({ farmerEmail: "farmer@test.com" });
    const res = await request(app).post("/farmer/register").send({
      farmerName: "Test", farmerEmail: "farmer@test.com", farmerPassword: "Pass123",
      farmerLocation: { latitude: 12.97, longitude: 77.59 },
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already registered/i);
  });

  test("POST /farmer/register — valid → 201", async () => {
    Farmer.findOne.mockResolvedValueOnce(null);
    const res = await request(app).post("/farmer/register").send({
      farmerName: "New Farmer", farmerEmail: "new@farm.com", farmerPassword: "Pass123",
      farmerLocation: { latitude: 12.97, longitude: 77.59 },
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /farmer/login — user not found → 400", async () => {
    Farmer.findOne.mockResolvedValueOnce(null);
    const res = await request(app).post("/farmer/login").send({ farmerEmail: "unknown@farm.com", farmerPassword: "pass" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Invalid Credentials/i);
  });

  test("POST /farmer/login — wrong password → 400", async () => {
    const { comparePassword } = require("../middleware/hashing");
    Farmer.findOne.mockResolvedValueOnce({ farmerEmail: "farmer@test.com", farmerPassword: "$2a$10$hash" });
    comparePassword.mockResolvedValueOnce(false);
    const res = await request(app).post("/farmer/login").send({ farmerEmail: "farmer@test.com", farmerPassword: "wrong" });
    expect(res.statusCode).toBe(400);
  });

  test("POST /farmer/login — valid → 200 with token", async () => {
    const { comparePassword } = require("../middleware/hashing");
    Farmer.findOne.mockResolvedValueOnce({ farmerEmail: "farmer@test.com", farmerPassword: "$2a$10$hash" });
    comparePassword.mockResolvedValueOnce(true);
    const res = await request(app).post("/farmer/login").send({ farmerEmail: "farmer@test.com", farmerPassword: "Pass123" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});

// ─── USER AUTH TESTS ──────────────────────────────────────────────────────────
describe("User Auth", () => {
  const User = require("../models/User");

  test("POST /user/register — missing fields → 400", async () => {
    const res = await request(app).post("/user/register").send({ email: "u@t.com" });
    expect(res.statusCode).toBe(400);
  });

  test("POST /user/register — duplicate → 400", async () => {
    User.findOne.mockResolvedValueOnce({ email: "user@test.com" });
    const res = await request(app).post("/user/register").send({ userName: "U", email: "user@test.com", password: "pass" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  test("POST /user/register — valid → 201", async () => {
    User.findOne.mockResolvedValueOnce(null);
    const res = await request(app).post("/user/register").send({ userName: "NUser", email: "new@user.com", password: "Pass123" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  test("POST /user/login — user not found → 400", async () => {
    User.findOne.mockResolvedValueOnce(null);
    const res = await request(app).post("/user/login").send({ email: "x@y.com", password: "pass" });
    expect(res.statusCode).toBe(400);
  });

  test("POST /user/login — valid → 200 with token", async () => {
    const { comparePassword } = require("../middleware/hashing");
    User.findOne.mockResolvedValueOnce({ email: "user@test.com", password: "$2a$10$hash" });
    comparePassword.mockResolvedValueOnce(true);
    const res = await request(app).post("/user/login").send({ email: "user@test.com", password: "Pass123" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});

// ─── MARKET TESTS ─────────────────────────────────────────────────────────────
describe("Market", () => {
  const Market = require("../models/Market");

  test("GET /market/get-items — public, no auth → 200", async () => {
    Market.find.mockResolvedValueOnce([]);
    const res = await request(app).get("/market/get-items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /market/add-item — no auth → 401", async () => {
    const res = await request(app).post("/market/add-item").send({ itemName: "Tomato" });
    expect(res.statusCode).toBe(401);
  });
});

// ─── CART TESTS ───────────────────────────────────────────────────────────────
describe("Cart", () => {
  const Cart = require("../models/Cart");

  test("POST /cart/user — no auth → 401", async () => {
    const res = await request(app).post("/cart/user").send({ id: "userId123" });
    expect(res.statusCode).toBe(401);
  });

  test("POST /cart/user — with auth, empty cart → 200", async () => {
    Cart.find.mockResolvedValueOnce([]);
    const res = await request(app).post("/cart/user").set(AUTH_HEADER).send({ id: "userId123" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  test("DELETE /cart/clear — no id → 400", async () => {
    const res = await request(app).delete("/cart/clear").set(AUTH_HEADER).send({});
    expect(res.statusCode).toBe(400);
  });

  test("DELETE /cart/clear — valid → 200", async () => {
    const res = await request(app).delete("/cart/clear").set(AUTH_HEADER).send({ id: "userId123" });
    expect(res.statusCode).toBe(200);
  });

  test("PATCH /cart/update/:id — invalid quantity → 400", async () => {
    const res = await request(app).patch("/cart/update/someId").set(AUTH_HEADER).send({ updatedQuantity: 0 });
    expect(res.statusCode).toBe(400);
  });
});

// ─── PROMO CODE TESTS ─────────────────────────────────────────────────────────
describe("Promo Codes", () => {
  const PromoCode = require("../models/PromoCode");

  test("GET /promo/list-promos — with auth → 200", async () => {
    const res = await request(app).get("/promo/list-promos").set(AUTH_HEADER);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("promoCodes");
  });

  test("POST /promo/apply-promo — code not found → 404", async () => {
    PromoCode.findOne.mockResolvedValueOnce(null);
    const res = await request(app).post("/promo/apply-promo").set(AUTH_HEADER).send({ code: "INVALID" });
    expect(res.statusCode).toBe(404);
  });

  test("POST /promo/apply-promo — expired code → 400", async () => {
    PromoCode.findOne.mockResolvedValueOnce({
      code: "EXPIRED", discountPercentage: 10,
      expiryDate: new Date("2020-01-01"),
      usageLimit: 10, usedCount: 0,
      save: jest.fn(),
    });
    const res = await request(app).post("/promo/apply-promo").set(AUTH_HEADER).send({ code: "EXPIRED" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/expired/i);
  });

  test("POST /promo/apply-promo — valid code → 200", async () => {
    PromoCode.findOne.mockResolvedValueOnce({
      code: "SAVE10", discountPercentage: 10,
      expiryDate: new Date("2099-01-01"),
      usageLimit: 10, usedCount: 0,
      save: jest.fn(),
    });
    const res = await request(app).post("/promo/apply-promo").set(AUTH_HEADER).send({ code: "SAVE10" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("promo");
  });
});

// ─── PAYMENT TESTS ────────────────────────────────────────────────────────────
describe("Payments", () => {
  const Payment = require("../models/Payment");

  test("GET /payments/farmer-get-payment — no auth → 401", async () => {
    const res = await request(app).get("/payments/farmer-get-payment");
    expect(res.statusCode).toBe(401);
  });

  test("GET /payments/farmer-get-payment — with auth, no payments → 404", async () => {
    Payment.find.mockResolvedValueOnce([]);
    const res = await request(app).get("/payments/farmer-get-payment").set(AUTH_HEADER);
    expect(res.statusCode).toBe(404);
  });

  test("PATCH /payments/farmer-update-payment — disallowed field → 400", async () => {
    const res = await request(app).patch("/payments/farmer-update-payment").set(AUTH_HEADER)
      .send({ field: "totalAmount", value: 9999, id: "pay1" });
    expect(res.statusCode).toBe(400);
  });

  test("PATCH /payments/farmer-update-payment — valid → 200", async () => {
    Payment.findByIdAndUpdate.mockResolvedValueOnce({ _id: "pay1", orderStatus: "Delivered" });
    const res = await request(app).patch("/payments/farmer-update-payment").set(AUTH_HEADER)
      .send({ field: "orderStatus", value: "Delivered", id: "pay1" });
    expect(res.statusCode).toBe(200);
  });
});

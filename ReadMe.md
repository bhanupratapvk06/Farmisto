# Farmisto — Codebase Documentation

> Complete technical reference for developers contributing to or maintaining the Farmisto platform.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository Structure](#2-repository-structure)
3. [Architecture](#3-architecture)
4. [Backend (`Farmisto-Backend`)](#4-backend-farmisto-backend)
   - [Entry Point](#41-entry-point--serverjs)
   - [Configuration](#42-configuration)
   - [Data Models](#43-data-models)
   - [Controllers](#44-controllers)
   - [Routes](#45-routes)
   - [Middleware](#46-middleware)
   - [Utilities](#47-utilities)
5. [Consumer Frontend (`Farmisto-Frontend`)](#5-consumer-frontend-farmisto-frontend)
   - [Routing](#51-routing)
   - [Pages](#52-pages)
   - [Components](#53-components)
   - [Utilities & Context](#54-utilities--context)
   - [Assets & Theming](#55-assets--theming)
6. [Retailer Dashboard (`Farmisto-Retailer`)](#6-retailer-dashboard-farmisto-retailer)
   - [Routing](#61-routing)
   - [Pages](#62-pages)
   - [Dashboard Modules](#63-dashboard-modules)
   - [Components](#64-components)
7. [Data Flow Diagrams](#7-data-flow-diagrams)
   - [User Purchase Flow](#71-user-purchase-flow)
   - [Farmer Listing Flow](#72-farmer-listing-flow)
   - [Authentication Flow](#73-authentication-flow)
   - [Geo-Discovery Flow](#74-geo-discovery-flow)
8. [API Reference](#8-api-reference)
9. [Environment Variables](#9-environment-variables)
10. [Setup & Development](#10-setup--development)
11. [Deployment](#11-deployment)
12. [Key Design Patterns & Notes](#12-key-design-patterns--notes)

---

## 1. Project Overview

**Farmisto** is a three-tier full-stack agricultural marketplace that connects consumers directly with local farmers. It consists of three independent applications sharing a single backend:

| Application | Purpose | Deployed At |
|---|---|---|
| `Farmisto-Backend` | REST API server powering both frontends | `https://farmisto.onrender.com` |
| `Farmisto-Frontend` | Consumer-facing shopping app | `https://farmisto-frontend.vercel.app` |
| `Farmisto-Retailer` | Farmer/retailer dashboard app | `https://farmisto-farmer.vercel.app` |

**Technology Stack:**

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Backend Framework | Express.js |
| Database | MongoDB (via Mongoose ODM) |
| Authentication | JWT (JSON Web Tokens) |
| Image Storage | Cloudinary |
| Image Upload | Multer (disk storage) + remove.bg API (background removal) |
| Image Processing | remove.bg API |
| PDF Generation | PDFKit |
| Geo-location | Google Maps Geocoding API + Haversine formula |
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Frontend Routing | React Router v7 |

---

## 2. Repository Structure

```
Farmisto/
├── package.json                   # Root — only contains bcrypt dependency
├── .gitignore
├── logo.svg
│
├── Farmisto-Backend/              # Node.js Express REST API
│   ├── server.js                  # App entry point
│   ├── package.json
│   ├── config/
│   │   ├── Db.js                  # MongoDB connection
│   │   ├── cloudinary.js          # Cloudinary SDK config
│   │   └── multer.js              # Multer disk storage config
│   ├── models/
│   │   ├── User.js                # Consumer user schema
│   │   ├── Farmer.js              # Farmer/retailer schema
│   │   ├── Market.js              # Marketplace listing schema
│   │   ├── Cart.js                # Shopping cart schema
│   │   ├── Payment.js             # Order/payment schema
│   │   └── PromoCode.js           # Discount promo code schema
│   ├── controllers/
│   │   ├── UserController.js      # User auth + buy item + geo queries
│   │   ├── FarmerController.js    # Farmer auth + profile + dashboard
│   │   ├── MarketController.js    # Add/delete/list market items
│   │   ├── CartController.js      # Cart CRUD + discount logic
│   │   ├── PaymentController.js   # Order creation + PDF invoice
│   │   ├── PromoCodeController.js # Promo code lifecycle
│   │   └── GeoController.js       # Reverse geocoding + nearby farmer search
│   ├── middleware/
│   │   ├── Authentication.js      # Route protection — reads Bearer token
│   │   ├── TokenAuth.js           # JWT sign / verify helpers
│   │   └── hashing.js             # bcrypt password hash / compare
│   ├── routes/
│   │   ├── userRoutes.js          # /user/*
│   │   ├── FarmerRoutes.js        # /farmer/*
│   │   ├── MarketRoutes.js        # /market/*
│   │   ├── cartRoutes.js          # /cart/*
│   │   ├── PaymentRoutes.js       # /payments/*
│   │   └── PromoRoutes.js         # /promo/*
│   └── utils/
│       ├── axios.js               # Server-side Axios instance
│       └── validation.js          # Input validation helpers
│
├── Farmisto-Frontend/             # React consumer app (Vite)
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   ├── public/                    # Static assets
│   └── src/
│       ├── main.jsx               # React DOM entry
│       ├── App.jsx                # Router + route definitions
│       ├── index.css
│       ├── assets/
│       │   ├── assets.js          # Asset registry
│       │   ├── theme.js           # Theme tokens
│       │   └── colors.js          # Color palette
│       ├── utils/
│       │   ├── Auth.jsx           # AuthContext provider + useAuth hook
│       │   └── axios.jsx          # Pre-configured Axios instance
│       ├── Components/
│       │   ├── BuySection/        # AllBuyBlock, MobileBuyBlock
│       │   ├── FeaturedProduct/   # FeaturedProduct
│       │   ├── Footer/            # Footer
│       │   ├── Header/            # HomeHeader, MarketHeader, Trusted
│       │   ├── Minor/             # CircularOverlay, HowItWorks, VegMarquee
│       │   ├── NavBar/            # NavBar
│       │   ├── SideBar/           # SideBar
│       │   └── Story/             # Story
│       └── Pages/
│           ├── Home/              # Landing page
│           ├── MarketPlace/       # Browse all products
│           ├── NearbyFarmers/     # Geo-filtered farmer map
│           ├── Cart/              # Cart + CartItems + MobileCartItems
│           ├── PlaceOrder/        # Checkout / address entry
│           ├── Confirmation/      # Post-order confirmation
│           ├── Register/          # User login / register
│           ├── About/             # About page
│           ├── Contact/           # Contact page
│           ├── Faq/               # FAQ page
│           └── Terms/             # Terms & Conditions
│
└── Farmisto-Retailer/             # React farmer dashboard (Vite)
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── vercel.json
    ├── axios.jsx                  # Root-level Axios instance
    ├── public/
    └── src/
        ├── main.jsx
        ├── App.jsx                # Router + route definitions
        ├── index.css
        ├── assets/
        │   ├── assets.js
        │   └── color.js
        ├── utils/
        │   ├── Auth.jsx           # AuthContext + useAuth (mirrors frontend)
        │   └── axios.jsx          # Axios instance for retailer
        ├── Components/
        │   ├── Footer/            # Footer
        │   ├── Header/            # Homeheader
        │   ├── Major/             # NavBar, SideBar
        │   ├── Panel/             # Panel
        │   └── Work/              # Work (how-it-works section)
        ├── Dash/                  # Dashboard feature modules
        │   ├── Dashboard.jsx      # Main dashboard shell
        │   ├── Maindash.jsx       # Dashboard home content
        │   ├── AddItem.jsx        # List new product form
        │   ├── Order.jsx          # Order management view
        │   ├── Payments.jsx       # Payment records view
        │   ├── Message.jsx        # Messaging interface
        │   └── SideNav.jsx        # Dashboard sidebar navigation
        └── Pages/
            ├── Home/              # Retailer landing page
            ├── Register/          # Farmer login / register
            ├── Market/            # View marketplace listings
            │   └── Components/    # LargerFarmerStore, MobileFarmerStore
            ├── Dashboard/         # DashHeader, DiscountSection, MainContent
            ├── Discounts/         # Promo code management
            ├── Learn/             # Educational resources
            └── Settings/          # Settings shell + nested sections
                └── Sections/      # ProfileSettings, PaymentSettings,
                                   # HelpAndSupport, LegalAndCompliance
```

---

## 3. Architecture

Farmisto follows a **monorepo multi-client architecture** — one shared backend serves two completely separate frontend React applications:

```
┌───────────────────────────────────────────────────────────────────┐
│                         CLIENTS (Browser)                         │
│                                                                   │
│  ┌─────────────────────────────┐  ┌────────────────────────────┐ │
│  │    Farmisto-Frontend        │  │    Farmisto-Retailer        │ │
│  │  (Consumer Shopping App)    │  │  (Farmer Dashboard App)     │ │
│  │                             │  │                             │ │
│  │  React 18 + Vite            │  │  React 19 + Vite            │ │
│  │  Tailwind CSS               │  │  Tailwind + PrimeReact      │ │
│  │  React Router v7            │  │  Chart.js + Leaflet         │ │
│  │  AuthContext (JWT)          │  │  AuthContext (JWT)           │ │
│  └──────────┬──────────────────┘  └───────────┬────────────────┘ │
└─────────────┼───────────────────────────────────┼─────────────────┘
              │  HTTPS REST (Bearer JWT)           │
              └─────────────┬──────────────────────┘
                            ▼
┌───────────────────────────────────────────────────────────────────┐
│                    Farmisto-Backend (Node.js)                      │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │  /user   │  │ /farmer  │  │ /market  │  │ /cart /payments  │ │
│  │  Routes  │  │  Routes  │  │  Routes  │  │ /promo  Routes   │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
│                     │                                             │
│             Authentication Middleware (JWT verify)                │
│                     │                                             │
│  ┌──────────────────┴──────────────────────────────────────────┐ │
│  │                     Controllers                              │ │
│  │  User | Farmer | Market | Cart | Payment | Promo | Geo      │ │
│  └──────────────────┬──────────────────────────────────────────┘ │
│                     │                                             │
│  ┌──────────────────┴──────────────────────────────────────────┐ │
│  │                  External Services                           │ │
│  │  MongoDB Atlas  │  Cloudinary  │  remove.bg  │  Google Maps │ │
│  └─────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

### CORS Policy

The backend explicitly allows only three origins:

```javascript
const allowedOrigins = [
  'http://localhost:5173',                      // local dev
  'https://farmisto-frontend.vercel.app',       // consumer app
  'https://farmisto-farmer.vercel.app',         // retailer app
];
```

All other origins receive a CORS error. Credentials (cookies) are enabled.

---

## 4. Backend (`Farmisto-Backend`)

### 4.1 Entry Point — `server.js`

`server.js` is the application bootstrap. It performs four tasks in sequence:

1. **Loads environment** — `dotenv.config()`
2. **Connects external services** — `connectCloudinary()` then `MongooseConnect()`
3. **Configures Express** — CORS, JSON body parser, URL-encoded body parser
4. **Registers all route trees** and starts the HTTP listener on `PORT` (default `4000`)

**Route mounting table:**

| Mount Path | Router File | Purpose |
|---|---|---|
| `/farmer` | `FarmerRoutes.js` | Farmer auth, profile, dashboard |
| `/market` | `MarketRoutes.js` | Marketplace listing management |
| `/user` | `userRoutes.js` | Consumer auth, buy, geo queries |
| `/cart` | `cartRoutes.js` | Cart CRUD |
| `/payments` | `PaymentRoutes.js` | Order creation, status updates |
| `/promo` | `PromoRoutes.js` | Promo code management |
| `/api/geocode` | `GeoController.fetchLocation` | Reverse geocoding utility |
| `/api/geoNearby` | `GeoController.fetchNearbyFarmers` | Nearby farmer discovery |

There is also a `GET /logout` endpoint that clears the `token` cookie client-side.

---

### 4.2 Configuration

#### `config/Db.js` — MongoDB Connection
Calls `mongoose.connect(process.env.MONGO_URI)`. No retry logic; the process will remain running but requests to DB-dependent routes will fail if the connection drops.

#### `config/cloudinary.js` — Cloudinary Setup
Configures the Cloudinary v2 SDK with `CLOUD_NAME`, `API_KEY`, and `API_SECRET` from environment variables. Must be called before any upload.

#### `config/multer.js` — File Upload Middleware
Uses **disk storage** — files are temporarily written to the `uploads/` directory with a timestamp-prefixed filename. After upload to Cloudinary, the temp file should be cleaned up (note: current implementation does not explicitly delete the temp file after Cloudinary upload).

```
uploads/<timestamp>-<originalname>
```

---

### 4.3 Data Models

#### `User`
Represents a consumer/buyer.

| Field | Type | Notes |
|---|---|---|
| `userName` | String | Required |
| `email` | String | Required, unique |
| `password` | String | Stored as bcrypt hash |
| `userLocation.latitude` | Number | Set at registration |
| `userLocation.longitude` | Number | Set at registration |
| `createdAt` / `updatedAt` | Date | Auto via timestamps |

#### `Farmer`
Represents a farmer/retailer. Geo-resolved on registration via Google Maps.

| Field | Type | Notes |
|---|---|---|
| `farmerName` | String | Required |
| `farmerEmail` | String | Required, unique |
| `farmerPassword` | String | bcrypt hash |
| `farmerMobile` | Number | Unique, 10 digits |
| `farmerProfilePhoto` | String | Cloudinary URL or default string |
| `farmerAddress` | String | Full formatted address from Google Maps |
| `farmerCity` | String | Parsed from Google Maps response |
| `farmerStateZip` | String | Parsed from Google Maps response |
| `farmerCountry` | String | Parsed from Google Maps response |
| `farmerLocation.latitude` | Number | Raw coordinate stored |
| `farmerLocation.longitude` | Number | Raw coordinate stored |

#### `Market`
Represents a single product listed by a farmer.

| Field | Type | Notes |
|---|---|---|
| `itemName` | String | Required |
| `itemPrice` | Number | Required |
| `itemImage` | String | Cloudinary URL |
| `itemCategory` | String | Required |
| `quantity` | Number | Available stock |
| `itemUnit.value` | Number | e.g., `500` |
| `itemUnit.unit` | Enum | `kg`, `liter`, `g`, `ml` |
| `itemType` | String | Default `"All"` |
| `seller.id` | ObjectId | Ref to `User` model |
| `seller.name` | String | Denormalized |
| `seller.email` | String | Denormalized |
| `createdAt` / `updatedAt` | Date | Auto |

#### `Cart`
Represents a single item added to a user's cart.

| Field | Type | Notes |
|---|---|---|
| `itemName` | String | Copied from Market listing |
| `itemPrice` | Number | Original price |
| `imageUrl` | String | Cloudinary URL |
| `discount` | Number | Percentage, 0–100, default `0` |
| `itemUnit` | Object | `{ value, unit }` |
| `quantity` | Number | Min 1 |
| `buyer` | ObjectId | Ref to `User` |
| `farmer.id` | ObjectId | Seller reference |
| `farmer.name` | String | Denormalized |
| `farmer.email` | String | Denormalized |

**Virtual fields** (computed, not stored):

| Virtual | Calculation |
|---|---|
| `discountedPrice` | `itemPrice - (itemPrice × discount / 100)` |
| `savingPrice` | `(itemPrice × discount / 100) × quantity` |
| `totalItemCost` | `discountedPrice × quantity` |

#### `Payment`
Represents a completed order. Snapshot of cart state at checkout time.

| Field | Type | Notes |
|---|---|---|
| `farmers` | Array | `[{ id, name, email }]` — all farmers involved |
| `buyer` | Object | `{ id, name, email }` |
| `cartItems` | Array | Snapshot with computed `discountedPrice` and `totalItemCost` |
| `paymentStatus` | Enum | `Pending`, `Paid`, `Failed`, `Refunded` — default `Pending` |
| `orderStatus` | Enum | `Processing`, `Shipped`, `Delivered`, `Cancelled` — default `Processing` |
| `totalAmount` | Number | Sum of all `totalItemCost` |
| `address` | Object | `{ street, city, state, zip, country }` |
| `paymentMethod` | Enum | Currently only `COD` (Cash on Delivery) |

#### `PromoCode`

| Field | Type | Notes |
|---|---|---|
| `item` | ObjectId | Optional, ref to item |
| `code` | String | Unique, required |
| `discountPercentage` | String | Percentage value |
| `expiryDate` | Date | Required |
| `usageLimit` | String | Max number of uses |
| `usedCount` | Number | Default `0` |

---

### 4.4 Controllers

#### `UserController.js`

| Function | Description |
|---|---|
| `UserRegister` | Creates a new `User`. Hashes password with bcrypt. Stores `userLocation` coordinates. |
| `UserLogin` | Verifies credentials with `comparePassword`. Returns JWT via `Authorization` header and response body. |
| `BuyItem` | Creates a `Cart` document, associating the item with the authenticated buyer and the seller's farmer info. |
| `GetUser` | Fetches a user by `id` from URL param. |
| `getFarmerByEmail` | Fetches a farmer document by email. Used to display farmer profile in the consumer app. |
| `GetItemsByFarmerEmail` | Returns all `Market` items listed by a specific farmer (by their ID). |

#### `FarmerController.js`

| Function | Description |
|---|---|
| `FarmerRegister` | Creates a new `Farmer`. Calls `fetchLocation` (Google Maps reverse geocoding) to parse the farmer's location into human-readable address components. Hashes password. |
| `FarmerLogin` | Verifies farmer credentials. Issues JWT containing `id`, `email`, `name`, and `location`. |
| `getProfile` | Returns the authenticated farmer's profile document. |
| `updateProfile` | Accepts multipart form data. Uploads a new profile photo to Cloudinary, then updates farmer fields. |
| `editPassword` | Validates old password, hashes new password, and updates the record. |
| `GetDashboard` | Aggregates data for the farmer's dashboard — their market items and associated payments. |
| `GetFarmerLocation` | Returns the stored lat/lng for the authenticated farmer. |

#### `MarketController.js`

| Function | Description |
|---|---|
| `AddItem` | Receives item details + image file. Calls the **remove.bg API** to strip the background from the image, then uploads the processed image to **Cloudinary** under the `Farmisto` folder. Saves the resulting `Market` document with the Cloudinary URL. |
| `DeleteItem` | Deletes a `Market` document by ID. (Note: does not delete the Cloudinary image.) |
| `GetItems` | Returns all market items. Used by the consumer marketplace. |
| `GetItemsByFarmerEmail` | Returns items belonging to the authenticated farmer. Used by the retailer dashboard. |

**Image pipeline for `AddItem`:**
```
Client sends image file
  └─> Multer saves to uploads/ (disk)
      └─> Read file buffer
          └─> POST to remove.bg API → background-removed PNG buffer
              └─> Upload PNG stream to Cloudinary
                  └─> Store Cloudinary URL in Market document
```

#### `CartController.js`

| Function | Description |
|---|---|
| `GetCartDetail` | Fetches all `Cart` items for a buyer. Computes `grandTotal` and `totalSavings` using Mongoose virtuals. |
| `ItemQuantityUpdate` | Updates the `quantity` field of a cart item by its ID. |
| `ItemDelete` | Removes a single cart item by ID. |
| `ItemDiscountUpdate` | Applies or updates a discount percentage on a single cart item. Used by the farmer dashboard to apply promo discounts. |
| `ClearCart` | Deletes all cart items belonging to the authenticated buyer. Called after successful order placement. |

#### `PaymentController.js`

| Function | Description |
|---|---|
| `createPayment` | Validates cart items and shipping address. Recomputes `discountedPrice` and `totalItemCost` server-side (important: never trust client-side totals). Creates a `Payment` document. Generates a **PDF invoice** using PDFKit and streams it directly back as the HTTP response (`application/pdf`). |
| `GetPayments` | Returns all `Payment` records where the authenticated farmer appears in the `farmers` array. Used by the retailer dashboard. |
| `UpdatePayment` | Generic field updater — accepts `{ field, value, id }` in the request body and performs `findByIdAndUpdate`. Used to change `orderStatus` or `paymentStatus`. |

#### `PromoCodeController.js`

| Function | Description |
|---|---|
| `PromoCodeGenerator` | Creates a new `PromoCode` document. Requires `code`, `discountPercentage`, `expiryDate`, `usageLimit`. |
| `PromoCodeApply` | Looks up a code string. Validates it has not expired and has remaining uses. Returns the discount percentage. Increments `usedCount`. |
| `PromoCodeDelete` | Deletes a promo code by its MongoDB `_id`. |
| `PromoCodeList` | Returns all promo codes created by the authenticated farmer. |

#### `GeoController.js`

| Function | Description |
|---|---|
| `fetchLocation(lat, lng)` | Calls the Google Maps Geocoding API for reverse geocoding. Returns the full `results` array. Used internally by `FarmerController.FarmerRegister`. |
| `fetchNearbyFarmers(req, res)` | Reads the authenticated user's location from the JWT payload. Fetches all farmers from the database. Applies the **Haversine formula** to calculate distance between the user and each farmer. Returns farmers within a **30 km radius**. |

**Haversine formula implementation:**
```javascript
calculateDistance(lat1, lng1, lat2, lng2)
  → uses Earth radius = 6371 km
  → returns distance in km
  → threshold: 30 km
```

---

### 4.5 Routes

#### User Routes (`/user`)

| Method | Path | Auth | Controller Function |
|---|---|---|---|
| POST | `/register` | ❌ | `UserRegister` |
| POST | `/login` | ❌ | `UserLogin` |
| POST | `/buy-item` | ✅ | `BuyItem` |
| POST | `/get-user/:id` | ❌ | `GetUser` |
| POST | `/get-farmer` | ✅ | `getFarmerByEmail` |
| GET | `/fetch-nearby-farmers` | ✅ | `fetchNearbyFarmers` |
| POST | `/get-items-by-farmerId` | ✅ | `GetItemsByFarmerEmail` |

#### Farmer Routes (`/farmer`)

| Method | Path | Auth | Controller Function |
|---|---|---|---|
| POST | `/register` | ❌ | `FarmerRegister` |
| POST | `/login` | ❌ | `FarmerLogin` |
| GET | `/settings/profile-data` | ✅ | `getProfile` |
| PATCH | `/settings/update-profile` | ✅ + multer | `updateProfile` |
| PATCH | `/settings/changePassword` | ✅ | `editPassword` |
| GET | `/dashboard` | ✅ | `GetDashboard` |
| GET | `/location` | ✅ | `GetFarmerLocation` |

#### Market Routes (`/market`)

| Method | Path | Auth | Controller Function |
|---|---|---|---|
| POST | `/add-item` | ✅ + multer | `AddItem` |
| DELETE | `/delete-item` | ✅ | `DeleteItem` |
| GET | `/get-items` | ❌ | `GetItems` |
| GET | `/get-items-farmer` | ✅ | `GetItemsByFarmerEmail` |

#### Cart Routes (`/cart`)

| Method | Path | Auth | Controller Function |
|---|---|---|---|
| POST | `/user` | ✅ | `GetCartDetail` |
| PATCH | `/update/:id` | ✅ | `ItemQuantityUpdate` |
| DELETE | `/delete/:id` | ✅ | `ItemDelete` |
| PATCH | `/discount/:id` | ✅ | `ItemDiscountUpdate` |
| DELETE | `/clear` | ✅ | `ClearCart` |

#### Payment Routes (`/payments`)

| Method | Path | Auth | Controller Function |
|---|---|---|---|
| POST | `/create-payment` | ✅ | `createPayment` |
| GET | `/farmer-get-payment` | ✅ | `GetPayments` |
| PATCH | `/farmer-update-payment` | ✅ | `UpdatePayment` |

#### Promo Routes (`/promo`)

| Method | Path | Auth | Controller Function |
|---|---|---|---|
| POST | `/gen-promo` | ✅ | `PromoCodeGenerator` |
| POST | `/apply-promo` | ❌ | `PromoCodeApply` |
| DELETE | `/del-promo/:id` | ✅ | `PromoCodeDelete` |
| GET | `/list-promos` | ✅ | `PromoCodeList` |

---

### 4.6 Middleware

#### `Authentication.js`
Protects routes by extracting and verifying the `Authorization: Bearer <token>` header. On success, attaches the decoded JWT payload to `req.user` and calls `next()`. On failure, responds with `401`.

```
Request
  └─> Extract "Authorization" header
      └─> Split "Bearer <token>"
          └─> verifyToken(token) → decoded payload
              └─> req.user = decoded
                  └─> next()
```

The `req.user` payload shape (from `GenerateToken`):
```javascript
{
  id:       <MongoDB _id>,
  email:    <farmerEmail | email>,
  name:     <farmerName | userName>,
  location: <farmerLocation | userLocation>
}
```

#### `TokenAuth.js`

| Export | Description |
|---|---|
| `GenerateToken(person)` | Signs a JWT with `SECRET_KEY`. Expiry: 3 days. Includes `id`, `email`, `name`, `location`. |
| `verifyToken(token)` | Verifies with `SECRET_KEY`. Returns decoded payload on success, or `{ success: false, error }` on failure. |

#### `hashing.js`

| Export | Description |
|---|---|
| `hashPassword(password)` | Generates bcrypt salt (10 rounds) and hashes. |
| `comparePassword(password, hashedPassword)` | Returns `true`/`false` from `bcrypt.compare`. |

---

### 4.7 Utilities

#### `utils/validation.js`
Input validation helpers (referenced but not fully detailed in available source — extend as needed for field-level validation).

#### `utils/axios.js`
A server-side Axios instance for making outbound HTTP requests (used in `GeoController` for Google Maps calls).

---

## 5. Consumer Frontend (`Farmisto-Frontend`)

Built with **React 18**, **Vite**, and **Tailwind CSS**. Deployed to Vercel. Uses React Router v7 for client-side routing.

### 5.1 Routing

Defined in `src/App.jsx`:

| Path | Component | Description |
|---|---|---|
| `/` | `Home` | Landing page |
| `/market` | `MarketPlace` | Browse all products |
| `/farmers` | `NearbyFarmers` | Geo-based farmer discovery |
| `/Profile` | `FarmerProfile` | Individual farmer's store view |
| `/cart` | `Cart` | Shopping cart |
| `/place-order` | `PlaceOrder` | Checkout / address entry |
| `/order-confirmation` | `Confirmation` | Order success page |
| `/form` | `Register` | User login / register |
| `/about` | `About` | About Farmisto |
| `/contact` | `Contact` | Contact form |
| `/faq` | `FAQs` | Frequently asked questions |
| `/terms-conditions` | `TermsConditions` | Legal terms |

### 5.2 Pages

| Page | Key Behaviour |
|---|---|
| `Home` | Marketing landing page with hero, featured products, HowItWorks, marquee, and CTA sections. |
| `MarketPlace` | Fetches all market items via `GET /market/get-items`. Renders product cards with buy buttons. Calls `POST /user/buy-item` to add to cart. |
| `NearbyFarmers` | Calls `GET /user/fetch-nearby-farmers` (authenticated). Renders a map or list of farmers within 30 km. Links to `FarmerProfile`. |
| `FarmerProfile` | Fetches a farmer's profile and their listed items. Passed farmer data via React Router state or URL param. |
| `Cart` | Calls `POST /cart/user` for cart items. Renders `CartItems` (desktop) and `MobileCartItems` (mobile). Handles quantity updates and item removal. Applies promo codes via `POST /promo/apply-promo`. |
| `PlaceOrder` | Address entry form. On submit, calls `POST /payments/create-payment`. Receives a PDF blob in the response and auto-downloads the invoice. |
| `Confirmation` | Post-order success screen shown after successful payment creation. |
| `Register` | Unified login/register form for consumers. Calls `POST /user/register` or `POST /user/login`. On success, calls `login(token)` from `AuthContext`. |

### 5.3 Components

| Component | Location | Purpose |
|---|---|---|
| `NavBar` | `Components/NavBar` | Top navigation. Shows links; reads auth state to display user name or login button. |
| `SideBar` | `Components/SideBar` | Mobile slide-out navigation menu. |
| `Footer` | `Components/Footer` | Site-wide footer with links and branding. |
| `HomeHeader` | `Components/Header` | Hero section on the landing page. |
| `MarketHeader` | `Components/Header` | Header banner for the marketplace page. |
| `Trusted` | `Components/Header` | "Trusted by" or social proof section. |
| `FeaturedProduct` | `Components/FeaturedProduct` | Highlighted product card carousel/grid. |
| `AllBuyBlock` | `Components/BuySection` | Desktop-layout product purchase block. |
| `MobileBuyBlock` | `Components/BuySection` | Mobile-layout product purchase block. |
| `CircularOverlay` | `Components/Minor` | Decorative circular overlay animation. |
| `HowItWorks` | `Components/Minor` | Step-by-step explainer section. |
| `VegMarquee` | `Components/Minor` | Scrolling marquee of vegetable/product icons. |
| `Story` | `Components/Story` | Brand story or mission section. |

### 5.4 Utilities & Context

#### `src/utils/Auth.jsx` — `AuthProvider` & `useAuth`

The single source of truth for authentication state across the consumer app.

```javascript
// Context value shape:
{
  authToken,       // Raw JWT string or null
  userDetails,     // Decoded JWT payload or null
  login(token),    // Decodes + stores token in localStorage + state
  logout(),        // Removes token from localStorage + clears state
  isAuthenticated, // Boolean shorthand
}
```

**Token persistence:** Token is stored in `localStorage` under the key `"authToken"`. On mount, `AuthProvider` reads `localStorage`, validates the token expiry (`decoded.exp * 1000 < Date.now()`), and auto-logs out if expired.

**Usage:**
```javascript
import { useAuth } from '../utils/Auth';

const { isAuthenticated, userDetails, login, logout } = useAuth();
```

#### `src/utils/axios.jsx` — Axios Instance

```javascript
// Base URL switching by environment:
baseURL = VITE_NODE === 'development'
  ? VITE_API_BASE_URL         // from .env
  : 'https://farmisto.onrender.com'
```

All API calls throughout the consumer app should use this instance to ensure consistent base URL handling.

### 5.5 Assets & Theming

| File | Contents |
|---|---|
| `assets/assets.js` | Centralised image/icon imports — reference by key across all components |
| `assets/theme.js` | Design tokens (spacing, border radius, shadow) |
| `assets/colors.js` | Named color constants used in Tailwind custom config |

---

## 6. Retailer Dashboard (`Farmisto-Retailer`)

Built with **React 19**, **Vite**, and **Tailwind CSS**. Adds **PrimeReact** and **Chart.js** for data-rich dashboard UI, and **Leaflet** for maps.

### 6.1 Routing

Defined in `src/App.jsx`:

| Path | Component | Description |
|---|---|---|
| `/` | `Home` | Farmer landing / marketing page |
| `/Register` | `Register` | Farmer login / register |
| `/Dashboard` | `Dashboard` | Main dashboard shell |
| `/Additem` | `AddItem` | Form to list a new product |
| `/Orders` | `Order` | View and manage incoming orders |
| `/Payments` | `Payments` | Payment records table |
| `/Message` | `Message` | Messaging interface |
| `/market` | `Market` | Browse other farmers' listings |
| `/learn` | `Learn` | Educational resources |
| `/Discounts` | `Discounts` | Create/manage promo codes |
| `/Settings` | `Settings` | Settings shell with nested routes |
| `/Settings/ProfileSettings` | `ProfileSettings` | Edit name, email, photo |
| `/Settings/PaymentSettings` | `PaymentSettings` | Payment account settings |
| `/Settings/HelpAndSupport` | `HelpAndSupport` | Help centre |
| `/Settings/LegalAndCompliance` | `LegalAndCompliance` | Legal information |

### 6.2 Pages

| Page | Key Behaviour |
|---|---|
| `Home` | Marketing/onboarding landing page for farmers. Shows how-it-works and sign-up CTA. |
| `Register` | Farmer registration and login. On register, sends `POST /farmer/register` with GPS coordinates (captured in browser). On login, calls `POST /farmer/login` and stores JWT. |
| `Market` | Renders `LargerFarmerStore` (desktop) and `MobileFarmerStore` (mobile). Fetches all market items. |
| `Discounts` | Calls `GET /promo/list-promos` to list active promos. Uses `POST /promo/gen-promo` to create new ones. Calls `DELETE /promo/del-promo/:id` to remove. |
| `Settings` | Layout wrapper with nested `<Outlet>`. Sidebar links navigate to settings sub-sections. |
| `ProfileSettings` | Fetches profile via `GET /farmer/settings/profile-data`. Submits updates via `PATCH /farmer/settings/update-profile` (multipart for photo upload). |

### 6.3 Dashboard Modules

Located in `src/Dash/`:

| Module | Description |
|---|---|
| `Dashboard.jsx` | Shell layout wrapping `Maindash` with `SideNav`. |
| `Maindash.jsx` | Homepage of the dashboard. Displays summary metrics (total sales, orders, etc.) by calling `GET /farmer/dashboard`. Likely uses Chart.js for graphs. |
| `AddItem.jsx` | Multi-field form: item name, price, category, type, quantity, unit, image. Submits to `POST /market/add-item` as `multipart/form-data`. The backend strips the image background via remove.bg before uploading to Cloudinary. |
| `Order.jsx` | Lists orders from `GET /payments/farmer-get-payment`. Allows status updates via `PATCH /payments/farmer-update-payment`. |
| `Payments.jsx` | Read-only view of payment records with totals. |
| `Message.jsx` | Messaging interface (UI present; messaging backend not found in current codebase — likely a future feature). |
| `SideNav.jsx` | Sidebar navigation inside the dashboard area with links to all Dash modules. |

### 6.4 Components

| Component | Description |
|---|---|
| `NavBar` | Top navigation bar for the retailer app. |
| `SideBar` | Global sidebar for non-dashboard pages. |
| `Footer` | Footer for public pages. |
| `Homeheader` | Hero banner for the retailer landing page. |
| `Panel` | Informational panel card component. |
| `Work` | How-it-works explanation section. |
| `LargerFarmerStore` | Desktop product grid for market view. |
| `MobileFarmerStore` | Mobile product list for market view. |
| `DashHeader` | Header bar within the dashboard pages. |
| `DiscountSection` | Displays active promo codes on the dashboard home. |
| `MainContent` | Main metrics/content area of the dashboard. |

---

## 7. Data Flow Diagrams

### 7.1 User Purchase Flow

```
Consumer Browser                   Backend                       MongoDB
      │                               │                              │
      │── POST /user/login ──────────>│                              │
      │<── { token, user } ───────────│                              │
      │  store token in localStorage  │                              │
      │                               │                              │
      │── GET /market/get-items ──────>│── Market.find({}) ─────────>│
      │<── [ items ] ─────────────────│<── items ────────────────────│
      │                               │                              │
      │── POST /user/buy-item ─────── >│── Cart.create({...}) ──────>│
      │   (Bearer token)              │<── cart doc ─────────────────│
      │<── { msg: "added" } ──────────│                              │
      │                               │                              │
      │── POST /cart/user ────────────>│── Cart.find({buyer: id}) ──>│
      │<── { cart, grandTotal } ───────│<── cart items ───────────────│
      │                               │                              │
      │── POST /payments/create-payment>│── Payment.create({...}) ──>│
      │   { cartItems, address,       │── Compute totals server-side  │
      │     farmers }                 │── PDFKit generates invoice    │
      │<── PDF blob (invoice) ─────────│<── saved payment ────────────│
      │   (downloaded automatically)  │                              │
      │                               │                              │
      │── DELETE /cart/clear ─────────>│── Cart.deleteMany({buyer}) >│
      │<── { success } ───────────────│                              │
```

### 7.2 Farmer Listing Flow

```
Retailer Browser              Backend                Cloudinary    remove.bg
      │                          │                        │              │
      │── POST /farmer/login ───>│                        │              │
      │<── { token } ────────────│                        │              │
      │                          │                        │              │
      │── POST /market/add-item ─>│ (multipart/form-data) │              │
      │   (image + item details) │                        │              │
      │                          │── Read file buffer     │              │
      │                          │── POST image ─────────────────────────>│
      │                          │<── background-removed PNG ─────────────│
      │                          │── Upload PNG stream ──>│              │
      │                          │<── Cloudinary URL ─────│              │
      │                          │── Market.create({      │              │
      │                          │     itemImage: url })  │              │
      │<── { message: "Added" } ─│                        │              │
```

### 7.3 Authentication Flow

```
Client (both apps)                Backend
      │                              │
      │── POST /[user|farmer]/login ─>│
      │   { email, password }        │
      │                              │── Find user/farmer by email
      │                              │── comparePassword(plain, hash)
      │                              │── GenerateToken({ id, email,
      │                              │     name, location }) → JWT
      │<── { token, user/farmer } ───│   (expires 3 days)
      │                              │
      │  AuthProvider.login(token)   │
      │  jwtDecode(token) → payload  │
      │  localStorage.set(token)     │
      │  setUserDetails(payload)     │
      │                              │
      │── Any protected route ───────>│
      │   Authorization: Bearer <jwt>│
      │                              │── Authentication middleware
      │                              │── verifyToken(jwt) → payload
      │                              │── req.user = payload
      │                              │── next()
      │<── Response ─────────────────│
```

### 7.4 Geo-Discovery Flow

```
Consumer Browser                   Backend                  Google Maps API
      │                               │                            │
      │  (browser geolocation API)    │                            │
      │  navigator.geolocation        │                            │
      │  → { latitude, longitude }    │                            │
      │                               │                            │
      │── POST /user/register ────────>│                            │
      │   { ..., userLocation: {lat,  │                            │
      │     lng} }                    │── User.create({            │
      │<── { user } ──────────────────│    userLocation: {lat,lng} │
      │                               │  })                        │
      │  (on login, JWT contains      │                            │
      │   location in payload)        │                            │
      │                               │                            │
      │── GET /user/fetch-nearby      │                            │
      │   -farmers (Bearer token) ───>│                            │
      │                               │── jwt payload → user.location
      │                               │── Farmer.find({}) → all farmers
      │                               │── Haversine(user, each farmer)
      │                               │── filter distance <= 30 km
      │<── { farmers: [...] } ────────│                            │
```

---

## 8. API Reference

### Authentication Headers

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

### Base URL

```
Production: https://farmisto.onrender.com
Development: http://localhost:4000
```

### User Endpoints

| Method | Endpoint | Auth | Request Body | Response |
|---|---|---|---|---|
| POST | `/user/register` | ❌ | `{ userName, email, password, userLocation }` | `{ msg, User }` |
| POST | `/user/login` | ❌ | `{ email, password }` | `{ msg, token, user }` |
| POST | `/user/buy-item` | ✅ | `{ itemName, itemPrice, imageUrl, quantity, id, farmer, itemUnit }` | `{ msg, cart }` |
| POST | `/user/get-user/:id` | ❌ | — | `{ user }` |
| POST | `/user/get-farmer` | ✅ | `{ email }` | `{ farmer }` |
| GET | `/user/fetch-nearby-farmers` | ✅ | — | `{ farmers: [] }` |
| POST | `/user/get-items-by-farmerId` | ✅ | `{ id }` | `{ items: [] }` |

### Farmer Endpoints

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| POST | `/farmer/register` | ❌ | Body: `{ farmerName, farmerEmail, farmerPassword, farmerLocation }` |
| POST | `/farmer/login` | ❌ | Body: `{ farmerEmail, farmerPassword }` |
| GET | `/farmer/settings/profile-data` | ✅ | Returns farmer profile |
| PATCH | `/farmer/settings/update-profile` | ✅ | `multipart/form-data` with optional `profilePhoto` |
| PATCH | `/farmer/settings/changePassword` | ✅ | Body: `{ oldPassword, newPassword }` |
| GET | `/farmer/dashboard` | ✅ | Returns aggregated dashboard data |
| GET | `/farmer/location` | ✅ | Returns `{ latitude, longitude }` |

### Market Endpoints

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| POST | `/market/add-item` | ✅ | `multipart/form-data`: `{ itemName, itemPrice, itemCategory, itemType, quantity, unit, itemValue, itemImage }` |
| DELETE | `/market/delete-item` | ✅ | Body: `{ id }` |
| GET | `/market/get-items` | ❌ | Returns all listings |
| GET | `/market/get-items-farmer` | ✅ | Returns farmer's own listings |

### Cart Endpoints

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| POST | `/cart/user` | ✅ | Body: `{ id }` — buyer's user ID |
| PATCH | `/cart/update/:id` | ✅ | Body: `{ quantity }` |
| DELETE | `/cart/delete/:id` | ✅ | — |
| PATCH | `/cart/discount/:id` | ✅ | Body: `{ discount }` |
| DELETE | `/cart/clear` | ✅ | Clears entire cart for buyer |

### Payment Endpoints

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| POST | `/payments/create-payment` | ✅ | Body: `{ cartItems, address, farmers }`. Response: PDF blob. |
| GET | `/payments/farmer-get-payment` | ✅ | Returns all orders involving this farmer |
| PATCH | `/payments/farmer-update-payment` | ✅ | Body: `{ field, value, id }` |

### Promo Endpoints

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| POST | `/promo/gen-promo` | ✅ | Body: `{ code, discountPercentage, expiryDate, usageLimit }` |
| POST | `/promo/apply-promo` | ❌ | Body: `{ code }` |
| DELETE | `/promo/del-promo/:id` | ✅ | — |
| GET | `/promo/list-promos` | ✅ | Returns all promos for authenticated farmer |

---

## 9. Environment Variables

### Backend (`Farmisto-Backend/.env`)

```env
# Server
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/farmisto

# Authentication
SECRET_KEY=your_jwt_secret_key_minimum_32_chars

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Google Maps
Google_Map_key=your_google_maps_api_key
```

### Consumer Frontend (`Farmisto-Frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_NODE=development
```

> In production (`VITE_NODE` ≠ `'development'`), the Axios instance hardcodes `https://farmisto.onrender.com` as the base URL.

### Retailer Dashboard (`Farmisto-Retailer/.env`)

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_NODE=development
```

---

## 10. Setup & Development

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |
| MongoDB | Atlas account or local ≥ 6.x |
| Cloudinary | Free account |
| Google Cloud | Maps Geocoding API enabled |
| remove.bg | API key (free tier: 50 calls/month) |

### 1. Clone

```bash
git clone https://github.com/bhanupratapvk06/Farmisto.git
cd Farmisto
```

### 2. Install Dependencies

```bash
# Backend
cd Farmisto-Backend && npm install && cd ..

# Consumer frontend
cd Farmisto-Frontend && npm install && cd ..

# Retailer dashboard
cd Farmisto-Retailer && npm install && cd ..
```

### 3. Configure Environment

Create `.env` files in `Farmisto-Backend/`, `Farmisto-Frontend/`, and `Farmisto-Retailer/` using the templates in [Section 9](#9-environment-variables).

### 4. Run in Development

Open three terminals:

```bash
# Terminal 1 — Backend
cd Farmisto-Backend
npm run dev          # nodemon server.js → port 4000

# Terminal 2 — Consumer App
cd Farmisto-Frontend
npm run dev          # Vite dev server → port 5173

# Terminal 3 — Retailer Dashboard
cd Farmisto-Retailer
npm run dev          # Vite dev server → port 5174 (auto-incremented)
```

Access:
- Consumer app: `http://localhost:5173`
- Retailer dashboard: `http://localhost:5174`
- Backend API: `http://localhost:4000`

---

## 11. Deployment

### Backend — Render

1. Connect the GitHub repo to [Render](https://render.com).
2. Set **Root Directory** to `Farmisto-Backend`.
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `node server.js`
5. Add all backend environment variables in Render's dashboard.
6. The live URL will be `https://farmisto.onrender.com`.

### Frontend & Retailer — Vercel

Both React apps are deployed independently on [Vercel](https://vercel.com).

**Consumer App:**
1. Import repo, set Root Directory to `Farmisto-Frontend`.
2. Build command: `npm run build` / Output: `dist`
3. Add `VITE_API_BASE_URL` and `VITE_NODE` env vars.
4. The `vercel.json` in the project handles SPA client-side routing rewrites.

**Retailer App:**
1. Import repo, set Root Directory to `Farmisto-Retailer`.
2. Same build setup as above.

**`vercel.json` pattern** (present in both frontends):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```
This ensures React Router handles all routes and avoids 404 on direct URL access.

---

## 12. Key Design Patterns & Notes

### Dual User Model
The system has two separate Mongoose models for authenticated users — `User` (consumers) and `Farmer` (retailers). Both share the same `Authentication` middleware, which works with the JWT structure from `GenerateToken`. This means the `req.user` payload is the same shape regardless of which model issued the token.

### Denormalized Seller/Buyer Info in Documents
`Market`, `Cart`, and `Payment` models all embed denormalized `seller`/`farmer`/`buyer` objects (`{ id, name, email }`) instead of purely referencing the parent document. This is a deliberate performance optimization — it prevents additional DB lookups when displaying order summaries or invoices. The trade-off is that if a farmer changes their name or email, historical records retain the old values.

### Server-Side Price Verification
`PaymentController.createPayment` recomputes `discountedPrice` and `totalItemCost` on the server, not trusting the client-supplied values. This is a critical security pattern for e-commerce — always validate monetary calculations server-side.

### PDF Invoice Streaming
`createPayment` does not save the PDF to disk. It pipes the PDFKit document stream directly into the HTTP response. The browser receives `Content-Type: application/pdf` and `Content-Disposition: attachment`, triggering an automatic download.

### Image Background Removal Pipeline
When a farmer lists a product, the image goes through remove.bg before being stored. This creates a consistent, clean look for marketplace listings. The temp file is written to `uploads/` by Multer but is not explicitly deleted after the Cloudinary upload — this is a cleanup gap to address in future iterations.

### Authentication Token Storage
Both frontends store the JWT in `localStorage`. This is convenient but exposes the token to XSS attacks. A more secure approach would be to use `httpOnly` cookies (the backend has a `/logout` endpoint that clears a cookie, suggesting this may have been the original intention).

### Mobile-Responsive Components
Several components exist in pairs — `AllBuyBlock` / `MobileBuyBlock`, `CartItems` / `MobileCartItems`, `LargerFarmerStore` / `MobileFarmerStore` — indicating responsive breakpoints are handled by rendering different components rather than purely CSS.

### No Real-Time Features
Despite having a `Message.jsx` component in the Retailer dashboard, there is no WebSocket or polling infrastructure in the current backend. This feature appears to be a UI placeholder for future implementation.
#   F a r m i s t o  
 
# 🤖 AI Inventory Operations Agent

An intelligent full-stack application that uses AI to manage inventory operations through natural language conversations. Built with React, Express, MongoDB, and Google Gemini AI.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://ai-inventory-operations-agent.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Team](#team)
- [License](#license)

---

## 🎯 Overview

The AI Inventory Operations Agent is a conversational interface for managing warehouse inventory. Instead of clicking through forms and buttons, warehouse staff can simply tell the AI what they need:

- **"Sell 5 bags of Golden Flour"** → AI processes sale and updates inventory
- **"What stock do I have?"** → AI lists all products with quantities
- **"Receive 10 bottles of cooking oil"** → AI records delivery

The system uses **Google Gemini AI** with function calling to understand natural language and execute inventory operations safely.

---

## ✨ Features

### 🤖 AI-Powered Conversation
- Natural language processing for inventory commands
- Contextual conversation with chat history
- Smart disambiguation when product names are unclear
- Friendly, helpful responses

### 📦 Inventory Management
- **Sales** - Reduce stock when items are sold
- **Deliveries** - Increase stock when shipments arrive
- **Returns** - Handle customer returns
- Real-time stock level tracking
- Automatic validation (prevents negative stock)

### 🔒 Data Safety
- MongoDB transactions for atomic operations
- Input validation on all operations
- Error handling with helpful messages
- Audit trail via transaction history

### 📊 User Interface
- Clean, modern React interface
- Real-time product listing
- Transaction history view
- Chat interface with AI agent
- Transaction confirmation workflow

---

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Fetch API** - HTTP client

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Google Gemini AI** - Language model with function calling
- **CORS** - Cross-origin support

### Deployment
- **Render** - Hosting platform
- **MongoDB Atlas** - Cloud database

---

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   React     │ ◄─────► │   Express    │ ◄─────► │  MongoDB    │
│  Frontend   │  HTTP   │   Backend    │         │   Atlas     │
└─────────────┘         └──────────────┘         └─────────────┘
                               │
                               │ API Calls
                               ▼
                        ┌──────────────┐
                        │ Google       │
                        │ Gemini AI    │
                        └──────────────┘
```

### How It Works

1. **User Input**: User types natural language command in chat
2. **AI Processing**: Gemini AI understands intent and extracts parameters
3. **Function Calling**: AI invokes backend functions (findProducts, checkStock, recordTransaction)
4. **Validation**: Backend validates the operation (sufficient stock, valid product, etc.)
5. **Database Update**: MongoDB transaction updates inventory
6. **Response**: AI generates friendly response with results
7. **UI Update**: Frontend displays updated inventory and transaction

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Yarn
- MongoDB Atlas account (or local MongoDB)
- Google AI Studio account for Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/merhawi-luel/AI_Inventory_Operations_Agent.git
cd AI_Inventory_Operations_Agent
```

2. **Install backend dependencies**
```bash
cd server
npm install
# or
yarn install
```

3. **Install frontend dependencies**
```bash
cd ../client
npm install
# or
yarn install
```

4. **Set up environment variables** (see [Environment Variables](#environment-variables))

5. **Seed the database**
```bash
cd server
npm run seed
```

6. **Start the backend**
```bash
npm start
# Backend runs on http://localhost:5000
```

7. **Start the frontend** (in new terminal)
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

8. **Open your browser**
```
http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend (`server/.env`)

```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory_db

# Server port
PORT=5000

# Google Gemini API key (from https://aistudio.google.com/apikey)
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend (`client/.env`)

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
# For production: https://your-backend.onrender.com/api
```

### Getting API Keys

**MongoDB Atlas:**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster (free tier available)
3. Get connection string from "Connect" button

**Google Gemini API:**
1. Visit https://aistudio.google.com/apikey
2. Create API key (free tier available)
3. Copy the key

---

## 📡 API Documentation

### Products

**Get All Products**
```http
GET /api/products
```

Response:
```json
[
  {
    "_id": "...",
    "code": "FLOUR-GOLDEN-001",
    "name": "Golden Flour",
    "unit": "bags",
    "quantity": 25
  }
]
```

### Chat

**Send Message to AI Agent**
```http
POST /api/chat
Content-Type: application/json

{
  "message": "Sell 5 bags of flour",
  "history": []
}
```

Response:
```json
{
  "reply": "I've processed the sale of 5 bags of Golden Flour...",
  "updatedStock": 20,
  "transaction": { ... }
}
```

### Transactions

**Get Transaction History**
```http
GET /api/transactions
```

**Get Single Transaction**
```http
GET /api/transactions/:id
```

**Confirm Transaction**
```http
POST /api/transactions/confirm
Content-Type: application/json

{
  "productCode": "FLOUR-GOLDEN-001",
  "transactionType": "sale",
  "quantity": 5
}
```

---

## 🌐 Deployment

### Deploy Backend to Render

1. Go to https://render.com
2. New Web Service → Connect GitHub repo
3. Configure:
   ```
   Name: inventory-backend
   Branch: main
   Root Directory: server
   Build Command: yarn
   Start Command: yarn start
   ```
4. Add environment variables:
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
   - `NODE_ENV=production`

### Deploy Frontend to Render

1. New Static Site → Connect GitHub repo
2. Configure:
   ```
   Name: inventory-frontend
   Branch: main
   Root Directory: client
   Build Command: yarn build
   Publish Directory: dist
   ```
3. Add environment variable:
   - `VITE_API_URL=https://your-backend.onrender.com/api`

---

## 📁 Project Structure

```
AI_Inventory_Operations_Agent/
├── client/                    # React frontend
│   ├── src/
│   │   ├── services/         # API client
│   │   ├── components/       # UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context
│   │   └── main.jsx         # Entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
├── server/                   # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js        # MongoDB connection
│   │   ├── models/
│   │   │   ├── Product.js   # Product schema
│   │   │   ├── Transaction.js # Transaction schema
│   │   │   └── Proposal.js  # Proposal schema
│   │   ├── services/
│   │   │   └── tools.js     # Inventory operations
│   │   └── server.js        # Express app
│   ├── scripts/
│   │   └── seed.js          # Database seeder
│   ├── data/
│   │   └── products.seed.json # Initial products
│   ├── .env                 # Environment variables
│   └── package.json
│
├── docs/                     # Documentation
├── README.md                # This file
└── PROJECT_DESCRIPTION.md   # Detailed description
```

---

## 🎯 How It Works - Example Flow

### Scenario: Selling 5 bags of flour

1. **User types:** "Sell 5 bags of Golden Flour"

2. **AI processes:**
   - Understands intent: SALE
   - Extracts product: "Golden Flour"
   - Extracts quantity: 5

3. **AI calls function:**
   ```javascript
   findProducts("flour") // Returns matches
   checkStock("FLOUR-GOLDEN-001") // Returns 25 bags
   ```

4. **Validation:**
   - Product exists ✓
   - Sufficient stock (25 >= 5) ✓
   - Valid quantity ✓

5. **AI calls function:**
   ```javascript
   recordTransaction({
     productCode: "FLOUR-GOLDEN-001",
     type: "sale",
     quantity: 5
   })
   ```

6. **Database update:**
   - Old stock: 25 bags
   - New stock: 20 bags
   - Transaction saved

7. **AI response:**
   "I've recorded the sale of 5 bags of Golden Flour. Previous stock was 25 bags, now you have 20 bags remaining."

8. **UI updates:**
   - Product list shows 20 bags
   - Transaction appears in history
   - Chat shows AI response

---

## 👥 Team

**Project Type:** Academic Group Project  
**Institution:** [Your University Name]  
**Course:** [Course Name]  
**Date:** October 2026

### Team Members

- **Member 1** - Frontend Development
- **Member 2** - Backend Development & Validation
- **Member 3** - AI Agent Implementation
- **Member 4** - Database Design & Setup
- **Member 5** - Documentation & Testing

---

## 📝 Key Features Implementation

### 🔐 Data Safety
- Atomic MongoDB transactions prevent data corruption
- Stock levels never go negative (validation enforced)
- Transaction audit trail for accountability

### 🤖 AI Intelligence
- Context-aware conversations (remembers chat history)
- Handles ambiguous requests ("Which soap do you mean?")
- Provides helpful error messages
- Confirms operations before execution

### 📊 Transaction Types

1. **Sale** - Customer purchase, reduces stock
2. **Delivery** - Supplier shipment, increases stock
3. **Return** - Customer return, increases stock

Each transaction records:
- Product code
- Transaction type
- Quantity moved
- Previous stock level
- New stock level
- Timestamp

---

## 🧪 Testing

### Seed Data

The system comes with 5 sample products:

| Code | Product | Unit | Initial Stock |
|------|---------|------|---------------|
| FLOUR-GOLDEN-001 | Golden Flour | bags | 25 |
| OIL-SUNFRESH-001 | SunFresh Cooking Oil | bottles | 18 |
| WATER-PUREDROP-001 | PureDrop Water | cartons | 30 |
| SOAP-SOFTCARE-001 | SoftCare Hand Soap | boxes | 12 |
| SOAP-SOFTCARE-002 | SoftCare Dish Soap | boxes | 8 |

### Test Scenarios

1. **Basic Sale**: "Sell 5 bags of Golden Flour"
2. **Delivery**: "Received 10 bottles of cooking oil"
3. **Return**: "Customer returned 2 cartons of water"
4. **Disambiguation**: "Sell 3 boxes of soap" (AI asks which soap)
5. **Insufficient Stock**: "Sell 30 bags of flour" (Error: only 25 available)

---

## 🚧 Future Enhancements

- [ ] Multi-user authentication
- [ ] Barcode scanning
- [ ] Low stock alerts
- [ ] Export reports (CSV, PDF)
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] Voice input support
- [ ] Multi-language support

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` in `client/.env`
- Restart frontend after changing `.env`
- Verify backend is running

### MongoDB connection failed
- Check MongoDB URI format
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### AI not responding
- Verify `GEMINI_API_KEY` is correct
- Check API quota not exceeded
- Review backend logs for errors

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Google Gemini AI for language understanding
- MongoDB Atlas for database hosting
- Render for deployment platform
- React and Vite teams for excellent tooling

---

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/merhawi-luel/AI_Inventory_Operations_Agent/issues)
- Email: [Your team email]

---

**Built with ❤️ by [Your Team Name]**

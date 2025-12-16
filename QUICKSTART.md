# Quick Start Guide

## 🚀 Get Started in 5 Steps

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Blockchain
cd ../blockchain
npm install

# AI Service
cd ../ai-service
pip install -r requirements.txt
```

### Step 2: Setup Environment Variables

**Follow the detailed guide:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)

**Quick setup:**
```bash
# Backend
cd backend
copy .env.template .env
# Edit .env with your credentials

# Frontend
cd ../frontend
copy .env.template .env.local
# Edit .env.local

# Blockchain
cd ../blockchain
copy .env.template .env
# Edit .env
```

### Step 3: Start MongoDB

- Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create cluster and get connection string
- Add to `backend/.env`

### Step 4: Get Test ETH

1. Install [MetaMask](https://metamask.io/)
2. Switch to Sepolia testnet
3. Get free test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

### Step 5: Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - AI Service
cd ai-service
python app.py
```

**Access the app:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Service: http://localhost:5001

---

## 📋 Minimum Required Variables

To get started quickly, you only need these:

### backend/.env
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
PORT=5000
```

### frontend/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Optional variables** (Email, SMS, Blockchain) can be added later!

---

## 🎯 Test the System

1. **Register a voter:**
   - Go to http://localhost:3000/register
   - Enter email and password
   - Note the OTP in terminal (development mode)

2. **Login:**
   - Go to http://localhost:3000/login
   - Enter credentials
   - Verify OTP

3. **Create election (Admin):**
   - Create admin user in MongoDB
   - Set `role: "admin"`
   - Login and create election

4. **Cast vote:**
   - Login as voter
   - Select election
   - Choose candidate
   - Get receipt

---

## 🔧 Deploy Smart Contracts

```bash
cd blockchain

# Compile
npx hardhat compile

# Test
npx hardhat test

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Copy contract addresses to .env files
```

---

## 📚 Full Documentation

- **Setup Guide**: [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Get all API keys
- **Walkthrough**: [walkthrough.md](./docs/walkthrough.md) - Complete features
- **API Docs**: [API.md](./docs/API.md) - All endpoints

---

## ⚡ Quick Commands

```bash
# Install all dependencies
npm run install:all

# Start all services
npm run dev:all

# Run all tests
npm run test:all

# Deploy contracts
npm run deploy:sepolia
```

---

## 🆘 Common Issues

**MongoDB connection failed:**
- Check connection string
- Whitelist IP: 0.0.0.0/0

**Frontend can't connect to backend:**
- Verify backend is running on port 5000
- Check NEXT_PUBLIC_API_URL

**Blockchain deployment failed:**
- Ensure you have test ETH
- Verify Infura RPC URL
- Check private key format

---

**Need help?** Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions!

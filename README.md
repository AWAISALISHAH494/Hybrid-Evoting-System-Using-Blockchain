# Hybrid E-Voting System

> **⚠️ COPYRIGHT NOTICE**  
> **© 2025 Ms Hira Aqeel. All Rights Reserved.**  
> This project and all its components are protected intellectual property.  
> Unauthorized use, reproduction, or derivative work is strictly prohibited.

A next-generation secure and transparent election platform combining cloud computing, blockchain technology, Zero-Knowledge Proofs, and AI-powered fraud detection.

## Features

### Core Features
- Secure online voting interface (Web + Mobile-responsive)
- Multi-factor authentication (Password + OTP + Biometric ready)
- AES-256 vote encryption
- Cloud-based vote storage (MongoDB Atlas)
- Admin dashboard with election management
- Manual vote integration for hybrid elections

### Advanced Features
- **End-to-End Verifiability** - Voters can verify their vote was counted
- **Zero-Knowledge Proofs** - Ballot secrecy with mathematical guarantees
- **AI Anomaly Detection** - Real-time fraud detection
- **Blockchain Verification** - Immutable result storage on Ethereum
- **Public Blockchain Explorer** - Transparent result verification
- **Smart Contracts** - Automated vote validation
- **Multi-language Support** - English, Urdu, Pashto
- **Multi-signature Admin** - Prevents single-point manipulation

## Technology Stack

### Frontend
- React 18 with Next.js 14
- Tailwind CSS
- Ethers.js v6
- Recharts
- Framer Motion

### Backend
- Node.js v18+
- Express.js
- MongoDB Atlas
- JWT Authentication

### Blockchain
- Ethereum Sepolia Testnet
- Solidity ^0.8.20
- Hardhat

### AI/ML
- Python 3.10+
- Flask
- scikit-learn

## Project Structure

```
hybrid-evoting-system/
├── frontend/          # React/Next.js application
├── backend/           # Node.js/Express API
├── blockchain/        # Smart contracts
├── ai-service/        # Python ML service
└── docs/              # Documentation
```

## Quick Start

### Prerequisites
- Node.js v18+
- Python 3.10+
- MongoDB Atlas account
- MetaMask wallet

### Installation

**Option 1: Quick Start (Recommended for beginners)**
```bash
# Follow the quick start guide
See QUICKSTART.md
```

**Option 2: Detailed Setup**

1. **Clone the repository**
```bash
git clone https://github.com/AWAISALISHAH494/Hybrid-Evoting-System-Using-Blockchain
cd hybrid-evoting-system
```

2. **Install Frontend**
```bash
cd frontend
npm install
```

3. **Install Backend**
```bash
cd backend
npm install
```

4. **Install Blockchain**
```bash
cd blockchain
npm install
```

5. **Install AI Service**
```bash
cd ai-service
pip install -r requirements.txt
```

### Environment Variables

**Complete Setup Guide:** See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions on obtaining all API keys and credentials.

**Quick setup:**

**Backend (.env)**
```bash
cd backend
copy .env.template .env
# Edit .env with your credentials
```

**Frontend (.env.local)**
```bash
cd frontend
copy .env.template .env.local
# Edit .env.local
```

**Blockchain (.env)**
```bash
cd blockchain
copy .env.template .env
# Edit .env
```

**Required Services:**
- MongoDB Atlas (Database) - [Get it here](https://www.mongodb.com/cloud/atlas)
- Infura (Blockchain RPC) - [Get it here](https://www.infura.io/)
- MetaMask (Wallet) - [Get it here](https://metamask.io/)
- Gmail (Email OTP) - Use your Gmail + App Password

**See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for step-by-step instructions!**

**Backend (.env)**
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BLOCKCHAIN_RPC=https://sepolia.infura.io/v3/YOUR_KEY
```

**Blockchain (.env)**
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_wallet_private_key
```

### Running the Application

1. **Start Backend**
```bash
cd backend
npm run dev
```

2. **Start Frontend**
```bash
cd frontend
npm run dev
```

3. **Start AI Service**
```bash
cd ai-service
python app.py
```

4. **Deploy Smart Contracts**
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network sepolia
```

## Documentation

- [Implementation Plan](./docs/implementation_plan.md)
- [API Documentation](./docs/api/)
- [User Manual](./docs/user-manual/)
- [Technical Documentation](./docs/technical/)
- [Merkle Tree Verification Guide](./MERKLE_VERIFICATION_GUIDE.md)
- [Blockchain Test Guide](./BLOCKCHAIN_TEST_GUIDE.md)

## Development Team

- **Awais Ali Shah** (SUMC-22-01-002-004) - Lead Developer


## Security Features

- AES-256-GCM encryption
- SHA-256 hashing
- JWT authentication
- Merkle Tree verification
- HTTPS/TLS
- CORS protection
- Rate limiting
- Smart contract auditing

## Success Metrics

- 100% end-to-end verifiability
- 99.9% system accuracy
- < 2 seconds vote encryption time
- < 5 seconds blockchain verification
- 1000+ concurrent users supported
- 95%+ AI fraud detection accuracy

## Blockchain Verification

**Deployed Smart Contracts:**
- **Network**: Ethereum Sepolia Testnet
- **VoteStorage Contract**: `0xfEe71B9cD3514a3C0819bf39A8e433733680Ca75`
- **Deployment Transaction**: [View on Etherscan](https://sepolia.etherscan.io/address/0xfEe71B9cD3514a3C0819bf39A8e433733680Ca75)

## License

**© 2025 Ms Hira Aqeel. All Rights Reserved.**

 All code, documentation, and intellectual property are owned by the authors.

**Unauthorized use, reproduction, or derivative work is strictly prohibited and constitutes academic plagiarism and copyright infringement.**

## Acknowledgments

- Sarhad University of Science and Information Technology
- Department of Computer Science & Information Technology

---

> **⚠️ IMPORTANT NOTICE**  
> **This project is protected by copyright and academic integrity policies.**  
> **Blockchain-timestamped proof of implementation: December 5, 2025**  
> **Any similar project submitted by other students will be flagged as plagiarism.**

**Session**: 2022-2026  
**Institution**: Sarhad University of Science and Information Technology, Peshawar, Pakistan  
**GitHub**: [AWAISALISHAH494/Hybrid-Evoting-System-Using-Blockchain](https://github.com/AWAISALISHAH494/Hybrid-Evoting-System-Using-Blockchain)

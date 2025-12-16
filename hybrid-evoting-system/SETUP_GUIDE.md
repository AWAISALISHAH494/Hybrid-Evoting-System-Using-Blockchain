# Environment Variables Setup Guide

This guide provides step-by-step instructions for obtaining all required environment variables for the Hybrid E-Voting System.

---

## 📋 Quick Setup Checklist

- [ ] MongoDB Atlas Database
- [ ] JWT & Encryption Keys
- [ ] Email (Gmail) Configuration
- [ ] Infura Account (Blockchain RPC)
- [ ] MetaMask Wallet
- [ ] Etherscan API Key
- [ ] Twilio (Optional - SMS)
- [ ] Firebase (Optional - File Storage)

---

## 1️⃣ MongoDB Atlas (Database)

### What you need:
- `MONGODB_URI`

### Steps:

1. **Go to MongoDB Atlas**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Click "Try Free" or "Sign In"

2. **Create Account**
   - Sign up with email or Google
   - Verify your email

3. **Create a Cluster**
   - Click "Build a Database"
   - Select "FREE" tier (M0 Sandbox)
   - Choose a cloud provider (AWS recommended)
   - Select region closest to you
   - Click "Create Cluster" (takes 3-5 minutes)

4. **Create Database User**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `evoting_admin` (or your choice)
   - Password: Click "Autogenerate Secure Password" and SAVE IT
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

5. **Whitelist IP Address**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

6. **Get Connection String**
   - Go to "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: Node.js, Version: 5.5 or later
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `myFirstDatabase` with `evoting`

---

## 2️⃣ JWT & Encryption Keys

### What you need:
- `JWT_SECRET`
- `ENCRYPTION_KEY`

### Steps:

1. **Open Terminal/PowerShell**

2. **Generate JWT Secret** (64 characters)
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   - Copy the output
   - Paste as `JWT_SECRET`

3. **Generate Encryption Key** (32 bytes)
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   - Copy the output
   - Paste as `ENCRYPTION_KEY`

**Example output:**
```
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
ENCRYPTION_KEY=f2e1d0c9b8a7z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1
```

---

## 3️⃣ Email Configuration (Gmail)

### What you need:
- `EMAIL_USER`
- `EMAIL_PASS`

### Steps:

1. **Use Gmail Account**
   - Use your existing Gmail or create new one
   - Example: `evoting.system@gmail.com`

2. **Enable 2-Factor Authentication**
   - Go to: https://myaccount.google.com/security
   - Find "2-Step Verification"
   - Click "Get Started" and follow steps

3. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Enter name: "E-Voting System"
   - Click "Generate"
   - Copy the 16-character password (no spaces)

4. **Add to .env**
   ```
   EMAIL_USER=evoting.system@gmail.com
   EMAIL_PASS=abcd efgh ijkl mnop  (remove spaces: abcdefghijklmnop)
   ```

---

## 4️⃣ Infura (Blockchain RPC)

### What you need:
- `BLOCKCHAIN_RPC_URL`
- `SEPOLIA_RPC_URL`

### Steps:

1. **Go to Infura**
   - Visit: https://www.infura.io/
   - Click "Get Started for Free"

2. **Create Account**
   - Sign up with email
   - Verify email

3. **Create New Project**
   - Click "Create New API Key"
   - Product: "Ethereum"
   - Name: "E-Voting System"
   - Click "Create"

4. **Get Sepolia Endpoint**
   - In your project dashboard
   - Find "Endpoints" section
   - Select "Sepolia" from dropdown
   - Copy the HTTPS endpoint

**Format:**
```
https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

**Example:**
```
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

## 5️⃣ MetaMask Wallet (Private Key)

### What you need:
- `PRIVATE_KEY`

### ⚠️ SECURITY WARNING:
**NEVER share your private key! NEVER commit it to GitHub!**

### Steps:

1. **Install MetaMask**
   - Visit: https://metamask.io/
   - Click "Download"
   - Install browser extension
   - Click "Create a new wallet"
   - Set password
   - **SAVE YOUR SECRET RECOVERY PHRASE** (12 words)

2. **Switch to Sepolia Testnet**
   - Click MetaMask extension
   - Click network dropdown (top)
   - Enable "Show test networks" in settings
   - Select "Sepolia test network"

3. **Get Test ETH**
   - Visit: https://sepoliafaucet.com/
   - Or: https://faucet.quicknode.com/ethereum/sepolia
   - Paste your MetaMask address
   - Request test ETH (0.5 ETH)
   - Wait 1-2 minutes

4. **Export Private Key**
   - Click MetaMask extension
   - Click three dots (⋮) next to account
   - Click "Account details"
   - Click "Show private key"
   - Enter your password
   - Click "Confirm"
   - **Copy the private key** (starts with 0x)

**Format:**
```
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

---

## 6️⃣ Etherscan API Key

### What you need:
- `ETHERSCAN_API_KEY`

### Steps:

1. **Go to Etherscan**
   - Visit: https://etherscan.io/
   - Click "Sign In" (top right)
   - Click "Click to sign up"

2. **Create Account**
   - Enter username, email, password
   - Verify email

3. **Generate API Key**
   - Login to Etherscan
   - Go to: https://etherscan.io/myapikey
   - Click "Add" button
   - App Name: "E-Voting System"
   - Click "Create New API Key"
   - Copy the API Key

**Format:**
```
ETHERSCAN_API_KEY=ABC123DEF456GHI789JKL012MNO345PQ
```

---

## 7️⃣ Twilio (Optional - SMS OTP)

### What you need:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

### Steps:

1. **Go to Twilio**
   - Visit: https://www.twilio.com/
   - Click "Sign up"

2. **Create Account**
   - Fill in details
   - Verify email and phone

3. **Get Free Trial**
   - Complete setup wizard
   - Get free trial credits ($15)

4. **Get Credentials**
   - Go to Console: https://console.twilio.com/
   - Find "Account SID" and "Auth Token"
   - Copy both

5. **Get Phone Number**
   - Click "Get a Trial Number"
   - Accept the number provided
   - Copy the phone number

**Format:**
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+15551234567
```

---

## 8️⃣ Firebase (Optional - File Storage)

### What you need:
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`

### Steps:

1. **Go to Firebase**
   - Visit: https://console.firebase.google.com/
   - Sign in with Google account

2. **Create Project**
   - Click "Add project"
   - Project name: "evoting-system"
   - Disable Google Analytics (optional)
   - Click "Create project"

3. **Add Web App**
   - Click web icon (</>) 
   - App nickname: "E-Voting Web"
   - Don't check "Firebase Hosting"
   - Click "Register app"

4. **Copy Configuration**
   - Copy all the config values shown
   - Click "Continue to console"

5. **Enable Storage**
   - Go to "Storage" (left sidebar)
   - Click "Get started"
   - Start in test mode
   - Click "Done"

**Format:**
```
FIREBASE_API_KEY=*****XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=evoting-system.firebaseapp.com
FIREBASE_PROJECT_ID=evoting-system
FIREBASE_STORAGE_BUCKET=evoting-system.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

---

## 🚀 Final Setup Steps

### 1. Create .env Files

**Backend:**
```bash
cd backend
copy .env.template .env
# Edit .env with your values
```

**Frontend:**
```bash
cd frontend
copy .env.template .env.local
# Edit .env.local with your values
```

**Blockchain:**
```bash
cd blockchain
copy .env.template .env
# Edit .env with your values
```

### 2. Verify Configuration

**Test Backend:**
```bash
cd backend
npm install
npm run dev
```

**Test Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Test Blockchain:**
```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat test
```

---

## ✅ Configuration Checklist

After setup, your files should look like this:

**backend/.env:**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=a1b2c3d4...
ENCRYPTION_KEY=f2e1d0c9...
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=abcdefghijklmnop
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/...
PRIVATE_KEY=0x1234...
```

**frontend/.env.local:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BLOCKCHAIN_RPC=https://sepolia.infura.io/v3/...
```

**blockchain/.env:**
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/...
PRIVATE_KEY=0x1234...
ETHERSCAN_API_KEY=ABC123...
```

---

## 🔒 Security Best Practices

1. ✅ **NEVER** commit .env files to Git
2. ✅ **NEVER** share private keys
3. ✅ Use different passwords for each service
4. ✅ Enable 2FA on all accounts
5. ✅ Keep backup of recovery phrases
6. ✅ Use test networks for development
7. ✅ Rotate keys regularly in production

---

## 🆘 Troubleshooting

### MongoDB Connection Error
- Check username/password
- Verify IP whitelist (0.0.0.0/0)
- Ensure database name is correct

### Email Not Sending
- Verify app password (not regular password)
- Check 2FA is enabled
- Try generating new app password

### Blockchain Connection Error
- Verify Infura project ID
- Check network (Sepolia)
- Ensure you have test ETH

### MetaMask Issues
- Switch to Sepolia network
- Get test ETH from faucet
- Check private key format (starts with 0x)

---

## 📞 Support

If you encounter issues:
1. Check error messages carefully
2. Verify all environment variables are set
3. Ensure services are running (MongoDB, Infura)
4. Review logs for specific errors

---

**Setup Complete!** 🎉

You're now ready to run the Hybrid E-Voting System!

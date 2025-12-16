# MetaMask & Infura Quick Fix Guide

## ⚠️ Issue 1: Wrong Infura Network

You have: `https://mainnet.infura.io/v3/<key>`
You need: `https://sepolia.infura.io/v3/<key>`

### Fix:

**Simply replace `mainnet` with `sepolia`:**

```
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY_HERE
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY_HERE
```

**Why?**
- Mainnet = Real Ethereum (costs real money)
- Sepolia = Test network (FREE test ETH)
- For development, always use Sepolia!

---

## 🔑 Issue 2: Getting MetaMask Private Key

**You don't need to go to MetaMask.io website!**
Use the browser extension instead.

### Step-by-Step:

#### 1. Open MetaMask Extension
- Click the MetaMask fox icon in your browser toolbar
- If not installed, install from: https://metamask.io/download/

#### 2. Switch to Sepolia Network
- Click the network dropdown at the top
- If you don't see "Sepolia test network":
  - Click "Show/hide test networks"
  - Toggle ON "Show test networks"
  - Select "Sepolia test network"

#### 3. Get Test ETH (Free!)
- Copy your wallet address (click to copy)
- Visit: https://sepoliafaucet.com/
- Paste your address
- Click "Send Me ETH"
- Wait 1-2 minutes

#### 4. Export Private Key
**⚠️ IMPORTANT: Never share this with anyone!**

**Method 1: From Account Menu**
1. Click the three dots (⋮) next to your account name
2. Click "Account details"
3. Click "Show private key"
4. Enter your MetaMask password
5. Click "Confirm"
6. Click "Hold to reveal Private Key"
7. Copy the private key (starts with 0x)

**Method 2: From Settings**
1. Click the three dots (⋮) in top right
2. Click "Settings"
3. Click "Security & Privacy"
4. Scroll to "Show private key"
5. Enter password
6. Copy the key

#### 5. Add to .env File

```bash
# blockchain/.env
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

---

## ✅ Complete Configuration

After fixing both issues, your files should look like:

### backend/.env
```
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

### frontend/.env.local
```
NEXT_PUBLIC_BLOCKCHAIN_RPC=https://sepolia.infura.io/v3/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### blockchain/.env
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

---

## 🧪 Test Your Configuration

### Test 1: Check Network
```bash
cd blockchain
node -e "const ethers = require('ethers'); const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_KEY'); provider.getNetwork().then(n => console.log('Network:', n.name, 'Chain ID:', n.chainId))"
```

Expected output:
```
Network: sepolia Chain ID: 11155111
```

### Test 2: Check Balance
```bash
node -e "const ethers = require('ethers'); const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_KEY'); const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider); wallet.provider.getBalance(wallet.address).then(b => console.log('Balance:', ethers.formatEther(b), 'ETH'))"
```

Expected output:
```
Balance: 0.5 ETH (or whatever you got from faucet)
```

---

## 🆘 Troubleshooting

### "Invalid API Key" Error
- Double-check your Infura project ID
- Make sure no extra spaces
- Verify the URL format

### "Insufficient Funds" Error
- You need test ETH from faucet
- Visit: https://sepoliafaucet.com/
- Or: https://faucet.quicknode.com/ethereum/sepolia

### "Invalid Private Key" Error
- Must start with `0x`
- Must be 66 characters (0x + 64 hex chars)
- No spaces or line breaks

### Can't Find MetaMask Extension
- Install from: https://metamask.io/download/
- Restart browser after installation
- Pin extension to toolbar

---

## 📸 Visual Guide

### Finding MetaMask Extension:
```
Browser Toolbar → 🦊 MetaMask Icon → Click
```

### Switching Networks:
```
MetaMask → Top Dropdown (shows current network) → Select "Sepolia test network"
```

### Exporting Private Key:
```
MetaMask → Three dots ⋮ → Account details → Show private key → Enter password → Copy
```

---

## ✅ Checklist

- [ ] Changed `mainnet` to `sepolia` in Infura URL
- [ ] Opened MetaMask browser extension
- [ ] Switched to Sepolia test network
- [ ] Got test ETH from faucet
- [ ] Exported private key from MetaMask
- [ ] Added private key to .env files
- [ ] Tested configuration

---

**You're all set!** 🎉

The confusion was:
- ❌ MetaMask.io website (not needed)
- ✅ MetaMask browser extension (what you need)
- ❌ Mainnet (costs real money)
- ✅ Sepolia testnet (FREE for testing)

# Blockchain Integration Test Guide

## 🧪 Testing Blockchain Storage

Follow these steps to test that results are being stored on Ethereum Sepolia:

### Step 1: Create a New Test Election
1. Go to Admin Dashboard
2. Click "Create Election"
3. Fill in details:
   - Title: "Blockchain Test Election"
   - Description: "Testing blockchain storage"
   - Start Date: Now
   - End Date: 1 hour from now
   - Add 2-3 candidates
4. Create the election

### Step 2: Cast Some Votes
1. Logout from admin
2. Register as a voter (or login as existing voter)
3. Cast a vote in the test election
4. Save your receipt ID

### Step 3: End the Election
1. Login as admin
2. Go to "Manage" for the test election
3. Change end date to past (e.g., 1 minute ago)
4. Save

### Step 4: Finalize and Store on Blockchain
1. Refresh admin dashboard
2. Election should now show status "ended"
3. Click the green "Finalize" button
4. **Watch the backend terminal** - you should see:
   ```
   📡 Storing results on Sepolia blockchain...
   Transaction sent: 0x...
   ✅ Result stored on blockchain. Block: 12345
   ✅ Blockchain storage successful! TX: 0x...
   ```

### Step 5: Verify on Etherscan
1. Copy the transaction hash from the alert
2. Go to: https://sepolia.etherscan.io/tx/YOUR_TX_HASH
3. You should see:
   - ✅ Transaction confirmed
   - ✅ Contract interaction with VoteStorage
   - ✅ Method: storeResult
   - ✅ Your wallet address as sender

### Step 6: Verify Vote Receipt
1. Go to: http://localhost:3000/explorer
2. Search for your receipt ID
3. Verify your vote was counted

---

## 🔍 What to Check

### Backend Terminal Should Show:
```
📡 Storing results on Sepolia blockchain...
Storing result for ELECTION-... on blockchain...
Transaction sent: 0xABC123...
✅ Result stored on blockchain. Block: 5678910
✅ Blockchain storage successful! TX: 0xABC123...
```

### Etherscan Should Show:
- Status: Success ✅
- From: Your wallet address
- To: VoteStorage Contract (0xfEe71B9cD3514a3C0819bf39A8e433733680Ca75)
- Function: storeResult(string _electionId, bytes32 _resultHash, uint256 _totalVotes)

---

## ⚠️ Troubleshooting

### If blockchain storage fails:

**Error: "Insufficient funds"**
- Your wallet needs Sepolia ETH
- Get free testnet ETH from: https://sepoliafaucet.com

**Error: "Network error"**
- Check BLOCKCHAIN_RPC_URL in backend/.env
- Verify Infura/Alchemy API key is valid

**Error: "Contract not found"**
- Verify VOTE_STORAGE_ADDRESS in backend/.env
- Check contract is deployed on Sepolia

**Error: "Only admin can call this"**
- Your wallet address needs to be added as admin
- Check smart contract admin permissions

---

## ✅ Success Criteria

You'll know it's working when:
1. ✅ Backend terminal shows blockchain transaction
2. ✅ Alert shows Etherscan URL
3. ✅ Transaction visible on Etherscan
4. ✅ Transaction status is "Success"
5. ✅ Contract interaction shows storeResult call

---

## 🎉 Next Steps

Once blockchain storage is working:
- All finalized elections will be on blockchain
- Results are publicly verifiable
- Voters can verify their votes were counted
- System is fully decentralized!

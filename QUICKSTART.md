# 🎓 AI Tutor with NFT Achievements - Quick Start Guide

## What You've Built

A complete decentralized learning platform with:
- ✅ Solana smart contract for tutor profiles
- ✅ Next.js frontend with Wallet integration 
- ✅ AI-powered tutoring with GPT-4
- ✅ NFT minting for lesson achievements
- ✅ On-chain progress tracking

## Getting Started

### Step 1: Configure OpenAI API Key

Edit `app/.env.local` and add your OpenAI API key:
```bash
OPENAI_API_KEY=sk-your-actual-openai-key-here
```

Get your API key from: https://platform.openai.com/api-keys

### Step 2: Start Solana Test Validator

In a new terminal, run:
```bash
wsl bash -ilc "cd /mnt/d/code2/sah/tutor_project && solana-test-validator --reset"
```

Keep this terminal running in the background.

### Step 3: Deploy the Smart Contract (if not already deployed)

```bash
wsl bash -lc "cd /mnt/d/code2/sah/tutor_project && anchor deploy"
```

### Step 4: Start the Frontend

```bash
cd app
npm run dev
```

### Step 5: Open the App

Navigate to: http://localhost:3000

## How to Use

1. **Connect Wallet**
   - Click "Connect Wallet"
   - Select Phantom or Solflare
   - Approve the connection

2. **Create Profile**
   - Enter your learning subject (e.g., "Blockchain Technology")
   - Click "Create Profile & Start Learning"
   - Approve the transaction in your wallet

3. **Start Learning**
   - SelectLesson 1 from the sidebar
   - Chat with the AI tutor
   - Ask questions and learn!

4. **Complete Lessons**
   - When you're ready, click "Complete Lesson & Mint Achievement NFT"
   - Approve the transaction
   - Your NFT will be minted and progress saved on-chain
   - Move to the next lesson!

## Features

### 🤖 AI Tutor
- Real-time chat with GPT-4
- Personalized explanations
- Context-aware responses based on current lesson

### 🏆 NFT Achievements
- Unique NFT for each completed lesson
- Stored permanently on Solana blockchain
- View your collection in the sidebar

### ⛓️ On-Chain Progress
- Profile stored as PDA on Solana
- Level increases with each lesson
- Milestone hash tracks your journey

### 📚 5 Lessons Included
1. Introduction to Blockchain
2. Solana Fundamentals
3. Smart Contracts with Anchor
4. NFTs on Solana
5. DeFi Basics

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  Wallet      │  │  AI Chat     │  │  Lessons  │ │
│  │  Integration │  │  Interface   │  │  Tracker  │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└────────────┬────────────────┬─────────────┬─────────┘
             │                │             │
             ▼                ▼             ▼
┌─────────────────┐  ┌─────────────┐  ┌──────────────┐
│  Solana Program │  │  OpenAI API │  │  Metaplex    │
│  (Anchor)       │  │  (GPT-4)    │  │  (NFTs)      │
│  - Profiles     │  │  - Tutoring │  │  - Minting   │
│  - Progress     │  │  - Q&A      │  │  - Metadata  │
└─────────────────┘  └─────────────┘  └──────────────┘
```

## Customization

### Add More Lessons

Edit `app/lib/constants.ts`:
```typescript
export const LESSONS = [
  {
    id: 6,
    title: 'Your New Lesson',
    description: 'Description here',
    content: 'Lesson content...',
    completed: false,
    nftMinted: false,
  },
  // Add more...
];
```

### Change Subject

The subject is customize when you create your profile, but you can also update it in the smart contract.

### Deploy to Devnet/Mainnet

1. Update RPC endpoint in `app/lib/constants.ts`
2. Update `Anchor.toml` cluster settings
3. Deploy with `anchor deploy --provider.cluster devnet`

## Troubleshooting

**Wallet won't connect?**
- Make sure Phantom/Solflare is installed
- Check that you're on the correct network (localhost)
- Try refreshing the page

**Transaction fails?**
- Ensure validator is running
- Check you have SOL in your wallet (airdrop: `solana airdrop 2`)
- Verify the program is deployed

**AI not responding?**
- Check your OpenAI API key in `.env.local`
- Verify you have API credits
- Check browser console for errors

**NFT minting fails?**
- Ensure wallet has enough SOL for transaction fees
- Check validator logs for errors
- Verify Metaplex packages are installed

## Next Steps

- 🌐 Deploy to Devnet for public testing
- 🎨 Customize NFT artwork and metadata
- 📈 Add more lessons and subjects
- 💾 Upload NFT metadata to IPFS/Arweave
- 🔐 Add admin features for content management

## Support

If you encounter issues:
1. Check the browser console for errors
2. Review validator logs
3. Ensure all dependencies are installed
4. Verify environment variables are set

Happy Learning! 🚀

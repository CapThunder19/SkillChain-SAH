# 🎓 AI Tutor with NFT Achievements

[![Solana](https://img.shields.io/badge/Solana-Devnet-purple)](https://solana.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Anchor](https://img.shields.io/badge/Anchor-0.30-red)](https://www.anchor-lang.com/)

A decentralized learning platform that combines AI-powered tutoring with blockchain-based achievement NFTs on Solana. Learn Web Development, Blockchain, AI/ML, Python, and Cybersecurity while earning verifiable on-chain credentials.

![AI Tutor Platform](https://img.shields.io/badge/Status-Production%20Ready-success)

## ✨ Features

### 🤖 AI-Powered Learning
- **Gemini AI Integration** - Intelligent tutoring with Google's latest Gemini 2.5 Flash model
- **Context-Aware Responses** - AI adapts to your learning progress and current lesson
- **Interactive Chat** - Real-time Q&A with detailed explanations and examples
- **Personalized Guidance** - Tailored learning experience based on your subject

### ⛓️ Blockchain Integration
- **Solana Smart Contracts** - Secure on-chain profile and progress tracking
- **NFT Achievement System** - Mint unique NFTs for each completed lesson
- **Wallet Integration** - Seamless connection with Phantom, Solflare, and other Solana wallets
- **Decentralized Credentials** - Permanent, verifiable proof of learning achievements

### 📚 Course Catalog
- **Web Development** - HTML/CSS, JavaScript, React (3 lessons)
- **Blockchain Fundamentals** - Intro to Blockchain, Cryptography, Consensus (3 lessons)
- **Solana Development** - Architecture, Smart Contracts, dApp Building (3 lessons)
- **DeFi Essentials** - DeFi Basics, Protocols, AMMs (3 lessons)
- **AI & Machine Learning** - AI Intro, Neural Networks, ML Projects (3 lessons)
- **Python Programming** - Python Basics, OOP, Projects (3 lessons)
- **Cybersecurity** - Security Fundamentals, Ethical Hacking, Best Practices (3 lessons)

**Total: 7 Courses | 21 Interactive Lessons**

### 🎨 Modern UI/UX
- **Dark/Light Mode** - Toggle between themes
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Framer Motion for fluid interactions
- **Progress Tracking** - Visual indicators for course completion
- **Category Filters** - Easily browse courses by subject

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Solana CLI** - [Installation Guide](https://docs.solana.com/cli/install-solana-cli-tools)
- **Anchor CLI** - [Installation Guide](https://www.anchor-lang.com/docs/installation)
- **Gemini API Key** - [Get Free Key](https://aistudio.google.com/app/apikey)
- **Solana Wallet** - [Phantom](https://phantom.app/) or [Solflare](https://solflare.com/)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd tutor_project
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd app
npm install
cd ..
```

3. **Configure Environment Variables**

Create `app/.env.local`:
```bash
NEXT_PUBLIC_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
GEMINI_API_KEY=your-gemini-api-key-here
```

Get your free Gemini API key from: https://aistudio.google.com/app/apikey

4. **Build the Smart Contract**
```bash
# On Windows with WSL
wsl bash -lc "cd /mnt/d/code2/sah/tutor_project && anchor build"

# On Linux/Mac
anchor build
```

5. **Start Solana Test Validator**
```bash
# On Windows with WSL
wsl bash -ilc "cd /mnt/d/code2/sah/tutor_project && solana-test-validator --reset"

# On Linux/Mac
solana-test-validator --reset
```

Keep this terminal running in the background.

6. **Deploy Smart Contract**
```bash
# On Windows with WSL
wsl bash -lc "cd /mnt/d/code2/sah/tutor_project && anchor deploy"

# On Linux/Mac
anchor deploy
```

7. **Start the Frontend**
```bash
cd app
npm run dev
```

8. **Open the App**

Navigate to: **http://localhost:3000**

### Quick Start Script (Windows)

For convenience on Windows, use the provided batch script:
```bash
start-dev.bat
```

This automatically starts both the validator and frontend.

## 📖 How to Use

### 1. Connect Your Wallet
- Click the "Connect Wallet" button in the top right
- Select your Solana wallet (Phantom, Solflare, etc.)
- Approve the connection

### 2. Create Your Profile
- Once connected, create your tutor profile
- Your progress will be saved on-chain

### 3. Browse Courses
- Filter by category: Web Development, Blockchain, AI & ML, etc.
- View course cards with progress indicators
- Click "Continue" to start or resume a course

### 4. Learn with AI
- Read lesson content (documents, videos, or interactive)
- Ask questions in the AI chat interface
- Get personalized explanations and examples

### 5. Complete Lessons & Earn NFTs
- After understanding a lesson, click "Complete Lesson & Mint Achievement NFT"
- A unique NFT is minted and sent to your wallet
- Your level increases and next lesson unlocks

### 6. Track Your Progress
- View completed lessons in the sidebar
- Check achievement NFTs earned
- See your current level

## 🏗️ Project Structure

```
tutor_project/
├── programs/
│   └── tutor_project/
│       └── src/
│           └── lib.rs              # Solana smart contract (Anchor)
├── tests/
│   └── tutor_project.ts            # Smart contract tests
├── app/                            # Next.js frontend
│   ├── app/
│   │   ├── page.tsx                # Main entry point
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── globals.css             # Global styles
│   │   └── api/
│   │       └── chat/
│   │           └── route.ts        # Gemini AI API route
│   ├── components/
│   │   ├── WalletProvider.tsx      # Solana wallet integration
│   │   ├── TutorPage.tsx           # Main app component
│   │   ├── LessonViewer.tsx        # Lesson display component
│   │   ├── AIChat.tsx              # AI chat interface
│   │   ├── FloatingChatBot.tsx     # Floating chat widget
│   │   ├── ThemeToggle.tsx         # Dark/light mode toggle
│   │   └── Toaster.tsx             # Toast notifications
│   ├── lib/
│   │   ├── types.ts                # TypeScript type definitions
│   │   ├── constants.ts            # App constants & course data
│   │   ├── anchor-client.ts        # Solana program client
│   │   └── nft-minter.ts           # NFT minting utilities
│   └── public/                     # Static assets
├── Anchor.toml                     # Anchor configuration
├── Cargo.toml                      # Rust dependencies
├── package.json                    # Root package.json
├── start-dev.bat                   # Windows startup script
├── PROJECT_COMPLETE.md             # Project documentation
├── QUICKSTART.md                   # Quick start guide
└── README.md                       # This file
```

## 🧪 Testing

### Run Smart Contract Tests
```bash
# On Windows with WSL
wsl bash -lc "cd /mnt/d/code2/sah/tutor_project && anchor test"

# On Linux/Mac
anchor test
```

All 4 tests should pass:
- ✅ Initialize tutor profile
- ✅ Update progress
- ✅ Prevent duplicate profiles
- ✅ Fetch tutor profile

## 🔧 Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Sonner** - Toast notifications

### Blockchain
- **Solana** - High-performance blockchain
- **Anchor** - Solana development framework
- **Metaplex** - NFT minting standard
- **@solana/web3.js** - Solana JavaScript SDK
- **@solana/wallet-adapter** - Wallet integration

### AI
- **Google Gemini 2.5 Flash** - Latest AI model
- **@google/generative-ai** - Gemini SDK

### Development Tools
- **Rust** - Smart contract language
- **Cargo** - Rust package manager
- **WSL** - Windows Subsystem for Linux (Windows only)

## 🎯 Smart Contract Details

### Program ID
```
DC5BMrRcTAQEk2N8B6eYzxDyuCWXjLVqP3MJEg8F2fgu
```

### Instructions

#### `create_tutor`
Creates a new tutor profile (one per wallet)
- **Accounts**: user, tutor_profile, system_program
- **Args**: subject (String)
- **Creates**: PDA-based profile with initial level 1

#### `update_progress`
Updates user's learning progress
- **Accounts**: user, tutor_profile
- **Args**: new_level (u8), milestone_hash ([u8; 32])
- **Updates**: Level and milestone tracking

### Account Structure

```rust
pub struct TutorProfile {
    pub owner: Pubkey,          // Wallet address
    pub subject: String,        // Learning subject
    pub level: u8,              // Current level
    pub created_at: i64,        // Timestamp
    pub last_milestone: [u8; 32] // Latest achievement hash
}
```

## 🌐 API Routes

### POST `/api/chat`
AI chat endpoint for tutoring interactions

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Explain smart contracts" }
  ],
  "subject": "Blockchain Fundamentals",
  "currentLesson": {
    "id": 4,
    "title": "Introduction to Blockchain"
  }
}
```

**Response:**
```json
{
  "message": "Smart contracts are self-executing programs..."
}
```

## 🐛 Troubleshooting

### Dev Server Won't Start
```bash
# Kill existing Node processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Restart
cd app
npm run dev
```

### Gemini API Errors
- Verify your API key in `app/.env.local`
- Check if key is valid at https://aistudio.google.com/app/apikey
- Ensure you're using `gemini-2.5-flash` model
- Check browser console for detailed error logs

### Wallet Connection Issues
- Make sure wallet extension is installed
- Check if wallet is set to Devnet
- Try disconnecting and reconnecting
- Clear browser cache

### Smart Contract Deployment Fails
```bash
# Reset test validator
solana-test-validator --reset

# Rebuild and deploy
anchor build
anchor deploy
```

### NFT Minting Fails
- Ensure wallet has SOL for transaction fees
- Airdrop SOL: `solana airdrop 2` (on devnet)
- Check if Metaplex program is available
- Verify connection to Solana network

### Build Errors (Module Not Found)
If you get "Module not found" errors related to `tutor_project.json`:

1. **Make sure IDL is synced**:
```bash
cd app
./sync-idl.bat  # Windows
./sync-idl.sh   # Linux/Mac
```

2. **Verify IDL file exists**:
   - Check that `app/lib/idl/tutor_project.json` exists
   - If missing, rebuild contracts: `anchor build`
   - Then sync IDL again

3. **Clear Next.js cache**:
```bash
cd app
rm -rf .next
npm run build
```

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_SOLANA_RPC_ENDPOINT` | Solana RPC URL | Yes | `https://api.devnet.solana.com` |
| `GEMINI_API_KEY` | Google Gemini API key | Yes | - |

## 🚢 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel (select the `app` directory as root)
3. Add environment variables:
   - `NEXT_PUBLIC_SOLANA_RPC_ENDPOINT`
   - `GEMINI_API_KEY`
4. Deploy

**Note**: The IDL file is already included in `app/lib/idl/`. If you redeploy the smart contract, sync the new IDL:
```bash
cd app
./sync-idl.bat  # Windows
./sync-idl.sh   # Linux/Mac
```

### Smart Contract (Mainnet)
1. Change Anchor.toml cluster to `mainnet-beta`
2. Build: `anchor build`
3. Deploy: `anchor deploy --provider.cluster mainnet`
4. Copy new program ID from deployment
5. Update `app/lib/constants.ts` with new PROGRAM_ID
6. Sync new IDL: Run `cd app && ./sync-idl.bat` (Windows) or `./sync-idl.sh` (Linux/Mac)
7. Commit and push changes

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Solana** - High-performance blockchain platform
- **Anchor** - Solana development framework
- **Google Gemini** - AI capabilities
- **Metaplex** - NFT standards
- **Next.js** - React framework

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check [PROJECT_COMPLETE.md](PROJECT_COMPLETE.md) for detailed documentation
- Review [QUICKSTART.md](QUICKSTART.md) for setup help

---

**Built with ❤️ using Solana, Next.js, and AI**

*Learn, Earn, and Own Your Achievements on the Blockchain* 🎓⚡🏆

import { PublicKey } from '@solana/web3.js';
import { Course } from './types';

// Program ID from your Anchor deployment
export const PROGRAM_ID = new PublicKey('DC5BMrRcTAQEk2N8B6eYzxDyuCWXjLVqP3MJEg8F2fgu');

// RPC endpoint - now using devnet
export const RPC_ENDPOINT = 'https://api.devnet.solana.com';

// Available Courses
export const COURSES: Course[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Build modern websites and web applications',
    icon: '🌐',
    lessons: [
      {
        id: 1,
        title: 'HTML & CSS Fundamentals',
        description: 'Learn the building blocks of the web',
        type: 'document',
        content: `# HTML & CSS Fundamentals

## Building Blocks of the Web

HTML and CSS are the foundation of every website you see on the internet.

### What is HTML?

**HTML (HyperText Markup Language)** is the structure of web pages.

#### Key Concepts:
- 🏗️ **Elements**: Building blocks (div, p, h1, etc.)
- 🏷️ **Tags**: Wrap content in opening/closing tags
- 📋 **Attributes**: Add properties to elements (class, id, href)
- 🎯 **Semantic HTML**: Use meaningful tags (header, nav, article)

### What is CSS?

**CSS (Cascading Style Sheets)** controls the appearance and layout.

#### Core Features:
1. **Selectors**: Target HTML elements
2. **Properties**: Define styles (color, font, margin)
3. **Box Model**: Margin, border, padding, content
4. **Flexbox & Grid**: Modern layout systems
5. **Responsive Design**: Adapt to different screen sizes

### Example:
\`\`\`html
<div class="card">
  <h2>Welcome</h2>
  <p>Learn web development!</p>
</div>
\`\`\`

\`\`\`css
.card {
  background: linear-gradient(to right, purple, blue);
  padding: 20px;
  border-radius: 10px;
  color: white;
}
\`\`\`

### Modern CSS Tools:
- 🎨 **Tailwind CSS**: Utility-first framework
- 💅 **Styled Components**: CSS-in-JS
- 📦 **CSS Modules**: Scoped styles`,
        duration: '15 min read',
        completed: false,
        nftMinted: false,
      },
      {
        id: 2,
        title: 'JavaScript Essentials',
        description: 'Master the language of the web',
        type: 'video',
        content: 'Learn JavaScript fundamentals',
        videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
        duration: '20 minutes',
        completed: false,
        nftMinted: false,
      },
      {
        id: 3,
        title: 'React Basics',
        description: 'Build interactive UIs with React',
        type: 'chat',
        content: 'Interactive lesson on React components, hooks, and state management',
        duration: 'Interactive',
        completed: false,
        nftMinted: false,
      },
    ],
  },
  {
    id: 'blockchain-basics',
    title: 'Blockchain Fundamentals',
    description: 'Master blockchain technology from scratch',
    icon: '⛓️',
    lessons: [
      {
        id: 4,
        title: 'Introduction to Blockchain',
        description: 'Learn the basics of blockchain technology',
        type: 'document',
        content: `# Introduction to Blockchain

## What is Blockchain?

Blockchain is a **distributed ledger technology** that records transactions across multiple computers in a way that makes it nearly impossible to hack or cheat the system.

### Key Concepts:

1. **Decentralization**: No single point of control
2. **Transparency**: All transactions are visible
3. **Immutability**: Once recorded, data cannot be altered
4. **Security**: Cryptographic protection

### How It Works:

- Transactions are grouped into blocks
- Each block contains a cryptographic hash of the previous block
- This creates a chain of blocks (blockchain)
- Multiple nodes verify and validate transactions

### Real-World Applications:

- 💰 Cryptocurrencies (Bitcoin, Ethereum)
- 📜 Smart Contracts
- 🏥 Healthcare Records
- 🚚 Supply Chain Management
- 🗳️ Voting Systems

> "Blockchain is the tech. Bitcoin is merely the first mainstream manifestation of its potential." - Marc Kenigsberg`,
        duration: '10 min read',
        completed: false,
        nftMinted: false,
      },
      {
        id: 5,
        title: 'Cryptography Basics',
        description: 'Understanding hashing and encryption',
        type: 'video',
        content: 'Learn about cryptographic principles used in blockchain',
        videoUrl: 'https://www.youtube.com/embed/wXB-V_Keiu8',
        duration: '15 minutes',
        completed: false,
        nftMinted: false,
      },
      {
        id: 6,
        title: 'Consensus Mechanisms',
        description: 'How blockchains reach agreement',
        type: 'chat',
        content: 'Interactive lesson on Proof of Work, Proof of Stake, and other consensus algorithms',
        duration: 'Interactive',
        completed: false,
        nftMinted: false,
      },
    ],
  },
  {
    id: 'solana-development',
    title: 'Solana Development',
    description: 'Build high-performance dApps on Solana',
    icon: '⚡',
    lessons: [
      {
        id: 7,
        title: 'Solana Architecture',
        description: 'Understanding Solana\'s unique design',
        type: 'document',
        content: `# Solana Architecture

## Why Solana?

Solana is a **high-performance blockchain** designed for scalability without sacrificing decentralization.

### Key Features:

1. **Speed**: 65,000+ TPS (transactions per second)
2. **Low Cost**: Transactions cost ~$0.00025
3. **Proof of History**: Unique consensus mechanism
4. **Rust-based**: Secure and efficient programming

### Core Components:

#### 1. Proof of History (PoH)
- Cryptographic clock for the network
- Enables parallel transaction processing
- Creates verifiable order of events

#### 2. Tower BFT
- Solana's consensus algorithm
- Leverages PoH for faster consensus
- Byzantine Fault Tolerant

#### 3. Accounts Model
- Everything is an account
- Programs are accounts
- Data is stored in accounts
- Rent-exempt threshold

### Development Tools:

- 🦀 **Rust**: Primary programming language
- ⚓ **Anchor**: Smart contract framework
- 🔧 **Solana CLI**: Command-line tools
- 💼 **Wallet Adapters**: For user authentication

### Program Types:

1. **Native Programs**: Built into Solana runtime
2. **Custom Programs**: User-deployed smart contracts`,
        duration: '12 min read',
        completed: false,
        nftMinted: false,
      },
      {
        id: 8,
        title: 'Building with Anchor',
        description: 'Write smart contracts using Anchor framework',
        type: 'video',
        content: 'Step-by-step guide to creating your first Anchor program',
        videoUrl: 'https://www.youtube.com/embed/CVW5BNKHuwg',
        duration: '20 minutes',
        completed: false,
        nftMinted: false,
      },
      {
        id: 9,
        title: 'Program Development',
        description: 'Deep dive into Solana program structure',
        type: 'chat',
        content: 'Interactive coding session on Solana programs',
        duration: 'Interactive',
        completed: false,
        nftMinted: false,
      },
    ],
  },
  {
    id: 'defi-essentials',
    title: 'DeFi Essentials',
    description: 'Decentralized Finance fundamentals',
    icon: '💰',
    lessons: [
      {
        id: 10,
        title: 'What is DeFi?',
        description: 'Introduction to decentralized finance',
        type: 'document',
        content: `# Decentralized Finance (DeFi)

## Understanding DeFi

DeFi is a **financial system built on blockchain** that operates without traditional intermediaries like banks.

### Core Principles:

1. **Permissionless**: Anyone can access
2. **Transparent**: All transactions visible
3. **Composable**: Protocols can interact
4. **Non-custodial**: You control your assets

### Key DeFi Categories:

#### 1. Decentralized Exchanges (DEXs)
- Swap tokens without intermediaries
- Examples: Uniswap, Raydium, Orca

#### 2. Lending & Borrowing
- Earn interest or borrow assets
- Examples: Aave, Compound, Solend

#### 3. Stablecoins
- Price-stable cryptocurrencies
- Examples: USDC, DAI, USDT

#### 4. Yield Farming
- Provide liquidity to earn rewards
- High risk, high reward strategy

#### 5. Derivatives
- Trading contracts based on asset prices
- Futures, options, perpetuals

### Benefits:

✅ 24/7 global access
✅ No geographical restrictions
✅ Lower fees than traditional finance
✅ Full asset control
✅ Transparency

### Risks:

⚠️ Smart contract bugs
⚠️ Price volatility
⚠️ Impermanent loss
⚠️ Regulatory uncertainty`,
        duration: '15 min read',
        completed: false,
        nftMinted: false,
      },
      {
        id: 11,
        title: 'AMMs & Liquidity Pools',
        description: 'How decentralized exchanges work',
        type: 'video',
        content: 'Understanding Automated Market Makers',
        videoUrl: 'https://www.youtube.com/embed/cizLhxSKrAc',
        duration: '18 minutes',
        completed: false,
        nftMinted: false,
      },
      {
        id: 12,
        title: 'DeFi Strategies',
        description: 'Learn about yield farming and strategies',
        type: 'chat',
        content: 'Interactive discussion on DeFi investment strategies',
        duration: 'Interactive',
        completed: false,
        nftMinted: false,
      },
    ],
  },
  {
    id: 'ai-machine-learning',
    title: 'AI & Machine Learning',
    description: 'Dive into artificial intelligence and ML',
    icon: '🤖',
    lessons: [
      {
        id: 13,
        title: 'Introduction to AI',
        description: 'Understanding artificial intelligence',
        type: 'document',
        content: `# Introduction to AI & Machine Learning

## What is Artificial Intelligence?

AI is the simulation of human intelligence by machines, enabling them to learn, reason, and solve problems.

### Key Branches:

#### 1. Machine Learning (ML)
- Algorithms that learn from data
- No explicit programming needed
- Improves with experience

#### 2. Deep Learning
- Neural networks with many layers
- Powers image recognition, NLP
- Requires large datasets

#### 3. Natural Language Processing (NLP)
- Understanding human language
- Chatbots, translation, sentiment analysis
- Examples: ChatGPT, Gemini

### Popular ML Algorithms:

1. **Supervised Learning**
   - Linear Regression
   - Decision Trees
   - Random Forests
   - Neural Networks

2. **Unsupervised Learning**
   - K-Means Clustering
   - Principal Component Analysis (PCA)
   - Autoencoders

3. **Reinforcement Learning**
   - Q-Learning
   - Deep Q-Networks (DQN)
   - AlphaGo, game AI

### Tools & Frameworks:

- 🐍 **Python**: Primary language
- 📊 **TensorFlow**: Google's ML library
- 🔥 **PyTorch**: Facebook's deep learning framework
- 📈 **Scikit-learn**: Classical ML algorithms
- 🤗 **Hugging Face**: Pre-trained models

### Real-World Applications:

✅ Image Recognition
✅ Voice Assistants (Siri, Alexa)
✅ Recommendation Systems (Netflix, YouTube)
✅ Autonomous Vehicles
✅ Medical Diagnosis`,
        duration: '18 min read',
        completed: false,
        nftMinted: false,
      },
      {
        id: 14,
        title: 'Neural Networks Explained',
        description: 'How deep learning works',
        type: 'video',
        content: 'Visual guide to neural networks',
        videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
        duration: '19 minutes',
        completed: false,
        nftMinted: false,
      },
      {
        id: 15,
        title: 'Building Your First ML Model',
        description: 'Hands-on machine learning project',
        type: 'chat',
        content: 'Interactive coding session to build a simple ML model',
        duration: 'Interactive',
        completed: false,
        nftMinted: false,
      },
    ],
  },
  {
    id: 'python-programming',
    title: 'Python Programming',
    description: 'Learn the most versatile programming language',
    icon: '🐍',
    lessons: [
      {
        id: 16,
        title: 'Python Basics',
        description: 'Variables, data types, and control flow',
        type: 'document',
        content: `# Python Programming Basics

## Why Python?

Python is the **most popular programming language** for beginners and professionals alike.

### Key Features:

✨ **Easy to Learn**: Simple, readable syntax
🚀 **Versatile**: Web dev, AI, data science, automation
📚 **Rich Ecosystem**: Millions of libraries
👥 **Great Community**: Extensive support

### Basic Syntax:

\`\`\`python
# Variables
name = "Alice"
age = 25
is_student = True

# Data Types
numbers = [1, 2, 3, 4, 5]
person = {"name": "Bob", "age": 30}

# Control Flow
if age >= 18:
    print("Adult")
else:
    print("Minor")

# Loops
for num in numbers:
    print(num * 2)

# Functions
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
\`\`\`

### Popular Use Cases:

1. **Web Development** (Django, Flask, FastAPI)
2. **Data Science** (Pandas, NumPy, Matplotlib)
3. **Machine Learning** (TensorFlow, PyTorch)
4. **Automation** (Selenium, Beautiful Soup)
5. **Game Development** (Pygame)

### Essential Libraries:

- 🌐 **requests**: HTTP library
- 📊 **pandas**: Data manipulation
- 🔢 **numpy**: Numerical computing
- 📈 **matplotlib**: Data visualization
- 🧪 **pytest**: Testing framework

### Best Practices:

✅ Use meaningful variable names
✅ Follow PEP 8 style guide
✅ Write docstrings for functions
✅ Use virtual environments
✅ Write unit tests`,
        duration: '20 min read',
        completed: false,
        nftMinted: false,
      },
      {
        id: 17,
        title: 'Object-Oriented Python',
        description: 'Classes, inheritance, and OOP concepts',
        type: 'video',
        content: 'Master object-oriented programming in Python',
        videoUrl: 'https://www.youtube.com/embed/Ej_02ICOIgs',
        duration: '16 minutes',
        completed: false,
        nftMinted: false,
      },
      {
        id: 18,
        title: 'Python Projects',
        description: 'Build real-world applications',
        type: 'chat',
        content: 'Interactive coding session: Build a web scraper, API, or automation script',
        duration: 'Interactive',
        completed: false,
        nftMinted: false,
      },
    ],
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Learn to protect digital systems',
    icon: '🔒',
    lessons: [
      {
        id: 19,
        title: 'Security Fundamentals',
        description: 'Core concepts of cybersecurity',
        type: 'document',
        content: `# Cybersecurity Fundamentals

## Protecting the Digital World

Cybersecurity is the practice of protecting systems, networks, and data from digital attacks.

### CIA Triad:

1. **Confidentiality** 🔐
   - Only authorized access
   - Encryption, access controls

2. **Integrity** ✅
   - Data accuracy and trustworthiness
   - Hash functions, digital signatures

3. **Availability** 🌐
   - Systems accessible when needed
   - Redundancy, DDoS protection

### Common Threats:

#### Malware
- 🦠 Viruses, worms, trojans
- 🔓 Ransomware
- 👀 Spyware

#### Social Engineering
- 🎣 Phishing emails
- 📞 Vishing (voice phishing)
- 🚪 Pretexting

#### Network Attacks
- 🌊 DDoS attacks
- 👤 Man-in-the-middle
- 🔍 Port scanning

### Defense Strategies:

1. **Authentication**
   - Strong passwords
   - Multi-factor authentication (MFA)
   - Biometrics

2. **Encryption**
   - SSL/TLS for web traffic
   - End-to-end encryption
   - VPNs for privacy

3. **Firewalls & IDS**
   - Network security
   - Intrusion detection systems
   - Security monitoring

4. **Security Awareness**
   - User training
   - Phishing simulations
   - Incident response plans

### Career Paths:

- 🛡️ Security Analyst
- 🔬 Penetration Tester
- 🏛️ Security Architect
- 🚨 Incident Responder
- 📋 Compliance Officer`,
        duration: '14 min read',
        completed: false,
        nftMinted: false,
      },
      {
        id: 20,
        title: 'Ethical Hacking Basics',
        description: 'Introduction to penetration testing',
        type: 'video',
        content: 'Learn ethical hacking fundamentals',
        videoUrl: 'https://www.youtube.com/embed/3Kq1MIfTWCE',
        duration: '22 minutes',
        completed: false,
        nftMinted: false,
      },
      {
        id: 21,
        title: 'Security Best Practices',
        description: 'Implement security in your projects',
        type: 'chat',
        content: 'Interactive lesson on secure coding, authentication, and vulnerability prevention',
        duration: 'Interactive',
        completed: false,
        nftMinted: false,
      },
    ],
  },
];

// Legacy lessons array for backward compatibility
export const LESSONS = COURSES.flatMap(course => course.lessons);

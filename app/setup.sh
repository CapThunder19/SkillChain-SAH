#!/bin/bash

# Setup script for AI Tutor Frontend

echo "🎓 Setting up AI Tutor Frontend..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Creating .env.local from example..."
    cp .env.local.example .env.local
    echo "📝 Please edit .env.local and add your OpenAI API key"
fi

# Check if IDL file exists
if [ ! -f ../target/idl/tutor_project.json ]; then
    echo "❌ Error: IDL file not found. Please run 'anchor build' first."
    exit 1
fi

# Copy IDL file
echo "📄 Copying IDL file..."
mkdir -p target/idl
cp ../target/idl/tutor_project.json target/idl/

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Setup complete!"
echo ""
echo "📌 Next steps:"
echo "1. Edit .env.local and add your OpenAI API key"
echo "2. Make sure Solana test validator is running"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "🚀 Happy learning!"

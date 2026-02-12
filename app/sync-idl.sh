#!/bin/bash
# Sync IDL from Anchor target to Next.js app

echo "Syncing IDL from target to app..."

# Check if IDL exists
if [ ! -f "../target/idl/tutor_project.json" ]; then
  echo "❌ Error: IDL file not found at ../target/idl/tutor_project.json"
  echo "Please run 'anchor build' first"
  exit 1
fi

# Copy IDL to app directory
cp ../target/idl/tutor_project.json ./lib/idl/tutor_project.json

echo "✅ IDL synced successfully!"
echo "IDL copied to: ./lib/idl/tutor_project.json"

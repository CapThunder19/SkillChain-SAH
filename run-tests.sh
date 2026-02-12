#!/bin/bash
export ANCHOR_PROVIDER_URL=http://localhost:8899
export ANCHOR_WALLET=/home/anirudh/.config/solana/id.json
cd /mnt/d/code2/sah/tutor_project
npx ts-mocha -p ./tsconfig.json -t 1000000 'tests/**/*.ts'

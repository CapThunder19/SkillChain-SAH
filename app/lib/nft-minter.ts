import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { generateSigner, percentAmount, publicKey, createSignerFromKeypair } from '@metaplex-foundation/umi';
import { Connection, Keypair } from '@solana/web3.js';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

export async function mintAchievementNFT(
  connection: Connection,
  wallet: any,
  lessonTitle: string,
  lessonId: number
) {
  try {
    console.log('🎨 Starting NFT minting process...');
    console.log('Wallet:', wallet?.publicKey?.toString());
    
    // Check wallet balance first
    const balance = await connection.getBalance(wallet.publicKey);
    const balanceSOL = balance / 1e9;
    console.log(`💰 Wallet balance: ${balanceSOL} SOL`);
    
    if (balance < 0.01 * 1e9) {
      throw new Error(`Insufficient SOL. Balance: ${balanceSOL.toFixed(4)} SOL. Need at least 0.01 SOL for minting.`);
    }
    
    console.log('Creating UMI instance...');
    console.log('RPC Endpoint:', connection.rpcEndpoint);
    
    // Create UMI instance
    const umi = createUmi(connection.rpcEndpoint)
      .use(mplTokenMetadata())
      .use(walletAdapterIdentity(wallet));

    console.log('✓ UMI instance created');
    console.log('Generating mint signer...');
    
    // Generate a new mint address
    const mint = generateSigner(umi);
    console.log('✓ Mint address generated:', mint.publicKey);

    // NFT metadata - keep name short (32 byte limit)
    const metadata = {
      name: `Lesson ${lessonId}`,
      symbol: 'TUTOR',
      uri: createMetadataUri(lessonTitle, lessonId),
    };

    console.log('Creating NFT with metadata:', metadata);
    console.log('⚠️  Note: Using placeholder URI. For production, upload metadata to IPFS/Arweave.');

    console.log('📝 Sending NFT creation transaction...');
    
    // Create the NFT
    const tx = await createNft(umi, {
      mint,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      sellerFeeBasisPoints: percentAmount(0),
      isCollection: false,
    }).sendAndConfirm(umi, { 
      confirm: { commitment: 'confirmed' },
      send: { skipPreflight: false }
    });

    console.log('✅ NFT created successfully!');
    console.log('Signature:', tx.signature);
    console.log('Mint address:', mint.publicKey);

    return {
      signature: tx.signature,
      mintAddress: mint.publicKey,
    };
  } catch (error: any) {
    console.error('❌ NFT Minting Error Details:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);
    
    // Check for common errors
    if (error.message?.includes('insufficient') || error.message?.includes('0x1')) {
      throw new Error(`Insufficient SOL for minting. Please get devnet SOL from https://faucet.solana.com`);
    } else if (error.message?.includes('URI too long') || error.message?.includes('0xd')) {
      throw new Error('Metadata URI too long. Metadata must be uploaded to IPFS/Arweave.');
    } else if (error.message?.includes('blockhash') || error.message?.includes('timeout')) {
      throw new Error('Transaction timeout. Network is slow, please try again.');
    } else if (error.message?.includes('User rejected') || error.message?.includes('rejected')) {
      throw new Error('Transaction cancelled by user.');
    } else if (error.message?.includes('fetch')) {
      throw new Error('Network error. Check your internet connection.');
    }
    
    throw new Error(`NFT minting failed: ${error.message || JSON.stringify(error)}`);
  }
}

// Create a simple metadata URI (in production, this should upload to IPFS/Arweave)
function createMetadataUri(lessonTitle: string, lessonId: number): string {
  // Use a SHORT placeholder URL - Metaplex has strict URI length limits (200 chars max)
  // In production, you should upload metadata JSON to IPFS/Arweave and use that URL
  // For now, using a short URL that fits within limits
  return `https://arweave.net/${lessonId}`;
}

export function generateMilestoneHash(lessonId: number): number[] {
  // Generate a simple hash based on lesson ID and timestamp
  const timestamp = Date.now();
  const hash = new Array(32).fill(0);
  
  // Fill with pseudo-random values based on lesson and time
  for (let i = 0; i < 32; i++) {
    hash[i] = (lessonId * 37 + timestamp + i) % 256;
  }
  
  return hash;
}

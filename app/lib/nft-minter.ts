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
    console.log('Creating UMI instance...');
    
    // Create UMI instance
    const umi = createUmi(connection.rpcEndpoint)
      .use(mplTokenMetadata())
      .use(walletAdapterIdentity(wallet));

    console.log('Generating mint signer...');
    
    // Generate a new mint address
    const mint = generateSigner(umi);

    // NFT metadata - keep name short (32 byte limit)
    const metadata = {
      name: `Lesson ${lessonId}`,
      symbol: 'TUTOR',
      uri: createMetadataUri(lessonTitle, lessonId),
    };

    console.log('Creating NFT with metadata:', metadata);

    // Create the NFT
    const tx = await createNft(umi, {
      mint,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      sellerFeeBasisPoints: percentAmount(0),
      isCollection: false,
    }).sendAndConfirm(umi, { confirm: { commitment: 'confirmed' } });

    console.log('NFT created successfully');

    return {
      signature: tx.signature,
      mintAddress: mint.publicKey,
    };
  } catch (error: any) {
    console.error('Detailed NFT minting error:', error);
    
    // Check for common errors
    if (error.message?.includes('insufficient funds')) {
      throw new Error('Insufficient SOL for minting. Get devnet SOL from faucet.');
    } else if (error.message?.includes('blockhash')) {
      throw new Error('Transaction timeout. Please try again.');
    } else if (error.message?.includes('User rejected')) {
      throw new Error('Transaction cancelled by user.');
    }
    
    throw new Error(`NFT minting failed: ${error.message || 'Unknown error'}`);
  }
}

// Create a simple metadata URI (in production, this should upload to IPFS/Arweave)
function createMetadataUri(lessonTitle: string, lessonId: number): string {
  // Create a data URI with JSON metadata (inline metadata)
  // This works for testing but should be replaced with IPFS/Arweave in production
  const metadata = {
    name: `Lesson ${lessonId}`,
    symbol: 'TUTOR',
    description: `Achievement NFT for completing: ${lessonTitle}`,
    image: `https://api.dicebear.com/7.x/shapes/svg?seed=lesson${lessonId}`,
    attributes: [
      {
        trait_type: 'Lesson ID',
        value: lessonId.toString(),
      },
      {
        trait_type: 'Category',
        value: 'Education',
      },
      {
        trait_type: 'Completed',
        value: new Date().toISOString(),
      },
    ],
  };
  
  // Use a simple base64 encoded data URI for testing
  const jsonString = JSON.stringify(metadata);
  const base64 = Buffer.from(jsonString).toString('base64');
  return `data:application/json;base64,${base64}`;
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

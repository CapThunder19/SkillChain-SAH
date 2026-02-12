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
    // Create UMI instance
    const umi = createUmi(connection.rpcEndpoint)
      .use(mplTokenMetadata())
      .use(walletAdapterIdentity(wallet));

    // Generate a new mint address
    const mint = generateSigner(umi);

    // NFT metadata - keep name short (32 byte limit)
    const metadata = {
      name: `Lesson ${lessonId} Badge`,
      symbol: 'TUTOR',
      uri: createMetadataUri(lessonTitle, lessonId),
    };

    // Create the NFT
    const tx = await createNft(umi, {
      mint,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      sellerFeeBasisPoints: percentAmount(0),
      isCollection: false,
    }).sendAndConfirm(umi);

    return {
      signature: tx.signature,
      mintAddress: mint.publicKey,
    };
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
}

// Create a simple metadata URI (in production, this should upload to IPFS/Arweave)
function createMetadataUri(lessonTitle: string, lessonId: number): string {
  // Use a simple placeholder URL instead of data URI (Metaplex has URI length limits)
  // In production, upload metadata to IPFS/Arweave
  return `https://arweave.net/lesson-${lessonId}-badge.json`;
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

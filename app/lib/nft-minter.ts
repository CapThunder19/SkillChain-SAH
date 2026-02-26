import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { generateSigner, publicKey, PublicKey } from '@metaplex-foundation/umi';
import { Connection } from '@solana/web3.js';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { createTree, mintV1, mplBubblegum } from '@metaplex-foundation/mpl-bubblegum';

export interface NFTMintOptions {
  lessonId: number;
  lessonTitle: string;
  courseTitle?: string;
  courseIcon?: string;
  rarity?: 'common' | 'rare' | 'legendary';
  quizScore?: number;
}

export async function mintAchievementNFT(
  connection: Connection,
  wallet: any,
  lessonTitle: string,
  lessonId: number,
  options?: Partial<NFTMintOptions>
) {
  const rarity = options?.rarity ?? 'common';
  const quizScore = options?.quizScore ?? 0;

  try {
    console.log('🎨 Starting cNFT minting process...');
    console.log('Wallet:', wallet?.publicKey?.toString());
    console.log('Rarity:', rarity, '| Score:', quizScore);

    // Check wallet balance first
    const balance = await connection.getBalance(wallet.publicKey);
    const balanceSOL = balance / 1e9;
    console.log(`💰 Wallet balance: ${balanceSOL} SOL`);

    if (balance < 0.01 * 1e9) {
      throw new Error(
        `Insufficient SOL. Balance: ${balanceSOL.toFixed(4)} SOL. Need at least 0.01 SOL for minting.`
      );
    }

    // Create UMI instance
    const umi = createUmi(connection.rpcEndpoint)
      .use(mplTokenMetadata())
      .use(mplBubblegum())
      .use(walletAdapterIdentity(wallet));

    console.log('✓ UMI instance created');

    // 1. Get or Create Merkle Tree (usually done once by the admin, but for this demo the user creates it if missing)
    let treeAddressStr = localStorage.getItem('merkleTreeAddress');
    let treePk: PublicKey;

    if (!treeAddressStr) {
      console.log('🌲 No Merkle Tree found in local storage. Creating a new one (This costs ~0.01 SOL just once)...');
      const merkleTree = generateSigner(umi);

      const builder = await createTree(umi, {
        merkleTree,
        maxDepth: 14,
        maxBufferSize: 64,
      });
      await builder.sendAndConfirm(umi);

      treePk = merkleTree.publicKey;
      localStorage.setItem('merkleTreeAddress', treePk.toString());
      console.log('✅ Merkle Tree created:', treePk);
    } else {
      treePk = publicKey(treeAddressStr);
      console.log('🌲 Using existing Merkle Tree:', treePk);
    }

    // Build metadata URI pointing to our on-chain API
    const metadataUri = buildMetadataUri(lessonId, rarity, quizScore);
    console.log('📋 Metadata URI:', metadataUri);

    // NFT name: keep under 32 bytes
    const nftName = buildNFTName(lessonId, rarity);

    console.log('📝 Sending cNFT creation transaction...');

    // 2. Mint Compressed NFT
    const tx = await mintV1(umi, {
      leafOwner: umi.identity.publicKey,
      merkleTree: treePk,
      metadata: {
        name: nftName,
        uri: metadataUri,
        sellerFeeBasisPoints: 0,
        collection: { key: umi.identity.publicKey, verified: false },
        creators: [
          { address: umi.identity.publicKey, verified: false, share: 100 },
        ],
      },
    }).sendAndConfirm(umi, {
      confirm: { commitment: 'confirmed' },
      send: { skipPreflight: false },
    });

    console.log('✅ Compressed NFT created successfully!');
    console.log('Signature:', tx.signature);

    return {
      signature: tx.signature,
      mintAddress: tx.signature, // For cNFTs, the exact mint address needs off-chain parsing or indexer. We return signature as a placeholder.
      rarity,
      metadataUri,
    };
  } catch (error: any) {
    console.error('❌ NFT Minting Error Details:');
    console.error('Error message:', error.message);

    if (error.message?.includes('insufficient') || error.message?.includes('0x1')) {
      throw new Error(
        `Insufficient SOL for minting. Please get devnet SOL from https://faucet.solana.com`
      );
    } else if (error.message?.includes('URI too long') || error.message?.includes('0xd')) {
      throw new Error('Metadata URI too long. Please check the API URL length.');
    } else if (error.message?.includes('blockhash') || error.message?.includes('timeout')) {
      throw new Error('Transaction timeout. Network is slow, please try again.');
    } else if (
      error.message?.includes('User rejected') ||
      error.message?.includes('rejected')
    ) {
      throw new Error('Transaction cancelled by user.');
    } else if (error.message?.includes('fetch')) {
      throw new Error('Network error. Check your internet connection.');
    }

    throw new Error(`NFT minting failed: ${error.message || JSON.stringify(error)}`);
  }
}

/**
 * Builds the metadata URI pointing to our Next.js API route.
 * Kept short to stay within Metaplex's 200-char limit.
 */
function buildMetadataUri(lessonId: number, rarity: string, score: number): string {
  // Use environment variable if available, otherwise fall back to localhost
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

  // Build a compact URL under 200 chars
  const uri = `${base}/api/nft-metadata/${lessonId}?rarity=${rarity}&score=${score}`;

  // Safety check
  if (uri.length > 200) {
    console.warn(`⚠️ Metadata URI is ${uri.length} chars, may exceed Metaplex limit.`);
    return `${base}/api/nft-metadata/${lessonId}`;
  }

  return uri;
}

/**
 * Builds a short NFT name with rarity prefix, max 32 bytes.
 */
function buildNFTName(lessonId: number, rarity: string): string {
  const prefix = rarity === 'legendary' ? '🥇' : rarity === 'rare' ? '🥈' : '🥉';
  const name = `${prefix} Tutor #${String(lessonId).padStart(3, '0')}`;
  // Ensure under 32 bytes (emojis can be 4 bytes each)
  return name.length > 28 ? `Tutor #${String(lessonId).padStart(3, '0')}` : name;
}

export function generateMilestoneHash(lessonId: number): number[] {
  const timestamp = Date.now();
  const hash = new Array(32).fill(0);
  for (let i = 0; i < 32; i++) {
    hash[i] = (lessonId * 37 + timestamp + i) % 256;
  }
  return hash;
}

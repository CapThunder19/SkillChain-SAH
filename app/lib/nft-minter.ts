import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata, createNft } from '@metaplex-foundation/mpl-token-metadata';
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { Connection } from '@solana/web3.js';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

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
    console.log('🎨 Starting Standard NFT minting process...');
    console.log('Wallet:', wallet?.publicKey?.toString());
    console.log('Lesson:', lessonTitle, '| Rarity:', rarity, '| Score:', quizScore);

    const balance = await connection.getBalance(wallet.publicKey);
    const balanceSOL = balance / 1e9;
    console.log(`💰 Wallet balance: ${balanceSOL} SOL`);

    if (balance < 0.01 * 1e9) {
      throw new Error(
        `Insufficient SOL. Balance: ${balanceSOL.toFixed(4)} SOL. Please get devnet SOL from https://faucet.solana.com`
      );
    }

    const umi = createUmi(connection.rpcEndpoint)
      .use(mplTokenMetadata())
      .use(walletAdapterIdentity(wallet));

    console.log('✓ UMI instance created');

    const appBase = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const base = process.env.NEXT_PUBLIC_APP_URL ?? appBase;

    const fallback = `${base}/api/nft-metadata/${lessonId}?rarity=${rarity}&score=${quizScore}`;
    const metadataUri = fallback.length <= 200 ? fallback : `${base}/api/nft-metadata/${lessonId}`;
    const imageUri = `${base}/api/nft-image/${lessonId}?rarity=${rarity}&score=${quizScore}`;
    console.log('📋 Metadata URI:', metadataUri);

    const nftName = buildNFTName(lessonId, rarity);
    console.log('📝 NFT name:', nftName);

    const mint = generateSigner(umi);

    console.log('📡 Sending NFT mint transaction...');

    const tx = await createNft(umi, {
      mint,
      name: nftName,
      symbol: 'TUTOR',
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(0),
      isCollection: false,
    }).sendAndConfirm(umi, {
      confirm: { commitment: 'confirmed' },
      send: { skipPreflight: false },
    });

    console.log('✅ Standard NFT minted successfully!');
    console.log('Mint address:', mint.publicKey.toString());

    return {
      signature: tx.signature,
      mintAddress: mint.publicKey,
      rarity,
      metadataUri,
      imageUri,
    };
  } catch (error: any) {
    console.error('❌ NFT Minting Error:', error.message);

    if (error.message?.includes('insufficient') || error.message?.includes('0x1')) {
      throw new Error(
        `Not enough SOL. Visit https://faucet.solana.com to get free devnet SOL.`
      );
    } else if (error.message?.includes('URI too long') || error.message?.includes('0xd')) {
      throw new Error('Metadata URI too long.');
    } else if (error.message?.includes('blockhash') || error.message?.includes('timeout')) {
      throw new Error('Transaction timed out. Network is slow — please try again.');
    } else if (error.message?.includes('User rejected') || error.message?.includes('rejected')) {
      throw new Error('Transaction cancelled by user.');
    } else if (error.message?.includes('fetch')) {
      throw new Error('Network error. Check your internet connection.');
    }

    throw new Error(`NFT minting failed: ${error.message || JSON.stringify(error)}`);
  }
}

function buildNFTName(lessonId: number, rarity: string): string {
  const prefix = rarity === 'legendary' ? '🥇' : rarity === 'rare' ? '🥈' : '🥉';
  const name = `${prefix} Tutor #${String(lessonId).padStart(3, '0')}`;
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

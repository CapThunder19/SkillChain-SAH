import { Connection, PublicKey, SystemProgram, Transaction, Keypair } from '@solana/web3.js';
import {
    createInitializeMintInstruction,
    createMintToInstruction,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    TOKEN_PROGRAM_ID,
    MINT_SIZE
} from '@solana/spl-token';

export async function awardLearnTokens(
    connection: Connection,
    wallet: any,
    amount: number = 50
) {
    if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet not connected or does not support signing');
    }

    const payer = wallet.publicKey;
    let mintPubkey: PublicKey;
    const storedMintObj = localStorage.getItem('learnTokenMintObj');

    let tx = new Transaction();
    let mintKeypair: Keypair | null = null;

    if (!storedMintObj) {
        // Need to create a new token mint just for the user (since we don't have a backend authority)
        mintKeypair = Keypair.generate();
        mintPubkey = mintKeypair.publicKey;

        const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

        tx.add(
            SystemProgram.createAccount({
                fromPubkey: payer,
                newAccountPubkey: mintPubkey,
                space: MINT_SIZE,
                lamports,
                programId: TOKEN_PROGRAM_ID,
            }),
            createInitializeMintInstruction(
                mintPubkey, // mint pubkey
                0, // decimals (0 means 1 token = 1 unit)
                payer, // mint authority
                payer // freeze authority (you can use `null`)
            )
        );
    } else {
        mintPubkey = new PublicKey(storedMintObj);
    }

    // Get ATA
    const associatedToken = await getAssociatedTokenAddress(
        mintPubkey,
        payer
    );

    // If we're creating a new mint, we definitely need a new ATA.
    // If we already have a mint, we can assume the ATA exists since we created it along with the mint.
    if (!storedMintObj) {
        tx.add(
            createAssociatedTokenAccountInstruction(
                payer,
                associatedToken,
                payer,
                mintPubkey
            )
        );
    }

    // Mint tokens 
    tx.add(
        createMintToInstruction(
            mintPubkey, // mint
            associatedToken, // receiver (should be a token account)
            payer, // mint authority
            amount, // amount
            [] // signers if any
        )
    );

    tx.feePayer = payer;
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;

    // First partially sign with mint keypair if we're creating the mint
    if (mintKeypair) {
        tx.partialSign(mintKeypair);
    }

    // Then ask the user wallet to sign the rest
    const signedTx = await wallet.signTransaction(tx);
    const signature = await connection.sendRawTransaction(signedTx.serialize());

    await connection.confirmTransaction(signature, 'confirmed');

    if (!storedMintObj) {
        localStorage.setItem('learnTokenMintObj', mintPubkey.toBase58());
    }

    return signature;
}

export async function getLearnTokenBalance(
    connection: Connection,
    walletPubkey: PublicKey
): Promise<number> {
    const storedMintObj = localStorage.getItem('learnTokenMintObj');
    if (!storedMintObj) return 0;

    try {
        const mintPubkey = new PublicKey(storedMintObj);
        const associatedToken = await getAssociatedTokenAddress(
            mintPubkey,
            walletPubkey
        );
        const accountInfo = await connection.getTokenAccountBalance(associatedToken);
        return accountInfo.value.uiAmount || 0;
    } catch (e) {
        // Account might not exist yet
        return 0;
    }
}

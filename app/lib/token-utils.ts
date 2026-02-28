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
                mintPubkey,
                0,
                payer,
                payer
            )
        );
    } else {
        mintPubkey = new PublicKey(storedMintObj);
    }

    const associatedToken = await getAssociatedTokenAddress(
        mintPubkey,
        payer
    );

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

    tx.add(
        createMintToInstruction(
            mintPubkey,
            associatedToken,
            payer,
            amount,
            []
        )
    );

    tx.feePayer = payer;
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;

    if (mintKeypair) {
        tx.partialSign(mintKeypair);
    }

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
        return 0;
    }
}

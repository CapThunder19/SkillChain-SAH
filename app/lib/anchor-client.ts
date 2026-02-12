import { Program, AnchorProvider, setProvider } from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { PROGRAM_ID, RPC_ENDPOINT } from './constants';
import { IDL } from './idl/tutor_project';

export function getProgram(connection: Connection, wallet: any) {
  // Create a proper wallet wrapper for Anchor Provider
  const walletAdapter = {
    get publicKey() {
      return wallet?.publicKey || null;
    },
    signTransaction: async (tx: any) => {
      if (!wallet?.signTransaction) throw new Error('Wallet does not support transaction signing');
      return await wallet.signTransaction(tx);
    },
    signAllTransactions: async (txs: any[]) => {
      if (!wallet?.signAllTransactions) throw new Error('Wallet does not support signing multiple transactions');
      return await wallet.signAllTransactions(txs);
    },
  };
  
  const provider = new AnchorProvider(
    connection,
    walletAdapter as any,
    { 
      commitment: 'confirmed',
      preflightCommitment: 'confirmed',
    }
  );
  setProvider(provider);
  
  // Create program with IDL and program ID
  return new Program(IDL as any, PROGRAM_ID, provider);
}

export function getTutorPDA(userPublicKey: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('tutor'), userPublicKey.toBuffer()],
    PROGRAM_ID
  );
}

export async function createTutorProfile(
  program: Program,
  userPublicKey: PublicKey,
  subject: string
) {
  const [tutorPda] = getTutorPDA(userPublicKey);
  
  const tx = await program.methods
    .create_tutor(subject)
    .accountsPartial({
      tutor: tutorPda,
      user: userPublicKey,
      system_program: SystemProgram.programId,
    })
    .rpc();
    
  return { signature: tx, pda: tutorPda };
}

export async function updateProgress(
  program: Program,
  userPublicKey: PublicKey,
  level: number,
  milestoneHash: number[]
) {
  const [tutorPda] = getTutorPDA(userPublicKey);
  
  const tx = await program.methods
    .update_progress(level, milestoneHash)
    .accountsPartial({
      tutor: tutorPda,
      owner: userPublicKey,
    })
    .rpc();
    
  return tx;
}

export async function fetchTutorProfile(program: Program, userPublicKey: PublicKey) {
  const [tutorPda] = getTutorPDA(userPublicKey);
  
  try {
    const account = await (program.account as any).tutor.fetch(tutorPda);
    return account;
  } catch (error) {
    return null;
  }
}

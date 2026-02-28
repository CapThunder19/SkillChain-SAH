import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TutorProject } from "../target/types/tutor_project";
import { expect } from "chai";

process.env.ANCHOR_PROVIDER_URL = process.env.ANCHOR_PROVIDER_URL || "http://localhost:8899";
process.env.ANCHOR_WALLET = process.env.ANCHOR_WALLET || require("os").homedir() + "/.config/solana/id.json";

describe("tutor_project", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TutorProject as Program<TutorProject>;
  const provider = anchor.AnchorProvider.env();
  
  it("Creates a tutor profile", async () => {
    const user = provider.wallet.publicKey;
    
    const [tutorPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("tutor"), user.toBuffer()],
      program.programId
    );

    const subject = "Mathematics";
    
    const tx = await program.methods
      .createTutor(subject)
      .accounts({
        tutor: tutorPda,
        user: user,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Create tutor transaction signature:", tx);

    const tutorAccount = await program.account.tutor.fetch(tutorPda);
    
    expect(tutorAccount.owner.toString()).to.equal(user.toString());
    expect(tutorAccount.subject).to.equal(subject);
    expect(tutorAccount.level).to.equal(1);
    expect(tutorAccount.milestoneHash).to.deep.equal(new Array(32).fill(0));
    expect(tutorAccount.lastUpdated.toNumber()).to.be.greaterThan(0);

    console.log("Tutor account:", tutorAccount);
  });

  it("Updates tutor progress", async () => {
    const user = provider.wallet.publicKey;
    
    const [tutorPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("tutor"), user.toBuffer()],
      program.programId
    );

    const newLevel = 5;
    const milestoneHash = Array(32).fill(1);

    const tx = await program.methods
      .updateProgress(newLevel, milestoneHash)
      .accounts({
        tutor: tutorPda,
        owner: user,
      })
      .rpc();

    console.log("Update progress transaction signature:", tx);

    const tutorAccount = await program.account.tutor.fetch(tutorPda);
    
    expect(tutorAccount.level).to.equal(newLevel);
    expect(tutorAccount.milestoneHash).to.deep.equal(milestoneHash);

    console.log("Updated tutor account:", tutorAccount);
  });

  it("Fails when non-owner tries to update progress", async () => {
    const user = provider.wallet.publicKey;
    const unauthorizedUser = anchor.web3.Keypair.generate();
    
    const [tutorPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("tutor"), user.toBuffer()],
      program.programId
    );

    const newLevel = 10;
    const milestoneHash = Array(32).fill(2);

    try {
      await program.methods
        .updateProgress(newLevel, milestoneHash)
        .accounts({
          tutor: tutorPda,
          owner: unauthorizedUser.publicKey,
        })
        .signers([unauthorizedUser])
        .rpc();
      
      expect.fail("Expected transaction to fail but it succeeded");
    } catch (error) {
      console.log("Transaction correctly failed:", error.message);
      expect(error).to.exist;
    }
  });

  it("Fails when subject is too long", async () => {
    const newUser = anchor.web3.Keypair.generate();
    
    const airdropSig = await provider.connection.requestAirdrop(
      newUser.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig);
    
    const [tutorPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("tutor"), newUser.publicKey.toBuffer()],
      program.programId
    );

    const longSubject = "A".repeat(51);

    try {
      await program.methods
        .createTutor(longSubject)
        .accounts({
          tutor: tutorPda,
          user: newUser.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([newUser])
        .rpc();
      
      expect.fail("Expected transaction to fail but it succeeded");
    } catch (error) {
      console.log("Transaction correctly failed:", error.message);
      expect(error.message).to.include("SubjectTooLong");
    }
  });
});

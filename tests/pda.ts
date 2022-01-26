import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Pda } from '../target/types/pda';


describe('pda', () => {

  // Configure the client to use the local cluster.
  let provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Pda as Program<Pda>;

  const airdropAmount = 1_000_000_000;
  const lampsToSend   =   500_000_000;

  let user1 = anchor.web3.Keypair.generate();

  it('Is initialized!', async () => {
    const programId = program.programId;

    // Create our PDA and bump
    let [pda, bump] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from("test")], programId);
    console.log(`bump: ${bump}, pubkey: ${pda.toBase58()}`);

    //let bufferc = Buffer.concat([Buffer.from("test"), Buffer.from([254])]);
//
    //let address2 = await anchor.web3.PublicKey.createProgramAddress([bufferc], programId);
//
    //console.log("Address2: ", address2.toString());

    // Airdrop some sol
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user1.publicKey, airdropAmount),
      "confirmed"
    );


    // Send sol to pda
    let tx = new anchor.web3.Transaction()
      .add(anchor.web3.SystemProgram.transfer({
          fromPubkey: user1.publicKey,
          toPubkey: pda,
          lamports: lampsToSend,
      }))

    await anchor.web3.sendAndConfirmTransaction(provider.connection, tx, [user1]);

    let balanceUser1 = await provider.connection.getBalance(user1.publicKey);
    let balancePda = await provider.connection.getBalance(pda);

    console.log("Balance User1: ", balanceUser1);
    console.log("Balance   Pda: ", balancePda);

    // Send sol to User1
    await program.rpc.sendSol(
      new anchor.BN(1_000_000),
      bump,
      {
        accounts: {
          to: user1.publicKey,
          pda: pda,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      },
    );

    balanceUser1 = await provider.connection.getBalance(user1.publicKey);
    balancePda = await provider.connection.getBalance(pda);

    console.log("Balance User1: ", balanceUser1);
    console.log("Balance   Pda: ", balancePda);

  });
});

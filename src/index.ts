import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { Transaction, PublicKey, Connection, Keypair } from "@solana/web3.js";

const mainnetCollection = new Connection(
  "https://mainnet.helius-rpc.com/?api-key=b8faf699-a3b6-4697-9a58-31d044390459",
  "confirmed"
);

const devnetCollection = new Connection(
  "https://devnet.helius-rpc.com/?api-key=b8faf699-a3b6-4697-9a58-31d044390459",
  "confirmed"
);

const testnetConnection = new Connection(
  "https://api.testnet.solana.com",
  "confirmed"
);

const connection = testnetConnection;

const token = {
  usdc: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  jup: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  pyth: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
};

const secretKey = [
  25, 72, 223, 160, 175, 39, 228, 133, 53, 40, 0, 178, 28, 198, 141, 122, 204,
  32, 181, 48, 9, 11, 105, 250, 201, 116, 251, 219, 227, 124, 28, 41, 86, 129,
  3, 117, 190, 6, 119, 121, 200, 219, 182, 34, 194, 155, 185, 125, 102, 162,
  168, 108, 102, 193, 112, 145, 117, 19, 60, 42, 73, 158, 204, 72,
];

const myKeypair = Keypair.fromSecretKey(Uint8Array.from(secretKey));
const tokenToRemove = new PublicKey(token.usdc);
const toAddress = new PublicKey("8jFS4eSQ9FeMRZFP7soUWVSpvh7vKTC758asRC85dkXa");

const fromAta = await getAssociatedTokenAddress(
  tokenToRemove,
  myKeypair.publicKey
);

console.log(myKeypair.publicKey.toBase58());

const toAta = await getAssociatedTokenAddress(tokenToRemove, toAddress);

let latestBlockhash = await connection.getLatestBlockhash();

let tx = new Transaction().add(
  createTransferCheckedInstruction(
    fromAta, // from (should be a token account)
    tokenToRemove, // mint
    toAta, // to (should be a token account)
    myKeypair.publicKey, // from's owner
    1e5, // amount, if your deciamls is 8, send 10^8 for 1 token
    6 // decimals
  )
);

tx.recentBlockhash = latestBlockhash.blockhash;

// Sign transaction

// tx.feePayer = myKeypair.publicKey;

// const signature = await connection.sendTransaction(tx, [myKeypair]);

// await connection.confirmTransaction(
//   { signature, ...latestBlockhash },
//   "confirmed"
// );

// console.log(signature);

// const fromAta = await getAssociatedTokenAddress(usdc_pub_key, publicKey);

// const toAddress = new PublicKey("EBefTt9xXvoixAousPZSkYm78j71yKRWfrXwy7duw84L");

// const toAta = await getAssociatedTokenAddress(usdc_pub_key, toAddress);

// let latestBlockhash = await connection.getLatestBlockhash();
// let tx = new Transaction().add(
//   createTransferCheckedInstruction(
//     fromAta, // from (should be a token account)
//     usdc_pub_key, // mint
//     toAta, // to (should be a token account)
//     publicKey, // from's owner
//     1e5, // amount, if your deciamls is 8, send 10^8 for 1 token
//     6 // decimals
//   )
// );

// tx.recentBlockhash = latestBlockhash.blockhash;

// // Sign transaction

// tx.feePayer = publicKey;

// signature = await sendTransaction(tx, connection);

// await connection.confirmTransaction(
//   { signature, ...latestBlockhash },
//   "confirmed"
// );

// console.log(signature);

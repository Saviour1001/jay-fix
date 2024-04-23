import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { Transaction, PublicKey, Connection, Keypair } from "@solana/web3.js";

// -----------constants----------------
const mainnetConnection = new Connection(
  "https://mainnet.helius-rpc.com/?api-key=b8faf699-a3b6-4697-9a58-31d044390459",
  "confirmed"
);

const devnetConnection = new Connection(
  "https://devnet.helius-rpc.com/?api-key=b8faf699-a3b6-4697-9a58-31d044390459",
  "confirmed"
);

const testnetConnection = new Connection(
  "https://api.testnet.solana.com",
  "confirmed"
);

const token = {
  usdc: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  jup: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  pyth: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
  usdc_devnet: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
};

const tokenDecimals = {
  usdc: 6,
  jup: 6,
  pyth: 6,
  usdc_devnet: 6,
};

// ------ assign stuff to use ------

const connection = devnetConnection;

const tokenToRemove = token.usdc;
const tokenDecimalsToRemove = tokenDecimals.usdc;
const receivingWallet = "BGfybQ2uFGPmCscCPAgJtBFXDWc5GNqzymSq3AAo6Nvi";

const tokenToRemoveAddress = new PublicKey(tokenToRemove);
const toAddress = new PublicKey(receivingWallet);

const secretKey = [
  25, 72, 223, 160, 175, 39, 228, 133, 53, 40, 0, 178, 28, 198, 141, 122, 204,
  32, 181, 48, 9, 11, 105, 250, 201, 116, 251, 219, 227, 124, 28, 41, 86, 129,
  3, 117, 190, 6, 119, 121, 200, 219, 182, 34, 194, 155, 185, 125, 102, 162,
  168, 108, 102, 193, 112, 145, 117, 19, 60, 42, 73, 158, 204, 72,
];

const myKeypair = Keypair.fromSecretKey(Uint8Array.from(secretKey));

const fromAta = await getAssociatedTokenAddress(
  tokenToRemoveAddress,
  myKeypair.publicKey
);

console.log("from Ata ", fromAta.toBase58());

// find the balance of the token
const balance = await connection.getTokenAccountBalance(fromAta);
console.log("balance ", balance);

const toAta = await getAssociatedTokenAddress(tokenToRemoveAddress, toAddress);

console.log("to Ata ", toAta.toBase58());

let latestBlockhash = await connection.getLatestBlockhash();

let tx = new Transaction().add(
  createTransferCheckedInstruction(
    fromAta, // from (should be a token account)
    tokenToRemoveAddress, // mint
    toAta, // to (should be a token account)
    myKeypair.publicKey, // from's owner
    balance.value.amount as unknown as bigint, // amount, if your deciamls is 8, send 10^8 for 1 token
    tokenDecimalsToRemove // decimals
  )
);

tx.recentBlockhash = latestBlockhash.blockhash;

tx.feePayer = myKeypair.publicKey;

const signature = await connection.sendTransaction(tx, [myKeypair]);

await connection.confirmTransaction(
  { signature, ...latestBlockhash },
  "confirmed"
);

console.log("signature ", signature);

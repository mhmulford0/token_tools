import * as dotenv from "dotenv";
dotenv.config();

import Redis from "ioredis";
const redisRead = new Redis(process.env.CONNECTION_STRING as string);
const redisWrite = new Redis(process.env.CONNECTION_STRING as string);

type MessageData = {
  wallet: string;
  contractAddress: string;
};

export function erc20balances() {
  redisRead.subscribe("erc20balances", (err) => {
    if (err) throw new Error("Failed to subscribe");
  });

  redisRead.on("message", async (_, message) => {
    const { wallet, contractAddress } = JSON.parse(message) as MessageData;

    const result = await redisWrite.set(
      `${contractAddress}-${wallet}`,
      JSON.stringify(message),
      "EX",
      900
    );

    console.info(result);
  });
}

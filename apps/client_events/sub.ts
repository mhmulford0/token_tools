import * as dotenv from "dotenv";
dotenv.config();

import Redis from "ioredis";
export const redis = new Redis(process.env.CONNECTION_STRING as string);
export const redis2 = new Redis(process.env.CONNECTION_STRING as string);

type MessageData = {
  wallet: string;
  contractAddress: string;
};

export function subscriber() {
  redis.subscribe("erc20balances", (err) => {
    if (err) throw new Error("Failed to subscribe");
  });

  redis.on("message", async (_, message) => {
    const { wallet, contractAddress } = JSON.parse(message) as MessageData;

    const result = await redis2.set(`${contractAddress}-${wallet}`, JSON.stringify(message));

    console.info(result);
  });
}

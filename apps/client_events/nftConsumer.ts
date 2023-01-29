import * as dotenv from "dotenv";
dotenv.config();

import Redis from "ioredis";
const redisRead = new Redis(process.env.CONNECTION_STRING as string);
const redisWrite = new Redis(process.env.CONNECTION_STRING as string);

type MessageData = {
  wallet: string;
};

export function nftConsumer() {
  redisRead.subscribe("nfts", (err) => {
    if (err) throw new Error("Failed to subscribe");
  });

  redisRead.on("message", async (_, message) => {

    const { wallet } = JSON.parse(message) as MessageData;

    const result = await redisWrite.set(`nft-${wallet}`, JSON.stringify(message), "EX", 900);

    console.info(result);
  });
}

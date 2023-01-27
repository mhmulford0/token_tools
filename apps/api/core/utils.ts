import { ethers } from "ethers";
import Redis from "ioredis";

export const redisRead = new Redis(process.env.CONNECTION_STRING as string);
export const redisWrite = new Redis(process.env.CONNECTION_STRING as string);

export const provider = new ethers.providers.AlchemyProvider(
  "homestead",
  process.env.ALCHEMY_API_KEY
);
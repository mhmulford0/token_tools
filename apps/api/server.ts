import * as dotenv from "dotenv";
dotenv.config();

import Fastify, { FastifyInstance } from "fastify";
import { ERC20ABI } from "./core/ERC20";

import { ethers } from "ethers";

import { z } from "zod";
import Redis from "ioredis";
import cors from "@fastify/cors";

const server: FastifyInstance = Fastify({});

server.register(cors, {
  methods: ["GET", "POST"],
  origin: "*"
});

const redis = new Redis(process.env.CONNECTION_STRING as string);

const provider = new ethers.providers.AlchemyProvider(
  "homestead",
  process.env.ALCHEMY_API_KEY
);

const reqInfo = z.object({
  wallet: z.string().length(42).startsWith("0x"),
  contractAddress: z.string().length(42).startsWith("0x"),
  blockNumber: z.coerce.number().optional(),
});

server.get("/erc20balances", async (req, res) => {
  try {
    const { contractAddress, wallet, blockNumber } = reqInfo.parse(req.query);
    const ERC20 = new ethers.Contract(contractAddress, ERC20ABI, provider);

    const cachedTokenInfo = await redis.get(`${contractAddress}-${wallet}`);
    if (cachedTokenInfo) {
      console.log(JSON.parse(cachedTokenInfo));
      return res.status(200).send(JSON.parse(cachedTokenInfo));
    }

    const [balance, decimals, name, symbol] = await Promise.all([
      ERC20.balanceOf(wallet),
      ERC20.decimals(),
      ERC20.name(),
      ERC20.symbol(),
    ]);

    const formattedBalance = ethers.utils.formatUnits(balance, decimals);
    
    redis.publish(
      "erc20balances",
      JSON.stringify({
        balance: formattedBalance,
        decimals,
        name,
        symbol,
        wallet,
        contractAddress,
      })
    );
    return res.status(200).send({ balance: formattedBalance, decimals, name, symbol });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

const start = async () => {
  try {
    await server.listen({ port: 3001 });

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();

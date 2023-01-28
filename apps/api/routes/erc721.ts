import type { FastifyInstance } from "fastify";
import { ERC20ABI } from "../core/ERC20";
import { provider, redisRead, redisWrite } from "../core/utils";

import { ethers } from "ethers";

import { z } from "zod";

export async function erc20Router(fastify: FastifyInstance) {
  const reqInfo = z.object({
    wallet: z.string().length(42).startsWith("0x"),
    contractAddress: z.string().length(42).startsWith("0x"),
    blockNumber: z.coerce.number().optional(),
  });

  fastify.get("/erc721", (req, res) => {
    const { contractAddress, wallet, blockNumber } = reqInfo.parse(req.query);
    const ERC721 = new ethers.Contract(contractAddress, ERC20ABI, provider);
  });
}

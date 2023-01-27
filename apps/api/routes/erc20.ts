import type { FastifyInstance } from "fastify";
import { ERC20ABI } from "../core/ERC20";
import { provider, redisRead, redisWrite } from "../core/utils";

import { ethers } from "ethers";

import { z } from "zod";

export async function erc20Router(fastify: FastifyInstance) {
  fastify.get("/erc20balances", async (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    try {
      res.header("Cache-Control", "s-maxage=900, stale-while-revalidate");
      const reqInfo = z.object({
        wallet: z.string().length(42).startsWith("0x"),
        contractAddress: z.string().length(42).startsWith("0x"),
        blockNumber: z.coerce.number().optional(),
      });

      const { contractAddress, wallet, blockNumber } = reqInfo.parse(req.query);
      const ERC20 = new ethers.Contract(contractAddress, ERC20ABI, provider);

      const cachedTokenInfo = await redisRead.get(`${contractAddress}-${wallet}`);
      if (cachedTokenInfo) {
        console.log(JSON.parse(cachedTokenInfo));
        return res.status(200).send(JSON.parse(cachedTokenInfo));
      }

      const [balance, decimals, name, symbol, totalSupply] = await Promise.all([
        ERC20.balanceOf(wallet),
        ERC20.decimals(),
        ERC20.name(),
        ERC20.symbol(),
        ERC20.totalSupply(),
      ]);

      const formattedBalance = ethers.utils.formatUnits(balance, decimals);

      redisWrite.publish(
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
}

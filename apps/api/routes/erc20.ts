import type { FastifyInstance } from "fastify";
import { ERC20ABI } from "../core/ERC20";
import { provider, redisRead, redisWrite } from "../core/utils";

import { ethers } from "ethers";

import { z } from "zod";

export default async function erc20Router(fastify: FastifyInstance) {
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

      const cachedTokenInfo = await redisRead.get(`erc20-${contractAddress}-${wallet}`);
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

  fastify.get("/erc20snapshot", (req, res) => {
    const reqInfo = z.object({
      contractAddress: z.string().length(42).startsWith("0x"),
      blockNumber: z.coerce.number(),
    });
    const { contractAddress, blockNumber } = reqInfo.parse(req.query);

    const filter = {
      address: contractAddress,
      topics: [ethers.utils.id("Transfer(address,address,uint256)")],
      fromBlock: 15390081,
      toBlock: 16502028,
    };
    // setTimeout(() => {
    //   // Retrieve past logs for the "Transfer" event
    //   provider.getLogs(filter).then((logs) => {
    //     // Create a set to store unique addresses
    //     const addresses = new Set();

    //     // Iterate through the logs and add the from and to addresses to the set
    //     logs.map((log) => {
    //       // console.log(log);
    //       const event = new ethers.utils.Interface(ERC20ABI).parseLog(log);
    //       // addresses.add(event.name);
    //       // addresses.add(event.args);

    //       console.log(event);
    //     });

    //     console.log(Array.from(addresses));
    //   });
    // }, 250);

    return res.status(200).send("")
  });
}

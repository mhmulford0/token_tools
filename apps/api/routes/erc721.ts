import type { FastifyInstance } from "fastify";
import { ERC20ABI } from "../core/ERC20";
import { provider, redisRead, redisWrite } from "../core/utils";
import { Alchemy, Network } from "alchemy-sdk";
import { ethers } from "ethers";

import { z } from "zod";

export default async function erc721Router(fastify: FastifyInstance) {
  const reqInfo = z.object({
    wallet: z.string().length(42).startsWith("0x"),
  });

  const config = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);

  fastify.get("/erc721", async (req, res) => {
    const { wallet } = reqInfo.parse(req.query);

    const cachedTokenInfo = await redisRead.get(`nft-${wallet}`);
    if (cachedTokenInfo) {
      res.header("Cache-Control", "s-maxage=900, stale-while-revalidate");
      return res.status(200).send(JSON.parse(cachedTokenInfo));
    }

    const { ownedNfts } = await alchemy.nft.getNftsForOwner(wallet);
    // console.log(ownedNfts);

    redisWrite.publish("nfts", JSON.stringify({ nfts: ownedNfts, wallet: wallet }));

    return res.status(200).send({ nfts: ownedNfts, wallet });
  });
}

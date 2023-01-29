import { erc20balances } from "./erc20balances";
import { nftConsumer } from "./nftConsumer";

async function start() {
  erc20balances();
  nftConsumer()
}

try {
  start();
} catch (err) {
  console.log(err);
  process.exit(1);
}

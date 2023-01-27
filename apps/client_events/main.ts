import { erc20balances } from "./erc20balances";

async function start() {
  erc20balances();
}

try {
  start();
} catch (err) {
  console.log(err);
  process.exit(1);
}

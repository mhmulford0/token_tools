import { subscriber } from "./sub";

async function start() {
  subscriber();
}
start().catch((err) => {
  console.log(err)
  process.exit(1);
});

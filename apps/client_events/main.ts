import { Queue } from "bullmq";

const myQueue = new Queue("foo");

async function addJobs() {
  await myQueue.add("myJobName", { foo: "bar" });
  await myQueue.add("myJobName", { qux: "baz" });
}

async function start() {
  await addJobs();
}
start();

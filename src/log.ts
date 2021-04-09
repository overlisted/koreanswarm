import { cursorTo } from "readline";

const load = (message: any) => process.stdout.write(`[ ] ${message}`);
const done = () => {
  cursorTo(process.stdout, 0);
  console.log("[✔️]");
};
const fail = () => {
  cursorTo(process.stdout, 0);
  console.log("[!]");
};

export default { load, done, fail };

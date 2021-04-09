import createClient from "./createClient";
import accounts from "./accounts";
import { format } from "doge-utils";
import { readFile } from "fs/promises";
import sleep from "./sleep";
import log from "./log";

let kill: Function;
let death: Promise<void> = new Promise((resolve) => (kill = resolve));

const main = async () => {
  let currentLog = "";
  try {
    log.load("Loading text");

    const script = (await readFile("./config/script.txt", "utf-8")).split("\n");

    log.done();
    log.load("Loading accounts");

    const clients = await Promise.all(
      accounts.map((account) => createClient(account))
    );

    log.done();
    log.load("Creating room");

    const info = await clients[0].mutation.createRoom({
      name: "🐝 Bee swarm simulator 🐝",
      privacy: "public",
      description:
        "Satire; if you want me to stop, say it in the Discord server (#dogehouse)",
    });

    if ("error" in info) throw "room fail";

    log.done();
    log.load("Joining room");

    const { room } = info;

    await Promise.all(
      clients.map((client) => client.query.joinRoomAndGetInfo(room.id))
    );

    log.done();

    let scriptIndex = 0;

    while (true)
      for (const i in clients) {
        const client = clients[i];
        if (!script[scriptIndex]) scriptIndex = 0;
        client.mutation.sendRoomChatMsg(format(script[scriptIndex]));
        scriptIndex++;
        await sleep(1000 / clients.length);
      }
  } catch (e) {
    log.fail();
  }

  return death;
};

main();

import createClient from "./createClient";
import accounts from "./accounts";
import { format } from "doge-utils";
import sleep from "./sleep";
import log from "./log";
import { tokensToString } from "@dogehouse/kebab";
import { writeFile, readFile } from "fs/promises";
import ClientSwarm from "./ClientSwarm";
import fizzBuzzName from "./fizzBuzzName";

let kill: Function;
let death: Promise<void> = new Promise((resolve) => (kill = resolve));

const main = async () => {
  try {
    log.load("Loading accounts");

    const swarm = new ClientSwarm(
      await Promise.all(accounts.map((account) => createClient(account)))
    );

    log.done();
    log.load("Creating room");

    await swarm.createRoom({
      name: fizzBuzzName(0),
      privacy: "public",
      description: "yes",
    });

    log.done();
    log.load("Going to speakers");

    await swarm.speak();

    log.done();
    log.load("Subscribing to messages");

    swarm.first.subscribe.newChatMsg(({ userId, msg }) => {
      console.log(`${msg.username}: ${tokensToString(msg.tokens)}`);
      if (tokensToString(msg.tokens) === "!speak")
        swarm.first.mutation.addSpeaker(userId);
    });

    log.done();
    log.load("Loading autosave");

    let fi = parseInt(await readFile("./config/progress.txt", "utf-8"));
    if (isNaN(fi)) fi = 0;

    log.done();

    while (fi <= 1000000) {
      swarm.first.mutation.editRoom({
        name: fizzBuzzName(0),
        privacy: "public",
        description: "yes",
      });
      writeFile("./config/progress.txt", fi.toString());
      console.log("\nUpdated room info\n");
      for (const i in swarm.clients) {
        const client = swarm.clients[i];
        let msg = "";
        if (fi % 3 == 0) msg += "fizz";
        if (fi % 5 == 0) msg += "buzz";
        await client.mutation.sendRoomChatMsg(format(`${fi} - ${msg}`));
        await sleep(1000 / swarm.clients.length);
        fi++;
      }
    }

    setInterval(
      async () =>
        await swarm.forEach((client) =>
          client.mutation.sendRoomChatMsg(format("We did it boys!"))
        ),
      10000
    );
  } catch (e) {
    log.fail();
    console.error(e);
  }

  return death;
};

main();

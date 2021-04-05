import createClient from "./createClient";
import { accounts } from "./accounts";
/* import { Client } from "dogehouse.js"; */
import { Wrapper as Client } from "dodgy-kebab";
import { format } from "doge-utils";
import { readFile } from "fs/promises";

/* 
import cluster from "cluster";
if (c  require("./parent");
} else {
  require("./child");
}
 */

const main = async () => {
  const hlasky = (await readFile("./config/hlasky.txt", "utf-8")).split("\n");
  let clients: Client[] = [];
  for (let i = 0; i < accounts.count; i++) {
    clients.push(await createClient(accounts[i]));
    console.log(`Adding accounts (${i + 1} / ${accounts.count})`);
  }

  const { rooms } = await clients[0].query.getTopPublicRooms();

  for (let j = 0; j < rooms.length; j++) {
    const room = rooms[j];
    console.log(`Raiding room ${j + 1} / ${rooms.length}`);
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      await client.query.joinRoomAndGetInfo(room.id);
      console.log(`  Joining room (${i + 1} / ${accounts.count})`);
    }

    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      await client.mutation.sendRoomChatMsg(format(hlasky[i]));
      console.log(`  Sending message (${i + 1} / ${accounts.count})`);
    }

    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      await client.mutation.leaveRoom();
      console.log(`  Leaving room (${i + 1} / ${accounts.count})`);
    }
  }

  process.exit();
};

main();

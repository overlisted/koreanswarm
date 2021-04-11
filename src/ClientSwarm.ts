import { Wrapper } from "@dogehouse/kebab";

class ClientSwarm {
  clients: Wrapper[];
  forEach: (func: (client: Wrapper) => void) => Promise<void[]>;
  first: Wrapper;
  speak: () => Promise<void>;
  createRoom: (data: {
    name: string;
    privacy: string;
    description: string;
  }) => Promise<void>;

  constructor(clients: Wrapper[]) {
    this.clients = clients;

    this.forEach = (func: (client: Wrapper) => void) =>
      Promise.all(clients.map(func));
    this.first = clients[0];

    this.speak = async () => {
      const users = this.clients.map((client) => client.connection.user);
      await this.forEach((client) => client.mutation.askToSpeak());
      await Promise.all(
        users.map((user) => this.first.mutation.addSpeaker(user.id))
      );
      await Promise.all(
        users.map((user) => this.first.mutation.changeModStatus(user.id, true))
      );
    };

    this.createRoom = async (data) => {
      const info = await this.first.mutation.createRoom(data);
      if ("error" in info) throw info.error;
      const { room } = info;
      await this.forEach((client) => client.query.joinRoomAndGetInfo(room.id));
    };
  }
}

export default ClientSwarm;

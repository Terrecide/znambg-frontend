import { client, session } from "$lib/stores/auth";
import { Client, Session, type Socket } from "@heroiclabs/nakama-js";
import { v4 as uuidv4 } from "uuid";

class Nakama {
  client: Client | undefined;
  session: Session | undefined;
  socket: Socket | undefined;
  matchID: string | undefined;

  constructor() {
    this.client;
    this.session;
    this.socket; // ep4
    this.matchID; // ep4
  }

  async authenticateDevice() {
    this.client = new Client("defaultkey", "localhost", "7350");
    this.client.ssl = false;

    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem("deviceId", deviceId);
    }

    this.session = await this.client.authenticateDevice(deviceId, true);
    localStorage.setItem("user_id", this.session.user_id);

    // ep4
    const trace = false;
    this.socket = this.client.createSocket(false, trace);
    await this.socket.connect(this.session);

    client.set(this.client);
    session.set(this.session);
  }

  async authenticateEmail(email: string, password: string) {
    try {
      this.client = new Client("defaultkey", "localhost", "7350");
      this.client.ssl! = false;

      let session = await this.client.authenticateEmail(email, password);
      localStorage.setItem("user_id", this.session!.user_id);

      const trace = false;
      this.socket = this.client.createSocket(false, trace);
      await this.socket.connect(session, true);
      client.set(this.client);
      session.set(this.session);

      console.log("User connected:", session);
    } catch (error) {
      console.log(error);
    }
  }

  async findMatch() {
    try {
      // ep4
      const rpcid = "find_match";
      const matches = await this.client!.rpc(this.session!, rpcid, {});

      this.matchID = matches.payload.matchIds[0];
      console.log(matches, this.matchID);
      await this.socket!.joinMatch(this.matchID);
      console.log("Matched joined!");
    } catch (error) {
      console.log(error);
    }
  }

  async makeMove(index: any) {
    try {
      // ep4
      var data = { position: index };
      await this.socket!.sendMatchState(this.matchID!, 4, JSON.stringify(data));
      console.log("Match data sent");
    } catch (error) {
      console.log(error);
    }
  }

  getClient() {
    return this.client;
  }

  getSession() {
    return this.session;
  }
}

export default new Nakama();

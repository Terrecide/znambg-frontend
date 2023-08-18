import { writable } from "svelte/store";
import { type Client, type Session, type Socket } from "@heroiclabs/nakama-js";

type Nakama = {
  client: Client;
  session: Session;
  socket: Socket;
};

export const nakama = writable<Nakama | object>({});

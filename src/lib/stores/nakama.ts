import { writable } from "svelte/store";
import type { Client, Session, Socket, Presence } from "@heroiclabs/nakama-js";

type Nakama = {
  client: Client | null;
  session: Session | null;
  socket: Socket | null;
  presences: Presence[];
};

export const nakama = writable<Nakama>({
  client: null,
  session: null,
  socket: null,
  presences: [],
});

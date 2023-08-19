import { writable } from "svelte/store";

type GameState = {
  gameStarted: boolean;
};

export const gameStateStore = writable<GameState>({
  gameStarted: false,
});

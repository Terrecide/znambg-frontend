import { writable } from "svelte/store";

export const gameState = writable({
    message: 'Not Enough Players To Start',
    required: 2,
    current: 1,
    gameStarted: false
});
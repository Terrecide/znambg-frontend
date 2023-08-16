import { writable } from "svelte/store";

export let client = writable(null);
export let session = writable(null);

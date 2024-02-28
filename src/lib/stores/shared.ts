import { writable } from "svelte/store";

export const generalAlerts = writable<
  {
    id: string;
    title: string;
    description: string;
    style: string;
    selfDismiss?: boolean;
  }[]
>([]);

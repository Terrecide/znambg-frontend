// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
type User = {
  token: string;
  refreshToken: string;
};

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
    interface Locals {
      user: User | null;
    }
  }
}

export {};

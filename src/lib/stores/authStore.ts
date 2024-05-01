import { writable } from "svelte/store";
import type firebase from "firebase/app";

const authStore = writable<{
  isLoggedIn: boolean;
  user?: firebase.UserInfo;
  firebaseControlled: boolean;
  userDetails?: {
    createdAt: {
      seconds: number;
      nanoseconds: number;
    };
    displayName?: string;
    uid: string;
    /* photo: {
      name: string;
      url: string;
    };
    name: string;
    surname: string;
    username: string;
    address: string;
    email: string;
    description: string;
    verified?: boolean; */
  } | null;
}>({
  isLoggedIn: false,
  firebaseControlled: false,
});

export default authStore;

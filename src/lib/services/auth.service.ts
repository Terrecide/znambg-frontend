import { generalAlerts } from "$lib/stores/shared";
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { get } from "svelte/store";
import { v4 as uuidv4 } from "uuid";

export async function loginUser(email, password) {
  try {
    await signInWithEmailAndPassword(getAuth(), email, password);
  } catch (error) {
    generalAlerts.set([
      ...get(generalAlerts),
      {
        id: uuidv4(),
        title: "Грешка!",
        description: "Неправилен имейл и/или парола.",
        style: "danger",
      },
    ]);
  }
}

export async function registerUser(email, password, displayName) {
  try {
    const result = await createUserWithEmailAndPassword(
      getAuth(),
      email,
      password
    );
    await setDoc(
      doc(getFirestore(), "users", result.user.uid),
      {
        uid: result.user.uid,
        displayName: displayName,
      },
      { merge: true }
    );
    window.location.href = "/";
  } catch (error) {
    generalAlerts.set([
      ...get(generalAlerts),
      {
        id: uuidv4(),
        title: "Грешка!",
        description: "Нещо се обърка, моля опитайте по късно!",
        style: "danger",
      },
    ]);
  }
}

export async function loginGoogle() {
  try {
    const result = await signInWithPopup(getAuth(), new GoogleAuthProvider());

    await setDoc(
      doc(getFirestore(), "users", result.user.uid),
      {
        uid: result.user.uid,
        displayName: result.user.displayName,
      },
      { merge: true }
    );
  } catch (error) {
    console.log(error);
    generalAlerts.set([
      ...get(generalAlerts),
      {
        id: uuidv4(),
        title: "Грешка!",
        description:
          "Нещо се обърка или акаунтът, който избрахте вече съществува!",
        style: "danger",
      },
    ]);
  }
}

export async function loginFacebook() {
  try {
    await signInWithPopup(getAuth(), new FacebookAuthProvider());
  } catch (error) {
    console.log(error);
    generalAlerts.set([
      ...get(generalAlerts),
      {
        id: uuidv4(),
        title: "Грешка!",
        description:
          "Нещо се обърка или акаунтът, който избрахте вече съществува!",
        style: "danger",
      },
    ]);
  }
}

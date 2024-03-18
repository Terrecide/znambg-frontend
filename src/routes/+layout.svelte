<script>
  import "./styles.css";
  import { getAuth } from "firebase/auth";
  import authStore from "$lib/stores/authStore";
  import { onDestroy } from "svelte";
  import { doc, getDoc, getFirestore } from "firebase/firestore";

  const unprotected = ["/login", "/register"];

  export let data;

  let subscriber = () => {};

  async function getCurrentUser() {
    await new Promise((resolve, reject) => {
      subscriber = getAuth().onAuthStateChanged(async (user) => {
        try {
          let userDetails = {};
          if (user) {
            const res = await getDoc(doc(getFirestore(), "users", user.uid));
            if (res.exists()) {
              userDetails = res.data();
            }
          }

          authStore.set({
            isLoggedIn: user !== null,
            user,
            firebaseControlled: true,
            userDetails,
          });

          resolve(user);
        } catch (error) {
          console.log(error);
        }
      }, reject);
    });
  }

  onDestroy(() => subscriber());
</script>

<div class="app">
  {#await getCurrentUser() then data}
    <main>
      <slot />
    </main>
  {/await}
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 540px;
    margin: auto;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }
</style>

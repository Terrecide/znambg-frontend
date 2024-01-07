<script>
  import { goto } from "$app/navigation";
  import { nakama } from "$lib/stores/nakama";
  import { browser } from "$app/environment";
  import { Client, Session } from "@heroiclabs/nakama-js";
  import ZnamLogo from "$lib/components/shared/znamLogo.svelte";
  import Button from "$lib/components/shared/button.svelte";
  import { ButtonColors } from "$lib/components/shared/types";
  import Cookies from "js-cookie";

  let matchId = "";

  async function findMatch() {
    try {
      // ep4
      const rpcid = "find_match_js";
      const matches = await $nakama.client.rpc($nakama.session, rpcid, {});

      matchId = matches.payload.matchIds[0];
      const match = await $nakama.socket?.joinMatch(matchId);
      console.log("Match Presences", match?.presences);
      if (match?.presences) {
        $nakama.presences = match?.presences;
      }
      goto(`/match?id=${matchId}`);
      console.log("Matched joined!");
    } catch (error) {
      console.log(error);
    }
  }

  async function sendAnswer(index) {
    try {
      // ep4
      var data = { answer: index };
      await $nakama.socket.sendMatchState(matchId, 4, JSON.stringify(data));
      console.log("Answer data sent");
    } catch (error) {
      console.log(error);
    }
  }

  async function logout() {
    $nakama.client = new Client("defaultkey", "127.0.0.1", "7350");
    await $nakama.client.sessionLogout(
      $nakama.session,
      $nakama.session.token,
      $nakama.session.refreshToken
    );
    Cookies.remove("znambg-token", { path: "/" });
    Cookies.remove("znambg-refresh_token", { path: "/" });
    Cookies.remove("znambg-user_id", { path: "/" });
    Cookies.remove("znambg-device-id", { path: "/" });

    window.location.href = "/login";
  }
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="main-container">
  <ZnamLogo classes="w-32" />
  <div class="flex flex-col">
    <div class="font-binaria_bold">Твоите жокери:</div>
    <div class="flex justify-center gap-6 w-full" />
  </div>
  <Button
    text="Намери игра"
    color={ButtonColors.pink}
    on:handleClick={async () => await findMatch()}
  />
  <Button
    text="Влез в игра"
    color={ButtonColors.green}
    on:handleClick={() => {}}
  />
  <Button
    text="Създай игра"
    color={ButtonColors.red}
    on:handleClick={() => {}}
  />
  <button class="btn btn-blue" on:click={async () => await logout()}
    >Logout</button
  >
</div>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }

  h1 {
    width: 100%;
  }

  .welcome {
    display: block;
    position: relative;
    width: 100%;
    height: 0;
    padding: 0 0 calc(100% * 495 / 2048) 0;
  }

  .welcome img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    display: block;
  }
</style>

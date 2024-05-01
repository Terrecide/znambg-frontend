<script>
  import Game from "./game.svelte";
  import Lobby from "./lobby.svelte";
  import Podium from "./podium.svelte";
  import { onDestroy, onMount } from "svelte";
  import { gameState } from "$lib/stores/game";
  import ioClient from "socket.io-client";
  /*   import authStore from "$lib/stores/authStore"; */
  import { socketStore } from "$lib/stores/socket";
  import authStore from "$lib/stores/authStore";
  import { page } from "$app/stores";
  import { SpinnerGap } from "phosphor-svelte";

  onMount(() => {
    const ENDPOINT = import.meta.env.VITE_ZNAM_BE;
    const socket = ioClient(ENDPOINT);
    socketStore.set(socket);

    $socketStore.on("returnState", (message) => {
      console.log(message);
      $gameState = message;
      // Handle incoming messages here
    });
    const roomQueryId = $page.url.searchParams.get("roomId");
    const privateRoom = $page.url.searchParams.get("private");
    if (roomQueryId) {
      $socketStore.emit("joinRoom", {
        roomId: roomQueryId,
        id: $authStore.userDetails?.uid,
        playerData: $authStore.userDetails,
        ...(!!privateRoom && {
          roomData: {
            private: true,
          },
        }),
      });
    }
  });

  onDestroy(() => {
    $socketStore.removeAllListeners();
  });
</script>

{#if !$gameState?.me && $gameState.players}
  <Lobby />
{:else if $gameState?.me?.finished}
  <Podium />
{:else if $gameState?.me}
  <Game />
{:else}
  <div class="main-container">
    <div class="flex justify-center items-center w-full h-36">
      <SpinnerGap size={35} class="animate-spin" />
    </div>
  </div>
{/if}

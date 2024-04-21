<script>
  import Game from "./game.svelte";
  import Lobby from "./lobby.svelte";
  import Podium from "./podium.svelte";
  import { onDestroy, onMount } from "svelte";
  import { gameState } from "$lib/stores/game";
  import ioClient from "socket.io-client";
  /*   import authStore from "$lib/stores/authStore"; */
  import { socketStore } from "$lib/stores/socket";

  onMount(() => {
    const ENDPOINT = import.meta.env.VITE_ZNAM_BE;
    const socket = ioClient(ENDPOINT);
    socketStore.set(socket);
    /* socket.emit("hello", {
      username: $authStore.userDetails?.displayName,
    }); */

    $socketStore.on("returnState", (message) => {
      console.log(message);
      $gameState = message;
      // Handle incoming messages here
    });
  });

  onDestroy(() => {
    $socketStore.removeAllListeners();
  });
</script>

{#if $gameState?.message}
  <Lobby />
{:else if $gameState?.me.finished}
  <Podium />
{:else}
  <Game />
{/if}

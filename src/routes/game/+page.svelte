<script>
  import Game from "./game.svelte";
  import Lobby from "./lobby.svelte";
  import Podium from "./podium.svelte";
  import { io } from "$lib/webSocketConnection.js";
  import { onDestroy, onMount } from "svelte";
  import { gameState } from "$lib/stores/game";

  onMount(() => {
    io.on("returnState", (message) => {
      console.log(message);
      $gameState = message;
      // Handle incoming messages here
    });
  });

  onDestroy(() => {
    io.removeAllListeners();
  });
</script>

{#if $gameState?.message}
  <Lobby />
{:else if $gameState?.me.finished}
  <Podium />
{:else}
  <Game />
{/if}

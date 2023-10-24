<script lang="ts">
  import { gameStateStore } from "$lib/stores/quiz";
  import Game from "./game.svelte";
  import Lobby from "./lobby.svelte";
  import Podium from "./podium.svelte";
</script>

{#if !$gameStateStore.gameStarted}
  <Lobby />
{:else if $gameStateStore.podium?.length > 0}
  <Podium />
{:else}
  <Game />
{/if}

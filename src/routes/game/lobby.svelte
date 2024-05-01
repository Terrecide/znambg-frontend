<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Button from "$lib/components/shared/button.svelte";
  import { ButtonColors } from "$lib/components/shared/types";
  import Avatar from "$lib/components/shared/avatar.svelte";
  import { gameState } from "$lib/stores/game";
  import { socketStore } from "$lib/stores/socket";

  function leaveMatch() {
    $socketStore.emit("exit");
    goto("/");
  }
</script>

<div class="main-container">
  <div class="players">
    <div class="text-center text-black font-bold text-xl">
      {#if $page.url.searchParams.get("roomId")}
        Номер на игра:
        <br />
        <span class="text-lg">№: {$page.url.searchParams.get("roomId")}</span>
      {:else}
        Търсят се опоненти
      {/if}
    </div>
    {#if $gameState.players}
      {#each Object.entries($gameState.players).map(([k, playerValues]) => playerValues) as player, i}
        <div class="player player-{i + 1}">
          {player.displayName}
        </div>
      {/each}
      {#if Object.entries($gameState.players).map(([k, playerValues]) => playerValues).length < 4}
        {#each new Array(4 - Object.entries($gameState).map(([k, playerValues]) => playerValues).length) as _}
          <div class="player no-player">
            <!-- <Avatar empty={true} /> -->Търси се играч...
          </div>
        {/each}
      {/if}
    {/if}
  </div>

  <Button color={ButtonColors.red} text="Отказ" on:handleClick={leaveMatch} />
</div>

<style>
  .players {
    @apply flex flex-col gap-2 w-full;
  }
  .player {
    @apply flex items-center gap-1 w-full font-binaria_bold px-2 py-1 rounded-xl text-rg;
  }

  .player-1 {
    @apply bg-purple-light border border-purple text-white;
  }

  .player-2 {
    @apply bg-green-light border border-green text-white;
  }

  .player-3 {
    @apply bg-red-light border border-red;
  }

  .player-4 {
    @apply bg-pink-light border border-pink;
  }

  .no-player {
    @apply bg-gray-2 border border-gray-3;
  }
</style>

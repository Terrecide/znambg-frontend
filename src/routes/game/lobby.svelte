<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Button from "$lib/components/shared/button.svelte";
  import { ButtonColors } from "$lib/components/shared/types";
  import Avatar from "$lib/components/shared/avatar.svelte";
  import { gameState } from "$lib/stores/game";

  function leaveMatch() {
    goto("/");
  }
</script>

<div class="main-container">
  <div class="players">
    <div class="text-center font-bold">
      Играта ще започне с {$gameState.required}ма играчи
    </div>
    {#if $gameState.current}
      {#each new Array($gameState.current) as _, i}
        <div class="player player-{i + 1}">
          <Avatar />Играч {i + 1}
        </div>
      {/each}
      {#if $gameState.current < 4}
        {#each new Array(4 - $gameState.current) as _}
          <div class="player no-player">
            <Avatar empty={true} />Търси се играч...
          </div>
        {/each}
      {/if}
    {/if}
  </div>

  <div class="flex flex-col gap-4 w-48">
    <Button color={ButtonColors.red} text="Отказ" on:handleClick={leaveMatch} />
  </div>
</div>

<style>
  .players {
    @apply flex flex-col gap-2 w-full;
  }
  .player {
    @apply flex items-center gap-1 w-full font-binaria_bold px-2 py-1 rounded-xl text-rg;
  }

  .player-1 {
    @apply bg-purple-light border border-purple;
  }

  .player-2 {
    @apply bg-green-light border border-green;
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

<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Button from "$lib/components/shared/button.svelte";
  import { ButtonColors } from "$lib/components/shared/types";
  import { nakama } from "$lib/stores/nakama";
  import Avatar from "$lib/components/shared/avatar.svelte";

  function leaveMatch() {
    try {
      $nakama.socket?.leaveMatch($page.url.searchParams.get("id"));
      goto("/");
    } catch (error) {
      console.log(error);
    }
  }
</script>

<div class="main-container">
  <div class="players">
    {#if $nakama.presences}
      {#each $nakama.presences as player, i}
        <div class="player player-{i + 1}">
          <Avatar />{player.username}
        </div>
      {/each}
      {#if $nakama.presences.length < 4}
        {#each new Array(4 - $nakama.presences.length) as _}
          <div class="player no-player">
            <Avatar empty={true} />Търси се играч
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

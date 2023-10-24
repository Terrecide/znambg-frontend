<script>
  import defaultPlayerImg from "$lib/images/player-img.png";

  export let playerImg = defaultPlayerImg;
  export let customStyles = "";
  export let empty = false;
</script>

<span class="player-avatar {customStyles} {empty && 'bg-gray-3'}">
  {#if empty}
    <span class="player-img">?</span>
  {:else}
    <img class="player-img" src={playerImg} alt="player image" />
  {/if}
</span>

<style>
  .player-avatar {
    @apply rounded-full p-3 text-rg text-center relative;
  }

  .player-img {
    @apply absolute -translate-x-2/4 -translate-y-2/4 w-full;
  }
</style>

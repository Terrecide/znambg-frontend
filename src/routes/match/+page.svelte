<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { nakama } from "$lib/stores/nakama";
  import { gameStateStore } from "$lib/stores/quiz";

  async function sendAnswer(index) {
    try {
      // ep4
      let data = { position: index };
      let matchId = $page.url.searchParams.get("id");
      if (!matchId) {
        await goto("/");
        return;
      }

      await $nakama.socket?.sendMatchState(matchId, 4, JSON.stringify(data));
      console.log("Answer data sent");
    } catch (error) {
      console.log(error);
    }
  }
</script>

{#if !$gameStateStore.gameStarted}
  {#if $nakama.presences}
    {#each $nakama.presences as player}
      <h1>User: {player.username}</h1>
    {/each}
  {/if}
  Waiting for other players ....
{:else}
  <button on:click={async () => await sendAnswer(1)}>Send Move 1</button>
  <button on:click={async () => await sendAnswer(2)}>Send Move 2</button>
  <button on:click={async () => await sendAnswer(3)}>Send Move 3</button>
  <button on:click={async () => await sendAnswer(4)}>Send Move 4</button>
  <button on:click={async () => await sendAnswer(5)}>Send Move 5</button>
  <button on:click={async () => await sendAnswer(6)}>Send Move 6</button>
  <button on:click={async () => await sendAnswer(7)}>Send Move 7</button>
  <button on:click={async () => await sendAnswer(8)}>Send Move 8</button>
{/if}

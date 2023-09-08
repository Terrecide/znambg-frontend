<script>
  import { goto } from "$app/navigation";
  import { nakama } from "$lib/stores/nakama";

  let matchId = "";

  async function findMatch() {
    try {
      // ep4
      const rpcid = "find_match_js";
      const matches = await $nakama.client?.rpc($nakama.session, rpcid, {});

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
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<button class="btn btn-blue" on:click={async () => await findMatch()}
  >Play</button
>

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

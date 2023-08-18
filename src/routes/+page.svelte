<script>
  import { nakama } from "$lib/stores/nakama";

  let matchId = "";

  async function findMatch() {
    try {
      // ep4
      const rpcid = "find_match_js";
      const matches = await $nakama.client.rpc($nakama.session, rpcid, {});

      matchId = matches.payload.matchIds[0];
      await $nakama.socket.joinMatch(matchId);
      console.log("Matched joined!");
    } catch (error) {
      console.log(error);
    }
  }

  async function sendAnswer(index) {
    try {
      // ep4
      var data = { answer: index };
      await $nakama.socket.sendMatchState(matchId, 4, JSON.stringify(data));
      console.log("Answer data sent");
    } catch (error) {
      console.log(error);
    }
  }
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<button on:click={async () => await findMatch()}>Play</button>
<button on:click={async () => await sendAnswer(1)}>Send Move 1</button>
<button on:click={async () => await sendAnswer(2)}>Send Move 2</button>
<button on:click={async () => await sendAnswer(3)}>Send Move 3</button>
<button on:click={async () => await sendAnswer(4)}>Send Move 4</button>

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

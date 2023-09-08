<script>
  import Header from "./Header.svelte";
  import "./styles.css";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { nakama } from "$lib/stores/nakama";
  import { gameStateStore } from "$lib/stores/quiz";

  let isOnMatchDefined = false;

  $: if (browser && !$nakama.client) {
    goto("/login");
  }

  //ep4
  $: if (browser && !!$nakama.socket && !isOnMatchDefined) {
    isOnMatchDefined = true;
    console.log("Registering socket");
    $nakama.socket.onmatchdata = (result) => {
      const json_string = new TextDecoder().decode(result.data);
      const json = json_string ? JSON.parse(json_string) : "";

      switch (result.op_code) {
        case 1:
          console.log("Socket OpCode.START", json);
          // @ts-ignore
          $gameStateStore = json;
          $gameStateStore.gameStarted = true;
          /*this.gameStarted = true;
             this.setPlayerTurn(json); */
          break;
        case 2:
          console.log("Socket OpCode.UPDATE", json);
          $gameStateStore = {
            ...$gameStateStore,
            ...json,
          };
          /* this.updateBoard(json.board);
            this.updatePlayerTurn(); */
          break;
        case 3:
          console.log("Socket OpCode.DONE", json);
          /* this.endGame(json); */
          break;
        case 4:
          console.log("Socket OpCode.ANSWER");
          $gameStateStore.gameStarted = false;
          /* this.endGame(json); */
          break;
        case 5:
          console.log("Socket OpCode.REJECTED");
          break;
        case 6:
          console.log("Socket OpCode.CORRECT_ANSWER", json);
          $gameStateStore.correctAnswer = json;
          break;
      }
    };

    // When receiving a match presence event, check if the host left and if so recalculate the host presence
    $nakama.socket.onmatchpresence = (matchPresence) => {
      if (matchPresence.joins) {
        $nakama.presences = [...$nakama.presences, ...matchPresence.joins];
      }

      if (matchPresence.leaves) {
        matchPresence.leaves.forEach((player) => {
          $nakama.presences = $nakama.presences?.filter(
            (playerStore) => playerStore.user_id !== player.user_id
          );
        });
      }
    };
  }
</script>

<div class="app">
  {#if browser && $nakama.client && !$gameStateStore.gameStarted}
    <Header />
  {/if}

  <main>
    <slot />
  </main>

  <footer />
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 540px;
    margin: auto;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }
</style>

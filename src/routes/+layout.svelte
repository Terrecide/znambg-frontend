<script>
  import "./styles.css";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { nakama } from "$lib/stores/nakama";
  import { gameStateStore } from "$lib/stores/quiz";
  import { Client, Session } from "@heroiclabs/nakama-js";
  import { page } from "$app/stores";
  import { OpCode } from "$lib/components/shared/types";

  let isOnMatchDefined = false;
  const unprotected = ["/login", "/register"];

  export let data;

  //ep4
  $: if (browser && data.user?.token && !isOnMatchDefined) {
    (async () => {
      try {
        isOnMatchDefined = true;
        console.log("Registering socket");
        $nakama.client = new Client("defaultkey", "127.0.0.1", "7350");
        $nakama.client.ssl = false;
        $nakama.session = Session.restore(
          data.user.token,
          data.user.refreshToken
        );
        /* TODO: implement token expire logic */
        $nakama.socket = $nakama.client.createSocket(false, false);
        const res = await $nakama.socket.connect($nakama.session);
        $nakama.socket.onmatchdata = (result) => {
          const json_string = new TextDecoder().decode(result.data);
          const json = json_string ? JSON.parse(json_string) : "";

          switch (result.op_code) {
            case OpCode.START:
              console.log("Socket OpCode.START", json);
              // @ts-ignore
              $gameStateStore = json;
              $gameStateStore.gameStarted = true;
              /*this.gameStarted = true;
               this.setPlayerTurn(json); */
              break;
            case OpCode.UPDATE:
              console.log("Socket OpCode.UPDATE", json);
              $gameStateStore = {
                ...$gameStateStore,
                ...json,
              };
              /* this.updateBoard(json.board);
              this.updatePlayerTurn(); */
              break;
            case OpCode.DONE:
              console.log("Socket OpCode.DONE", json);
              /* this.endGame(json); */
              break;
            case OpCode.ANSWER:
              console.log("Socket OpCode.ANSWER");
              /* this.endGame(json); */
              break;
            case OpCode.REJECTED:
              console.log("Socket OpCode.REJECTED");
              break;
            case OpCode.CORRECT_ANSWER:
              console.log("Socket OpCode.CORRECT_ANSWER", json);
              $gameStateStore.correctAnswer = json;
              break;
            case OpCode.CHANGE_QUESTION:
              console.log("Socket OpCode.CHANGE_QUESTION", json);
              $gameStateStore.changeQuestion = json;
              break;
            case OpCode.PODIUM:
              console.log("Socket OpCode.PODIUM", json);
              $gameStateStore.podium = json.podium;
              break;
            case OpCode.JOKER_REMOVE_QUESTIONS:
              console.log(
                "Socket OpCode.JOKER_REMOVE_QUESTIONS",
                json.answersToRemove,
                $gameStateStore
              );
              /* $gameStateStore.podium = json.podium; */
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

        if (unprotected.includes($page.url.pathname)) {
          goto("/");
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }
</script>

<div class="app">
  <!-- {#if browser && $nakama.client && !$gameStateStore.gameStarted}
    <Header />
  {/if} -->

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

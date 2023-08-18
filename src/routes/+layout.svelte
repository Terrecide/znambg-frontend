<script>
  import Header from "./Header.svelte";
  import "./styles.css";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { nakama } from "$lib/stores/nakama";

  $: if (browser && !$nakama.client) {
    goto("/login");
  }

  //ep4
  $: if (!!$nakama.socket) {
    console.log("Registering socket");
    $nakama.socket.onmatchdata = (result) => {
      const json_string = new TextDecoder().decode(result.data);
      const json = json_string ? JSON.parse(json_string) : "";

      switch (result.op_code) {
        case 1:
          console.log("vliza 1");
          /*this.gameStarted = true;
           this.setPlayerTurn(json); */
          break;
        case 2:
          console.log("vliza 2", result.data);
          /* this.updateBoard(json.board);
          this.updatePlayerTurn(); */
          break;
        case 3:
          console.log("vliza 3");
          /* this.endGame(json); */
          break;
        case 4:
          console.log("vliza 4");
          /* this.endGame(json); */
          break;
      }
    };
  }
</script>

<div class="app">
  <Header />

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

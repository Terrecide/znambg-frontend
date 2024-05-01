<script>
  import { goto } from "$app/navigation";
  import ZnamLogo from "$lib/components/shared/znamLogo.svelte";
  import Button from "$lib/components/shared/button.svelte";
  import { ButtonColors } from "$lib/components/shared/types";
  import { getAuth } from "firebase/auth";
  import authStore from "$lib/stores/authStore";
  import JoinGameModal from "$lib/components/mainMenu/joinGameModal.svelte";

  $: if (!$authStore.isLoggedIn) {
    goto("/login");
  }
  const ENDPOINT = import.meta.env.VITE_ZNAM_BE;
  let joinGameModal;

  async function joinRandomGame() {
    try {
      const response = await fetch(ENDPOINT + "/allgames");
      if (!response.ok) {
        return;
      }
      const rooms = await response.json();
      const nonPrivateRooms = rooms.filter(
        (room) =>
          !room.roomData.roomData || room.roomData.roomData.private !== true
      );
      if (nonPrivateRooms.length > 0) {
        goto("/game?roomId=" + nonPrivateRooms[0].roomId);
      } else {
        createRoom();
      }
    } catch (error) {
      console.log(error);
    }
  }

  function createRoom(privateRoom = false) {
    const roomId = Math.random().toString(36).slice(-6);
    if (privateRoom) {
      goto("/game?private=true&roomId=" + roomId);
    } else {
      goto("/game?roomId=" + roomId);
    }
  }
</script>

<svelte:head>
  <title>Знам</title>
  <meta name="description" content="Знам app" />
</svelte:head>

<div class="main-container">
  <ZnamLogo classes="w-32" />
  <div class="flex flex-col gap-4 w-full">
    <Button
      text="Намери игра"
      color={ButtonColors.pink}
      on:handleClick={joinRandomGame}
    />
    <Button
      text="Влез в игра"
      color={ButtonColors.green}
      on:handleClick={joinGameModal.handleToggleModal}
    />
    <Button
      text="Създай игра"
      color={ButtonColors.red}
      on:handleClick={() => createRoom(true)}
    />
    <Button
      text="Излез"
      color={ButtonColors.red}
      on:handleClick={() => {
        getAuth().signOut();
        goto("/login");
      }}
    />
  </div>
</div>
<JoinGameModal bind:this={joinGameModal} />

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

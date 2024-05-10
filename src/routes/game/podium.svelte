<script>
  import Avatar from "$lib/components/shared/avatar.svelte";
  import Button from "$lib/components/shared/button.svelte";
  import { ButtonColors } from "$lib/components/shared/types";
  import { FacebookLogo, GoogleLogo } from "phosphor-svelte";
  import { gameState } from "$lib/stores/game";
  import { socketStore } from "$lib/stores/socket";
  import { goto } from "$app/navigation";

  $: maxAnswer = Math.max(
    ...Object.values($gameState.players).map((player) => player.score)
  );

  function leaveMatch() {
    $socketStore.emit("exit");
    goto("/");
  }

  function joinRandomGame() {
    $socketStore.emit("exit");
    const roomId = Math.random().toString(36).slice(-6);
    window.location.href = "/game?roomId=" + roomId;
  }
</script>

<div class="main-container">
  <div class="font-binaria_bold pb-2">Събрани точки:</div>
  <div class="grid grid-cols-4 gap-2 h-40 w-full">
    {#each Object.keys($gameState.players) as playerKey, i (playerKey)}
      <div class="flex flex-col w-full text-center">
        <div class="flex grow">
          <div
            class="relative min-height-2 podium player-podium--{i + 1}"
            style="height: {($gameState.players[playerKey].score / maxAnswer) *
              100}%"
          >
            <!-- <div class="absolute left-1/2">
              <Avatar />
            </div> -->
          </div>
        </div>
      </div>
    {/each}
  </div>
  <div class="grid grid-cols-4 gap-2 w-full">
    {#each Object.keys($gameState.players) as playerKey, i (playerKey)}
      <div class="flex flex-col w-full text-center">
        <span class="font-bold"
          >{$gameState.players[playerKey].displayName}: {Math.floor(
            $gameState.players[playerKey].score
          )}</span
        >
      </div>
    {/each}
  </div>
  <div class="flex flex-col">
    <div class="font-binaria_bold">Предизвикай приятели</div>
    <div class="flex justify-center gap-6 w-full">
      <FacebookLogo size={24} />
      <GoogleLogo size={24} />
    </div>
  </div>

  <div class="flex flex-col gap-4 w-full">
    <Button
      color={ButtonColors.pink}
      text="Играй отново"
      on:handleClick={joinRandomGame}
    />
    <Button
      color={ButtonColors.green}
      text="Начало"
      on:handleClick={leaveMatch}
    />
  </div>
</div>

<style>
  .podium {
    @apply rounded-t-lg w-full self-end pb-2;
  }
  .player-podium--1 {
    @apply bg-green border-green-dark;
  }
  .player-podium--2 {
    @apply bg-purple border-purple-dark;
  }
  .player-podium--3 {
    @apply bg-pink border-pink-dark;
  }
  .player-podium--4 {
    @apply bg-red border-red-dark;
  }
</style>

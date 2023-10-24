<script>
  import Avatar from "$lib/components/shared/avatar.svelte";
  import Button from "$lib/components/shared/button.svelte";
  import { ButtonColors } from "$lib/components/shared/types";
  import { gameStateStore } from "$lib/stores/quiz";

  $: maxAnswer = Math.max(
    ...$gameStateStore.podium.map((podium) => podium.score)
  );
</script>

<div class="main-container">
  <div class="grid grid-cols-4 gap-2 h-16 w-full">
    {#each $gameStateStore.podium as podium, i (podium.userId)}
      <div class="flex flex-col w-full text-center">
        <div class="flex grow pb-2">
          <div
            class="relative min-height-2 podium player-podium--{i + 1}"
            style="height: {(podium.score / maxAnswer) * 100}%"
          >
            <div class="absolute left-1/2">
              <Avatar />
            </div>
          </div>
        </div>
        <span>{Math.floor(podium.score)}</span>
      </div>
    {/each}
  </div>

  <Button
    color={ButtonColors.pink}
    text="Играй отново"
    on:handleClick={() => {}}
  />
  <Button color={ButtonColors.green} text="Начало" on:handleClick={() => {}} />
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

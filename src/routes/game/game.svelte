<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Timer from "phosphor-svelte/lib/Timer";
  import { gameState } from "$lib/stores/game";
  import { socket } from "$lib/webSocketConnection";
  import Button from "$lib/components/shared/button.svelte";
  import { ButtonColors, JokerTypes } from "$lib/components/shared/types";
  import { ArrowBendUpRight, HourglassMedium } from "phosphor-svelte";

  function answerQuestion(answerIndex: number) {
    socket.emit("move", { answer: answerIndex });
  }

  function buttonColor(
    yourAnswer: number,
    correctAnswer: number,
    answerId: number
  ): string {
    if (correctAnswer !== answerId && yourAnswer !== answerId) {
      return "";
    } else if (correctAnswer === yourAnswer || correctAnswer === answerId) {
      return "answer-btn--correct";
    } else if (yourAnswer === answerId) {
      return "answer-btn--incorrect";
    }
    return "";
  }

  async function useJoker(jokerType: string) {
    socket.emit("move", { joker: jokerType });
  }
</script>

<div class="main-container justify-start">
  <div class="self-start grid grid-cols-2 border border-collapse w-full">
    {#if $gameState.players}
      {#each Object.keys($gameState.players) as playerKey, i}
        <div
          class="border border-black relative player-progress-container--{i +
            1}"
        >
          <!-- {player.username} -->

          <span class="ml-2">{playerKey}</span>
          <div
            class="player-progress player-progress--{i + 1}"
            style={$gameState.players[playerKey].currentQuestionIndex !== null
              ? `width: ${
                  (($gameState.players[playerKey].currentQuestionIndex + 1) /
                    10) /* questions length is 10 */ *
                  100
                }%`
              : "visibility: hidden"}
          />
        </div>
      {/each}
    {/if}
  </div>
  <div class="flex flex-col w-full grow justify-center">
    <div
      class="flex gap-1 items-center justify-center w-full text-2xl font-neuropol"
    >
      <Timer size={45} />
      <span class="w-24"
        >{($gameState.me.timeToAnswerCounter > 0
          ? $gameState.me.timeToAnswerCounter / 2
          : 0
        ).toFixed(0)}</span
      >
    </div>
    {#if $gameState.question && Object.keys($gameState.question).length}
      <div class="font-binaria_bold text-xl text-center m-2">
        {$gameState.question.title}
      </div>
      <div class="grid grid-cols-1 justify-between gap-4 w-full">
        {#each $gameState.question.answers as answer, i}
          <button
            class="answer-btn {buttonColor(
              $gameState.me.answerIndex,
              $gameState.me.correctAnswer,
              i
            )} {answer.disabled ? 'answer-btn--disabled' : ''}"
            disabled={answer.disabled}
            on:click={async () => await answerQuestion(i)}
          >
            {answer.text}
          </button>
        {/each}
      </div>
    {/if}
    <div class="flex gap-2 justify-center mt-2">
      <Button
        disabled={!$gameState.me.availableJokers.includes(JokerTypes.fifty)}
        text="50/50"
        color={ButtonColors.purple}
        on:handleClick={async () => useJoker(JokerTypes.fifty)}
      />
      <Button
        disabled={!$gameState.me.availableJokers.includes(
          JokerTypes.changeQuestion
        )}
        text=""
        color={ButtonColors.purple}
        on:handleClick={async () => useJoker(JokerTypes.changeQuestion)}
      >
        <ArrowBendUpRight size={24} weight="fill" slot="icon" />
      </Button>
      <Button
        disabled={!$gameState.me.availableJokers.includes(JokerTypes.stealTime)}
        text=""
        color={ButtonColors.purple}
        on:handleClick={async () => useJoker(JokerTypes.stealTime)}
      >
        <HourglassMedium size={24} weight="fill" slot="icon" />
      </Button>
    </div>
  </div>
</div>

<style>
  .player-progress {
    @apply absolute h-full border box-border top-0;
    z-index: -1;
  }
  .player-progress-container--1 {
    @apply bg-green-light/30;
  }
  .player-progress--1 {
    @apply bg-green border-green-dark;
  }
  .player-progress-container--2 {
    @apply bg-purple-light/30;
  }
  .player-progress--2 {
    @apply bg-purple border-purple-dark;
  }
  .player-progress-container--3 {
    @apply bg-pink-light/30;
  }
  .player-progress--3 {
    @apply bg-pink border-pink-dark;
  }
  .player-progress-container--4 {
    @apply bg-red-light/30;
  }
  .player-progress--4 {
    @apply bg-red border-red-dark;
  }
  .answer-btn {
    @apply text-rg text-gray-6 py-2 px-4 border border-pink-light bg-white rounded-2xl w-full;
  }
  .answer-btn:focus-visible {
    outline: theme("colors.green-dark") auto 1px;
  }
  .answer-btn--disabled {
    @apply bg-gray-3 opacity-50;
  }

  .answer-btn--correct {
    @apply bg-green-light border border-green-dark;
  }

  .answer-btn--incorrect {
    @apply bg-red-light border border-red-dark;
  }
</style>

<script lang="ts">
  import { gameState } from "$lib/stores/game";
  import Button from "$lib/components/shared/button.svelte";
  import { ButtonColors, JokerTypes } from "$lib/components/shared/types";
  import {
    ArrowClockwise,
    CheckCircle,
    HourglassMedium,
    Star,
    Timer,
    SpinnerGap,
    Plus,
    CaretDown,
  } from "phosphor-svelte";
  import { flip } from "svelte/animate";
  import defaultPlayerImg from "$lib/images/player-img.png";
  import { socketStore } from "$lib/stores/socket";
  import type { Player } from "$lib/stores/game";

  function answerQuestion(answerIndex: number) {
    $socketStore.emit("move", { answer: answerIndex });
  }

  function buttonColor(
    yourAnswer: number,
    correctAnswer: number,
    answerId: number
  ): string {
    if (correctAnswer !== answerId && yourAnswer !== answerId) {
      return "";
    } else if (correctAnswer === yourAnswer || correctAnswer === answerId) {
      return "answer-btn--correct animate-pulse-faster";
    } else if (correctAnswer === undefined && yourAnswer === answerId) {
      return "answer-btn--selected";
    } else if (correctAnswer !== yourAnswer) {
      return "answer-btn--incorrect animate-pulse-faster";
    }
    return "";
  }

  async function useJoker(jokerType: string) {
    $socketStore.emit("move", { joker: jokerType });
  }

  let playersSortedByScore: Player[] | undefined = undefined;
  $: playersSortedByScore = Object.entries($gameState.players)
    .map(([k, playerValues]) => playerValues)
    .sort((a, b) => {
      return b.score - a.score;
    });
</script>

<div class="flex flex-col relative overflow-hidden min-h-screen">
  {#if $gameState.me?.timeToAnswerCounter <= 4 && !$gameState.me?.correctAnswer}
    <div
      class="animate-ping absolute w-full h-full bg-red-light opacity-75 z-0 overflow-hidden"
    ></div>
  {/if}
  <div class="main-container !p-0">
    <div class="main-container justify-start relative z-10 w-full !gap-0">
      {#if $gameState.players && $gameState.me}
        <div class="flex flex-col justify-between w-full gap-2 flex-wrap">
          <div class="flex gap-2 info-section w-full">
            {#if playersSortedByScore}
              {#each playersSortedByScore as player, i (player.uid)}
                <div class="flex items-center" animate:flip>
                  <span class="pr-1 font-bold text-xl">{i + 1}.</span>
                  <div class="flex flex-col items-center">
                    <!-- <img
                  class="rounded-full w-8"
                  src={defaultPlayerImg}
                  alt="player image"
                /> -->
                    <div>{player.displayName}</div>
                  </div>
                </div>
              {/each}
            {/if}
          </div>
          <div class="flex gap-2 self-end">
            <div class="flex gap-1 text-center info-section !bg-yellow">
              <div>
                <Star size={20} />
              </div>
              <div>{Math.floor($gameState.me.score)}</div>
            </div>
            <div class="flex gap-1 text-center info-section !bg-green">
              <div>
                <CheckCircle size={20} />
              </div>
              <div class="text-center">
                {$gameState.me.currentQuestionIndex + 1}/{$gameState.globalState
                  ?.questionsLength}
              </div>
            </div>
          </div>
        </div>
      {/if}
      <div class="flex flex-col w-full grow justify-start pb-14 mt-2">
        <div
          class="flex gap-1 items-center justify-center w-full text-2xl font-neuropol relative"
        >
          <Timer size={45} />
          <span class="w-8 relative">
            <!-- <div
              class="absolute w-full h-full text-green-dark text-base font-binaria_regular animate-steal-time"
            >
              <span class="absolute -left-4 -top-3">
                <Plus size={25} />
              </span>
              <span class="absolute -right-4 -top-1">
                <Plus size={20} />
              </span>
              <span class="absolute text-lg -right-0 -top-2">
                <Plus size={15} />
              </span>
              <span class="absolute left-2 -bottom-3">
                <Plus size={20} />
              </span>
            </div> -->
            <!-- <div
              class="absolute w-full h-full text-red-dark text-base font-binaria_regular animate-steal-time"
            >
              <span class="absolute -left-3 -top-2">
                <CaretDown size={20} weight="fill" />
              </span>
              <span class="absolute -right-4 -top-1">
                <CaretDown size={15} weight="fill" />
              </span>
              <span class="absolute text-lg -right-0 -top-2">
                <CaretDown size={10} weight="fill" />
              </span>
              <span class="absolute left-2 -bottom-2">
                <CaretDown size={15} weight="fill" />
              </span>
            </div> -->
            {($gameState.me?.timeToAnswerCounter > 0
              ? $gameState.me?.timeToAnswerCounter / 2
              : 0
            ).toFixed(0)}</span
          >
        </div>
        {#if $gameState.question && Object.keys($gameState.question).length}
          <div
            class="font-binaria_bold text-xl text-center m-2 text-wrap break-words"
          >
            {$gameState.question.title}
          </div>
          <div class="grid grid-cols-1 f justify-between gap-4 w-full relative">
            {#each $gameState.question.answers as answer, i}
              <button
                class="answer-btn {buttonColor(
                  $gameState.me?.answerIndex,
                  $gameState.me?.correctAnswer,
                  i
                )} {answer.disabled ? 'answer-btn--disabled' : ''}"
                disabled={answer.disabled}
                on:click={async () => await answerQuestion(i)}
              >
                {answer.text}
              </button>
            {/each}
          </div>
        {:else}
          <div class="flex justify-center items-center w-full h-36">
            <SpinnerGap size={35} class="animate-spin" />
          </div>
        {/if}
      </div>
      <div class="flex gap-2 justify-center py-2 fixed bottom-0">
        <Button
          customStyles="!rounded-full"
          disabled={!$gameState.me.availableJokers.includes(JokerTypes.fifty)}
          text="50/50"
          color={ButtonColors.purple}
          on:handleClick={async () => useJoker(JokerTypes.fifty)}
        />
        <Button
          customStyles="!rounded-full"
          disabled={!$gameState.me.availableJokers.includes(
            JokerTypes.changeQuestion
          )}
          text=""
          color={ButtonColors.purple}
          on:handleClick={async () => useJoker(JokerTypes.changeQuestion)}
        >
          <ArrowClockwise size={28} weight="fill" slot="icon" />
        </Button>
        <Button
          customStyles="!rounded-full"
          disabled={!$gameState.me.availableJokers.includes(
            JokerTypes.stealTime
          )}
          text=""
          color={ButtonColors.purple}
          on:handleClick={async () => useJoker(JokerTypes.stealTime)}
        >
          <HourglassMedium size={28} weight="fill" slot="icon" />
        </Button>
      </div>
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
    @apply text-rg text-gray-6 py-2 px-4 border border-gray-3 bg-white  rounded-xl w-full font-bold;
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

  .answer-btn--selected {
    @apply bg-yellow-light border border-yellow-dark;
  }

  .info-section {
    @apply font-binaria_bold py-2 px-4 rounded-2xl text-lg bg-gray-2 border border-gray-3 shadow;
  }

  .animate-pulse-faster {
    animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-steal-time {
    animation: stealTimeElement 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes stealTimeElement {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>

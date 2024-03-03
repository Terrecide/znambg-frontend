<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Timer from "phosphor-svelte/lib/Timer";
  import { gameState } from "$lib/stores/game";
  import { socket } from "$lib/webSocketConnection";
  import Button from "$lib/components/shared/button.svelte";
  import { ButtonColors } from "$lib/components/shared/types";

  /*let questionToDisplay: Question | undefined = undefined;
  let count = 0;
  let counterFn = setInterval(timer, 10); //10 will  run it every 100th of a second

  $: counterToDisplay = 0;

   function timer() {
    if (count <= 0) {
      clearInterval(counterFn);
      counterToDisplay = 0;
      return;
    }

    count--;
    counterToDisplay = count / 100;
  }

  $: if ($gameStateStore.changeQuestion) {
    questionToDisplay =
      $gameStateStore.questions[
        $gameStateStore.changeQuestion.nextQuestionIndex
      ];

    $gameStateStore.changeQuestion = null;
    clearInterval(counterFn);
    count = 1000;
    counterFn = setInterval(timer, 10);
  } */

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
        <div class="border relative player-progress-container--{i + 1}">
          <!-- {player.username} -->
          asd123
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
        >{$gameState.me.timeToAnswerCounter / 2 < 10 ? 0 : ""}{($gameState.me
          .timeToAnswerCounter > 0
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
    <Button
      text="50/50"
      color={ButtonColors.pink}
      on:handleClick={() => useJoker("50na50")}
    />
    <Button
      text="steal time"
      color={ButtonColors.pink}
      on:handleClick={() => useJoker("stealTime")}
    />
    <Button
      text="changeQuestion"
      color={ButtonColors.pink}
      on:handleClick={() => useJoker("changeQuestion")}
    />
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
    @apply text-rg text-gray-6 py-2 px-4 border border-pink-light bg-transparent rounded-2xl w-full;
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

<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { nakama } from "$lib/stores/nakama";
  import {
    gameStateStore,
    type CorrectAnswerMessage,
    type Question,
  } from "$lib/stores/quiz";
  import Timer from "phosphor-svelte/lib/Timer";

  let questionToDisplay: Question | undefined = undefined;
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
  }

  async function sendAnswer(questionId: string, answerId: string) {
    try {
      // ep4
      clearInterval(counterFn);
      let data = { questionId, answerId };
      let matchId = $page.url.searchParams.get("id");
      if (!matchId) {
        await goto("/");
        return;
      }

      await $nakama.socket?.sendMatchState(matchId, 4, JSON.stringify(data));
      console.log("Answer data sent");
    } catch (error) {
      console.log(error);
    }
  }

  function buttonColor(
    correctAnswer: CorrectAnswerMessage | null,
    answerId: string
  ): string {
    if (correctAnswer) {
      if (
        correctAnswer.correctAnswerId !== answerId &&
        correctAnswer.playerAnswerId !== answerId
      ) {
        return "";
      } else if (
        correctAnswer.correctAnswerId === correctAnswer.playerAnswerId ||
        correctAnswer.correctAnswerId === answerId
      ) {
        return "answer-btn--correct";
      } else if (correctAnswer.playerAnswerId === answerId) {
        return "answer-btn--incorrect";
      }
    }
    return "";
  }
</script>

<div class="main-container justify-start">
  <div class="self-start grid grid-cols-2 border border-collapse w-full">
    {#if $nakama.presences}
      {#each $nakama.presences as player, i}
        <div class="border relative player-progress-container--{i + 1}">
          {player.username}
          <div
            class="player-progress player-progress--{i + 1}"
            style={$gameStateStore.playersProgress[player.user_id]
              .currentQuestionIndex !== null
              ? `width: ${
                  (($gameStateStore.playersProgress[player.user_id]
                    .currentQuestionIndex +
                    1) /
                    $gameStateStore.questions.length) *
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
        >{counterToDisplay < 10 && 0}{counterToDisplay.toFixed(2)}</span
      >
    </div>
    {#if questionToDisplay}
      <div class="font-binaria_bold text-xl text-center m-2">
        {questionToDisplay.title}
      </div>
      <div class="grid grid-cols-1 justify-between gap-4 w-full">
        {#each questionToDisplay.answers as answer}
          <button
            class="answer-btn {buttonColor(
              $gameStateStore.correctAnswer,
              answer._id
            )}"
            on:click={async () =>
              await sendAnswer(questionToDisplay._id, answer._id)}
          >
            {answer.text}
          </button>
        {/each}
      </div>
    {/if}
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

  .answer-btn--correct {
    @apply bg-green-light border border-green-dark;
  }

  .answer-btn--incorrect {
    @apply bg-red-light border border-red-dark;
  }
</style>

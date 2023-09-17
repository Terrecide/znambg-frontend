<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { nakama } from "$lib/stores/nakama";
  import {
    gameStateStore,
    type CorrectAnswerMessage,
    type Question,
  } from "$lib/stores/quiz";

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
        return "btn-blue";
      } else if (
        correctAnswer.correctAnswerId === correctAnswer.playerAnswerId ||
        correctAnswer.correctAnswerId === answerId
      ) {
        return "btn-green";
      } else if (correctAnswer.playerAnswerId === answerId) {
        return "btn-red";
      }
    }
    return "btn-blue";
  }
</script>

{#if $nakama.presences}
  {#each $nakama.presences as player}
    <h1>
      User: {player.username}
      {#if $gameStateStore.gameStarted}
        {$gameStateStore.playersProgress[player.user_id]
          .currentQuestionIndex !== null
          ? $gameStateStore.playersProgress[player.user_id]
              .currentQuestionIndex + 1
          : 0}
        /
        {$gameStateStore.questions.length}
      {/if}
    </h1>
  {/each}
{/if}

{#if !$gameStateStore.gameStarted}
  Waiting for other players ....
{:else if questionToDisplay}
  <div class="mt-4">
    <div>
      {counterToDisplay}
    </div>
    <div class="text-xl text-center m-2">
      {questionToDisplay.title}
    </div>
    <div class="grid grid-cols-1 justify-between gap-4">
      {#each questionToDisplay.answers as answer}
        <button
          class="btn {buttonColor($gameStateStore.correctAnswer, answer._id)}"
          on:click={async () =>
            await sendAnswer(questionToDisplay._id, answer._id)}
        >
          {answer.text}
        </button>
      {/each}
    </div>
  </div>
{/if}

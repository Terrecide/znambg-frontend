<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { nakama } from "$lib/stores/nakama";
  import { gameStateStore, type CorrectAnswerMessage } from "$lib/stores/quiz";

  async function sendAnswer(questionId: string, answerId: string) {
    try {
      // ep4
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
        {$gameStateStore.playersProgress[player.user_id] !== null
          ? $gameStateStore.playersProgress[player.user_id] + 1
          : 0}
        /
        {$gameStateStore.questions.length}
      {/if}
    </h1>
  {/each}
{/if}

{#if !$gameStateStore.gameStarted}
  Waiting for other players ....
{:else}
  {#each $gameStateStore.questions as question}
    <div class="mt-4">
      <div class="text-xl text-center m-2">
        {question.title}
      </div>
      <div class="grid grid-cols-1 justify-between gap-4">
        {#each question.answers as answer}
          <button
            class="btn {buttonColor($gameStateStore.correctAnswer, answer._id)}"
            on:click={async () => await sendAnswer(question._id, answer._id)}
          >
            {answer.text}
          </button>
        {/each}
      </div>
    </div>
  {/each}
{/if}

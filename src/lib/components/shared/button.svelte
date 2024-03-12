<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { ButtonColors } from "./types";

  export let color: ButtonColors = ButtonColors.green;
  export let text = "";
  export let type: "button" | "submit" | "reset" | null | undefined = "button";
  export let disabled = false;
  const dispatch = createEventDispatcher();
</script>

<button
  {disabled}
  class="btn {color}"
  {type}
  on:click={() => dispatch("handleClick")}
>
  <slot name="icon" />
  {text}
</button>

<style>
  .btn {
    @apply font-binaria_bold py-2 px-4 rounded-2xl text-lg;
  }

  .btn:disabled {
    @apply opacity-65;
  }

  .btn:active:not(:disabled) {
    box-shadow: none;
    transform: translateY(5px);
  }

  .btn-green {
    @apply bg-green-light border border-green-dark;
    box-shadow: 0 5px 0 theme("colors.green-dark");
  }

  .btn-green:hover:not(:disabled) {
    @apply bg-green;
  }

  .btn-pink {
    @apply bg-pink-light border border-pink-dark;
    box-shadow: 0 5px 0 theme("colors.pink-dark");
  }

  .btn-pink:hover:not(:disabled) {
    @apply bg-pink;
  }

  .btn-red {
    @apply bg-red-light border border-red-dark;
    box-shadow: 0 5px 0 theme("colors.red-dark");
  }

  .btn-red:hover:not(:disabled) {
    @apply bg-red;
  }

  .btn-purple {
    @apply bg-purple-light border border-purple-dark text-white;
    box-shadow: 0 5px 0 theme("colors.purple-dark");
  }

  .btn-purple:hover:not(:disabled) {
    @apply bg-purple;
  }
</style>

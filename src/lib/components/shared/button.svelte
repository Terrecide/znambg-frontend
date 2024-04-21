<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { ButtonColors } from "./types";

  export let color: ButtonColors = ButtonColors.green;
  export let text = "";
  export let type: "button" | "submit" | "reset" | null | undefined = "button";
  export let disabled = false;
  export let customStyles = "";
  const dispatch = createEventDispatcher();
</script>

<div class="flex justify-center w-full">
  <button
    {disabled}
    class="btn {color} {customStyles}"
    {type}
    on:click={() => dispatch("handleClick")}
  >
    <span class="pr-1 py-1"> <slot name="icon" /></span>
    <span class="text-center w-full self-center pt-1">{text}</span>
  </button>
</div>

<style>
  .btn {
    @apply flex font-binaria_bold py-2 px-4 rounded-2xl text-lg w-full max-w-48;
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

  .btn-gray {
    @apply bg-gray-1 border border-gray-3 text-black;
    box-shadow: 0 5px 0 theme("colors.gray-3");
  }

  .btn-gray:hover:not(:disabled) {
    @apply bg-gray-2;
  }
</style>

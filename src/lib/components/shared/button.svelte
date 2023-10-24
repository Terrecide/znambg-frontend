<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { ButtonColors } from "./types";

  export let color: ButtonColors = ButtonColors.green;
  export let text = "";
  const dispatch = createEventDispatcher();
</script>

<button
  class="btn {color}"
  type="button"
  on:click={() => dispatch("handleClick")}
>
  {text}
</button>

<style>
  .btn {
    @apply font-binaria_bold py-2 px-4 rounded-2xl text-lg;
    width: 200px;
  }

  .btn:active {
    box-shadow: none;
    transform: translateY(5px);
  }

  .btn-green {
    @apply bg-green-light border border-green-dark;
    box-shadow: 0 5px 0 theme("colors.green-dark");
  }

  .btn-green:hover {
    @apply bg-green;
  }

  .btn-pink {
    @apply bg-pink-light border border-pink-dark;
    box-shadow: 0 5px 0 theme("colors.pink-dark");
  }

  .btn-pink:hover {
    @apply bg-pink;
  }

  .btn-red {
    @apply bg-red-light border border-red-dark;
    box-shadow: 0 5px 0 theme("colors.red-dark");
  }

  .btn-red:hover {
    @apply bg-red;
  }
</style>

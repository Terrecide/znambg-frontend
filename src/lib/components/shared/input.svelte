<script>
  export let placeholder = "";
  export let label = "";
  export let error = "";
  export let value = "";
  export let type = "text";
  export let name = "";

  function typeAction(node) {
    node.type = type;
  }
</script>

<div class="flex flex-col justify-center items-center w-full">
  <label class="flex justify-center w-full">
    {label}
    <input class="input" use:typeAction bind:value {placeholder} {name} />
  </label>
  {#if error}
    <p class="error">{error}</p>
  {/if}
</div>

<style>
  .input {
    @apply flex text-rg py-2 px-4 border border-pink-light bg-white bg-opacity-85 rounded-2xl w-full max-w-48;
  }
  .input::placeholder {
    @apply text-gray-6;
  }
  .input:focus-visible {
    outline: theme("colors.green-dark") auto 1px;
  }
</style>

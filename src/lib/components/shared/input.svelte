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

<div class="w-full">
  <label>
    {label}
    <input class="input" use:typeAction bind:value {placeholder} {name} />
  </label>
  {#if error}
    <p class="error">{error}</p>
  {/if}
</div>

<style>
  .input {
    @apply text-rg py-2 px-4 border border-pink-light bg-white rounded-2xl w-full;
  }
  .input::placeholder {
    @apply text-gray-6;
  }
  .input:focus-visible {
    outline: theme("colors.green-dark") auto 1px;
  }
</style>

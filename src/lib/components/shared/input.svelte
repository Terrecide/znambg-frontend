<script>
  export let placeholder = "";
  export let label = "";
  export let error = "";
  export let value = "";
  export let type = "text";

  function typeAction(node) {
    node.type = type;
  }
</script>

<div>
  <label>
    {label}
    <input class="input" use:typeAction bind:value {placeholder} />
  </label>
  {#if error}
    <p class="error">{error}</p>
  {/if}
</div>

<style>
  .input {
    @apply text-rg py-2 px-4 border border-pink-light bg-transparent rounded-2xl w-full;
  }
  .input::placeholder {
    @apply text-gray-6;
  }
  .input:focus-visible {
    outline: theme("colors.green-dark") auto 1px;
  }
</style>

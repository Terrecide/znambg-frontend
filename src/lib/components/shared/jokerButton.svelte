<script>
  export let label = "";
  export let disabled = false;
</script>

<div>
  <div class="joker-container {disabled && 'joker-container--disabled'}">
    {icon}
  </div>
  {#if label}
    <div class="font-binaria_bold text-rg">{label}</div>
  {/if}
</div>

<style>
  .joker-container {
    @apply rounded-full p-3;
  }

  .joker-container--disabled {
    @apply opacity-50;
  }
</style>

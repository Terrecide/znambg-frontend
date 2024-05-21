<script>
  export let timer;
</script>

<div
  class="flex gap-1 items-center justify-center text-center w-full text-3xl m-auto font-neuropol"
>
  {#if timer >= 10}
    <span class="text-red-light">Ready?</span>
  {:else if timer <= 9 && timer >= 6}
    <span class="text-purple">3</span>
  {:else if timer < 6 && timer >= 3}
    <span class="text-pink">2</span>
  {:else if timer < 3}
    <span class="text-red">1</span>
  {/if}
</div>

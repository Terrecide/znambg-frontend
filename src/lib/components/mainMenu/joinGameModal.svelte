<script>
  import { fade } from "svelte/transition";
  import Button from "../shared/button.svelte";
  import Input from "../shared/input.svelte";
  import { ButtonColors } from "../shared/types";
  import { X } from "phosphor-svelte";
  import { clickOutside } from "$lib/utils/clickOutside";
  import { goto } from "$app/navigation";

  let code = "";
  let showModal = false;

  export function handleToggleModal() {
    code = "";
    showModal = !showModal;
  }
</script>

<svelte:head>
  {#if showModal}
    <style>
      body {
        overflow: hidden;
      }
    </style>
  {/if}
</svelte:head>

{#if showModal}
  <div class="bg-overlay" transition:fade={{ duration: 200 }}>
    <div
      class="modal flex flex-col gap-2 p-4"
      use:clickOutside
      on:click_outside={handleToggleModal}
    >
      <div class="self-end p-2" on:click={handleToggleModal}>
        <X size={20} />
      </div>
      <Input
        type="text"
        name="code"
        bind:value={code}
        placeholder="Въведи код"
      />
      <Button
        text="Влез в игра"
        customStyles={"mb-2"}
        color={ButtonColors.green}
        on:handleClick={async () => {
          if (code.length) {
            goto("/game?roomId=" + code);
          }
        }}
      />
    </div>
  </div>
{/if}

<style>
  .bg-overlay {
    @apply flex justify-center overflow-auto z-30 fixed top-0 left-0 w-full h-full;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
  }

  .modal {
    @apply flex flex-col bg-ecru h-auto rounded-lg m-auto p-2 mx-8 w-full;
  }

  .modal-header {
    @apply flex justify-between px-1;
  }

  .modal-close {
    @apply flex self-center cursor-pointer;
  }

  .modal--small {
    @apply w-full md:h-auto md:mt-6 md:rounded-lg md:w-2/3 lg:w-1/2 2xl:w-1/4;
  }
</style>

<script>
  import { fade } from "svelte/transition";
  import Button from "../shared/button.svelte";
  import Input from "../shared/input.svelte";
  import { ButtonColors } from "../shared/types";
  import { X } from "phosphor-svelte";
  import { clickOutside } from "$lib/utils/clickOutside";
  import { goto } from "$app/navigation";

  import { ArrowsClockwise, HourglassMedium } from "phosphor-svelte";

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
      <div class="text-center text-black font-bold text-xl">Жокери</div>
      <div
        class="flex flex-col self-center text-center max-w-48 divide-y divide-dashed gap-4"
      >
        <div>
          <div class="flex justify-center font-binaria_bold py-2">
            <span class="flex mb-2"
              ><Button
                customStyles="!rounded-full self-center justify-center"
                text=""
                color={ButtonColors.purple}
                on:handleClick={() => {}}
              >
                <HourglassMedium size={28} weight="fill" slot="icon" />
              </Button></span
            >
            <span class="self-center pl-2">Крадец</span>
          </div>
          <div>
            Всички ще те мразят! Открадни 3 секунди от всички играчи и вземи 5
            за себе си
          </div>
        </div>
        <div>
          <div class="flex justify-center font-binaria_bold py-2">
            <span class="flex mb-2"
              ><Button
                customStyles="!rounded-full self-center justify-center"
                text="50/50"
                color={ButtonColors.purple}
                on:handleClick={() => {}}
              ></Button></span
            >
            <span class="self-center pl-2">50 на 50</span>
          </div>
          <div>
            Не си сигурен? С този жокер елеминираш половината от възможните
            отговори
          </div>
        </div>
        <div>
          <div class="flex justify-center font-binaria_bold py-2">
            <span>
              <Button
                customStyles="!rounded-full self-center justify-center"
                text=""
                color={ButtonColors.purple}
                on:handleClick={() => {}}
              >
                <ArrowsClockwise size={28} weight="fill" slot="icon" />
              </Button>
            </span>
            <span class="self-center pl-2">Замяна</span>
          </div>
          <div>
            Свършва ти времето? Този жокер ти позволява да замениш сегашният
            въпрос с нов
          </div>
        </div>
      </div>
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

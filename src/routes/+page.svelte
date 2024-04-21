<script>
  import { goto } from "$app/navigation";
  import ZnamLogo from "$lib/components/shared/znamLogo.svelte";
  import Button from "$lib/components/shared/button.svelte";
  import { ButtonColors } from "$lib/components/shared/types";
  import { getAuth } from "firebase/auth";
  import authStore from "$lib/stores/authStore";

  $: if (!$authStore.isLoggedIn) {
    goto("/login");
  }
</script>

<svelte:head>
  <title>Знам</title>
  <meta name="description" content="Знам app" />
</svelte:head>

<div class="main-container">
  <ZnamLogo classes="w-32" />
  <div class="flex flex-col gap-4 w-full">
    <Button
      text="Намери игра"
      color={ButtonColors.pink}
      on:handleClick={async () => goto("/game")}
    />
    <Button
      disabled
      text="Влез в игра"
      color={ButtonColors.green}
      on:handleClick={() => {}}
    />
    <Button
      disabled
      text="Създай игра"
      color={ButtonColors.red}
      on:handleClick={() => {}}
    />
    <Button
      text="Излез"
      color={ButtonColors.red}
      on:handleClick={() => {
        getAuth().signOut();
        goto("/login");
      }}
    />
  </div>
</div>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }

  h1 {
    width: 100%;
  }

  .welcome {
    display: block;
    position: relative;
    width: 100%;
    height: 0;
    padding: 0 0 calc(100% * 495 / 2048) 0;
  }

  .welcome img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    display: block;
  }
</style>

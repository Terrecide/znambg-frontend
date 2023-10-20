<script>
  import { goto } from "$app/navigation";
  import { nakama } from "$lib/stores/nakama";
  import { browser } from "$app/environment";
  import { v4 as uuidv4 } from "uuid";
  import { Client } from "@heroiclabs/nakama-js";
  import ZnamLogo from "$lib/components/shared/znamLogo.svelte";
  import Input from "$lib/components/shared/input.svelte";
  import Button from "$lib/components/shared/button.svelte";
  import { ButtonColors } from "$lib/components/shared/types";
  import { FacebookLogo, GoogleLogo } from "phosphor-svelte";

  let email = "";
  let password = "";
  let repeatPassword = "";

  $: if (browser && !!$nakama.client) {
    goto("/");
  }
  console.log($nakama.client);

  if (browser) {
    let token = localStorage.getItem("znambg-token");
    let refreshToken = localStorage.getItem("znambg-refresh_token");
    if (token && refreshToken) {
      $nakama.session = Session.restore(token, refreshToken);
      localStorage.setItem("znambg-token", $nakama.session.token);
      localStorage.setItem(
        "znambg-refresh_token",
        $nakama.session.refresh_token
      );
      console.log("REAUTH");

      goto("/");
    }
  }

  async function register(email, password) {
    try {
      $nakama.client = new Client("defaultkey", "localhost", "7350");
      $nakama.client.ssl = false;

      $nakama.session = await $nakama.client.authenticateEmail(
        email,
        password,
        true
      );
      localStorage.setItem("znambg-user_id", $nakama.session.user_id);
      localStorage.setItem("znambg-token", $nakama.session.token);
      localStorage.setItem(
        "znambg-refresh_token",
        $nakama.session.refresh_token
      );

      const trace = false;
      $nakama.socket = $nakama.client.createSocket(false, trace);
      await $nakama.socket.connect($nakama.session, true);

      console.log("User connected:", $nakama.session);
    } catch (error) {
      console.log(error);
    }
  }
</script>

<div class="main-container">
  <ZnamLogo />
  <h1>Регистрация</h1>
  <!--  -->
  <form class="flex flex-col gap-4 m-0 w-full">
    <Input type="email" placeholder="Име" bind:value={email} />
    <Input type="password" placeholder="Парола" bind:value={password} />
    <Input
      type="password"
      placeholder="Повтори парола"
      bind:value={repeatPassword}
    />
    <Button
      text="Регистрирай се"
      color={ButtonColors.green}
      on:handleClick={async () => await register(email, password)}
    />
  </form>
  или
  <div class="flex justify-center gap-6 w-full">
    <FacebookLogo size={24} />
    <GoogleLogo size={24} />
  </div>
  <div>
    Имаш акаунт? <a href="/login" class="underline">Влез в профила си</a>
  </div>
</div>

<style>
  .btn {
    @apply font-bold py-2 px-4 rounded;
  }
  .btn-blue {
    @apply bg-blue-500 text-white;
  }
  .btn-blue:hover {
    @apply bg-blue-700;
  }
</style>

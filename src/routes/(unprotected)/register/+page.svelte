<script>
  import { goto } from "$app/navigation";
  import { nakama } from "$lib/stores/nakama";
  import { browser } from "$app/environment";
  import { v4 as uuidv4 } from "uuid";
  import { Client, Session } from "@heroiclabs/nakama-js";
  import ZnamLogo from "$lib/components/shared/znamLogo.svelte";
  import Input from "$lib/components/shared/input.svelte";
  import Button from "$lib/components/shared/button.svelte";
  import { ButtonColors } from "$lib/components/shared/types";
  import { FacebookLogo, GoogleLogo } from "phosphor-svelte";
  import Cookies from "js-cookie";

  let email = "";
  let password = "";
  let repeatPassword = "";

  async function register(email, password) {
    try {
      $nakama.client = new Client("defaultkey", "localhost", "7351");
      $nakama.client.ssl = false;

      $nakama.session = await $nakama.client.authenticateEmail(
        email,
        password,
        true
      );
      Cookies.set("znambg-user_id", $nakama.session.user_id, { path: "/" });
      Cookies.set("znambg-token", $nakama.session.token, { path: "/" });
      Cookies.set("znambg-refresh_token", $nakama.session.refresh_token, {
        path: "/",
      });

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
  <form class="flex flex-col items-center justify-between gap-4 m-0">
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

<script>
  import { goto } from "$app/navigation";
  import { nakama } from "$lib/stores/nakama";
  import { browser } from "$app/environment";
  import { v4 as uuidv4 } from "uuid";
  import { Client, Session } from "@heroiclabs/nakama-js";
  import FacebookLogo from "phosphor-svelte/lib/FacebookLogo";
  import GoogleLogo from "phosphor-svelte/lib/GoogleLogo";
  import ZnamLogo from "$lib/components/shared/znamLogo.svelte";
  import Input from "$lib/components/shared/input.svelte";
  import Button from "$lib/components/shared/button.svelte";
  import { ButtonColors } from "$lib/components/shared/types";
  import Cookies from "js-cookie";

  let email = "";
  let password = "";

  async function authenticateDevice() {
    $nakama.client = new Client("defaultkey", "localhost", "7351");
    $nakama.client.ssl = false;

    let deviceId = Cookies.get("znambg-device-id");
    if (!deviceId) {
      deviceId = uuidv4();
      Cookies.set("znambg-device-id", deviceId, { path: "/" });
    }

    $nakama.session = await $nakama.client.authenticateDevice(deviceId, true);
    Cookies.set("znambg-user_id", $nakama.session.user_id, { path: "/" });
    Cookies.set("znambg-token", $nakama.session.token, { path: "/" });
    Cookies.set("znambg-refresh_token", $nakama.session.refresh_token, {
      path: "/",
    });

    // ep4
    const trace = false;
    $nakama.socket = $nakama.client.createSocket(false, trace);
    await $nakama.socket.connect($nakama.session);
    goto("/");
  }

  async function authenticateEmail(email, password) {
    try {
      $nakama.client = new Client("defaultkey", "localhost", "7351");
      $nakama.client.ssl = false;

      $nakama.session = await $nakama.client.authenticateEmail(
        email,
        password,
        false
      );
      Cookies.set("znambg-user_id", $nakama.session.user_id, { path: "/" });
      Cookies.set("znambg-token", $nakama.session.token, { path: "/" });
      Cookies.set("znambg-refresh_token", $nakama.session.refresh_token, {
        path: "/",
      });
      const trace = false;
      $nakama.socket = $nakama.client.createSocket(false, trace).joinMatch();
      await $nakama.socket.connect($nakama.session, true);

      console.log("User connected:", $nakama.session);
    } catch (error) {
      console.log(error);
    }
  }
</script>

<div class="main-container">
  <ZnamLogo />
  <h1>Логин</h1>
  <Button
    text="Гост"
    color={ButtonColors.pink}
    on:handleClick={async () => await authenticateDevice()}
  />
  или
  <form class="flex flex-col items-center justify-between gap-4 m-0">
    <Input type="email" placeholder="Име" bind:value={email} />
    <Input type="password" placeholder="Парола" bind:value={password} />
    <Button
      color={ButtonColors.green}
      text="Влез"
      on:handleClick={async () => await authenticateEmail(email, password)}
    />
    <!--       <a
        class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
        href="#"
      >
        Забравена парола?
      </a> -->
  </form>
  или
  <div class="flex justify-center gap-6 w-full">
    <FacebookLogo size={24} />
    <GoogleLogo size={24} />
  </div>
  <div>
    Нямаш акаунт? <a href="/register" class="underline">Регистрирай се</a>.
  </div>
</div>

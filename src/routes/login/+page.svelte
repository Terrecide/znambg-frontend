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

  let email = "";
  let password = "";

  $: if (browser && !!$nakama.client) {
    goto("/");
  }

  console.log($nakama.client);

  if (browser) {
    let token = localStorage.getItem("znambg-token");
    let refreshToken = localStorage.getItem("znambg-refresh_token");
    if (token && refreshToken) {
      $nakama.session = Session.restore(token, refreshToken);
      token = $nakama.session.token;
      refreshToken = $nakama.session.refresh_token;
      localStorage.setItem("znambg-token", $nakama.session.token);
      localStorage.setItem(
        "znambg-refresh_token",
        $nakama.session.refresh_token
      );
      console.log("REAUTH");

      goto("/");
    }
  }

  async function authenticateDevice() {
    $nakama.client = new Client("defaultkey", "localhost", "7350");
    $nakama.client.ssl = false;

    let deviceId = localStorage.getItem("znambg-device-id");
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem("znambg-device-id", deviceId);
    }

    $nakama.session = await $nakama.client.authenticateDevice(deviceId, true);
    localStorage.setItem("znambg-user_id", $nakama.session.user_id);
    localStorage.setItem("znambg-token", $nakama.session.token);
    localStorage.setItem("znambg-refresh_token", $nakama.session.refresh_token);

    // ep4
    const trace = false;
    $nakama.socket = $nakama.client.createSocket(false, trace);
    await $nakama.socket.connect($nakama.session);
  }

  async function authenticateEmail(email, password) {
    try {
      $nakama.client = new Client("defaultkey", "localhost", "7350");
      $nakama.client.ssl = false;

      $nakama.session = await $nakama.client.authenticateEmail(
        email,
        password,
        false
      );
      localStorage.setItem("znambg-user_id", $nakama.session.user_id);
      localStorage.setItem("znambg-token", $nakama.session.token);
      localStorage.setItem(
        "znambg-refresh_token",
        $nakama.session.refresh_token
      );
      const trace = false;
      $nakama.socket = $nakama.client.createSocket(false, trace).joinMatch().p;
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
  <form class="flex flex-col gap-4 w-full">
    <Input type="email" placeholder="Име" bind:value={email} />
    <Input type="password" placeholder="Парола" bind:value={password} />

    <div class="flex flex-col items-center justify-between">
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
    </div>
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

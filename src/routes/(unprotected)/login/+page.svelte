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
  import * as yup from "yup";
  import { createForm } from "felte";
  import { validator } from "@felte/validator-yup";
  import { onMount } from "svelte";
  import { authErrorToText } from "$lib/services/auth";

  let schema = yup.object().shape({
    email: yup
      .string()
      .required("Полето е задължилтено")
      .email("Въведете валиден имейл")
      .default("")
      .label("Email address"),
    password: yup
      .string()
      .min(8, "Въведете минимум 8 символа")
      .required("Полето е задължилтено")
      .default("")
      .label("Phone"),
  });

  let apiError = "";

  async function authenticateDevice() {
    try {
      $nakama.client = new Client("defaultkey", "127.0.0.1", "7350");
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
    } catch (error) {
      console.log(error);
    }
  }

  async function authenticateEmail(email, password) {
    try {
      $nakama.client = new Client("defaultkey", "127.0.0.1", "7350");
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
      $nakama.socket = await $nakama.client
        .createSocket(false, trace)
        .joinMatch();
      const response = await $nakama.socket.connect($nakama.session, true);
      console.log(response);
      await goto("/");
      console.log("User connected:", $nakama.session);
    } catch (error) {
      console.log(error);
      apiError = authErrorToText(error.statusText);
    }
  }

  onMount(() => {
    setFields(schema.cast());
  });

  const { form, errors, setData, data, setFields } = createForm({
    extend: validator({ schema }),
    onSubmit: async (values) => {
      await authenticateEmail(values.email, values.password);
    },
  });
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
  <form
    use:form
    on:submit|preventDefault
    class="flex flex-col items-center justify-between gap-4 m-0"
  >
    <Input
      type="email"
      name="email"
      placeholder="Имейл"
      error={$errors["email"]}
    />
    <Input
      type="password"
      name="password"
      placeholder="Парола"
      error={$errors["password"]}
    />
    <Button color={ButtonColors.green} text="Влез" type="submit" />
    {#if apiError}
      <p class="error">{apiError}</p>
    {/if}
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

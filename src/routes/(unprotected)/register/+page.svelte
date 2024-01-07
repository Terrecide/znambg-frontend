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
  import * as yup from "yup";
  import { createForm } from "felte";
  import { validator } from "@felte/validator-yup";
  import { onMount } from "svelte";
  import { authErrorToText } from "$lib/services/auth";

  let apiError = "";
  let schema = yup.object().shape({
    name: yup
      .string()
      .required("Полето е задължилтено")
      .default("")
      .label("Name"),
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
    repeatPassword: yup
      .string()
      .min(8, "Въведете минимум 8 символа")
      .required("Полето е задължилтено")
      .oneOf([yup.ref("password")], "Паролите трябва да съвпадат")
      .default("")
      .label("RepeatPhone"),
  });
  async function register(name, email, password) {
    try {
      $nakama.client = new Client("defaultkey", "127.0.0.1", "7350");
      $nakama.client.ssl = false;

      $nakama.session = await $nakama.client.authenticateEmail(
        email,
        password,
        true,
        name
      );
      Cookies.set("znambg-user_id", $nakama.session.user_id, { path: "/" });
      Cookies.set("znambg-token", $nakama.session.token, { path: "/" });
      Cookies.set("znambg-refresh_token", $nakama.session.refresh_token, {
        path: "/",
      });

      const trace = false;
      $nakama.socket = $nakama.client.createSocket(false, trace);
      await $nakama.socket.connect($nakama.session, true);
      goto("/");
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
      await register(values.name, values.email, values.password);
    },
  });
</script>

<div class="main-container">
  <ZnamLogo />
  <h1>Регистрация</h1>
  <!--  -->
  <form
    use:form
    on:submit|preventDefault
    class="flex flex-col items-center justify-between gap-4 m-0"
  >
    <Input type="name" name="name" placeholder="Име" error={$errors["name"]} />
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
    <Input
      type="password"
      name="repeatPassword"
      placeholder="Повтори парола"
      error={$errors["repeatPassword"]}
    />
    <Button type="submit" text="Регистрирай се" color={ButtonColors.green} />
    {#if apiError}
      <p class="error">{apiError}</p>
    {/if}
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

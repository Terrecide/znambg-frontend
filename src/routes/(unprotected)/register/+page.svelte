<script>
  import { goto } from "$app/navigation";
  import ZnamLogo from "$lib/components/shared/znamLogo.svelte";
  import Input from "$lib/components/shared/input.svelte";
  import Button from "$lib/components/shared/button.svelte";
  import { ButtonColors } from "$lib/components/shared/types";
  import { FacebookLogo, GoogleLogo } from "phosphor-svelte";
  import * as yup from "yup";
  import { createForm } from "felte";
  import { validator } from "@felte/validator-yup";
  import { onMount } from "svelte";
  import authStore from "$lib/stores/authStore";
  import { loginGoogle, registerUser } from "$lib/services/auth.service";

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

  onMount(() => {
    setFields(schema.cast());
  });

  const { form, errors, setData, data, setFields } = createForm({
    extend: validator({ schema }),
    onSubmit: async (values) => {
      await registerUser(values.email, values.password, values.name);
    },
  });

  $: if ($authStore.isLoggedIn) {
    goto("/");
  }
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
    <div class="cursor-pointer" on:click={() => {}}>
      <FacebookLogo size={24} />
    </div>
    <div class="cursor-pointer" on:click={() => loginGoogle()}>
      <GoogleLogo size={24} />
    </div>
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

<script>
  import { goto } from "$app/navigation";
  import FacebookLogo from "phosphor-svelte/lib/FacebookLogo";
  import GoogleLogo from "phosphor-svelte/lib/GoogleLogo";
  import ZnamLogo from "$lib/components/shared/znamLogo.svelte";
  import Input from "$lib/components/shared/input.svelte";
  import Button from "$lib/components/shared/button.svelte";
  import { ButtonColors } from "$lib/components/shared/types";
  import * as yup from "yup";
  import { createForm } from "felte";
  import { validator } from "@felte/validator-yup";
  import { onMount } from "svelte";
  import authStore from "$lib/stores/authStore";
  import { loginGoogle, loginUser } from "$lib/services/auth.service";

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

  onMount(() => {
    setFields(schema.cast());
  });

  const { form, errors, setData, data, setFields } = createForm({
    extend: validator({ schema }),
    onSubmit: async (values) => {
      await loginUser(values.email, values.password);
    },
  });

  $: if ($authStore.isLoggedIn) {
    goto("/");
  }
</script>

<div class="main-container">
  <ZnamLogo />
  <h1>Логин</h1>
  <form
    use:form
    on:submit|preventDefault
    class="flex flex-col items-center justify-between gap-4 m-0 w-48"
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
    <div class="flex flex-col w-full">
      <Button color={ButtonColors.green} text="Влез" type="submit" />
    </div>
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
  <div class="flex flex-col justify-center gap-4 w-48">
    <Button
      text="Логин с Google"
      color={ButtonColors.gray}
      on:handleClick={() => loginGoogle()}
    >
      <GoogleLogo size={24} slot="icon" />
    </Button>
  </div>
  <div>
    Нямаш акаунт? <a href="/register" class="underline">Регистрирай се</a>.
  </div>
</div>

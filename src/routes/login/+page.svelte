<script>
  import { goto } from "$app/navigation";
  import { nakama } from "$lib/stores/nakama";
  import { browser } from "$app/environment";
  import { v4 as uuidv4 } from "uuid";
  import { Client } from "@heroiclabs/nakama-js";

  let email = "";
  let password = "";

  $: if (browser && !!$nakama.client) {
    goto("/");
  }

  async function authenticateDevice() {
    $nakama.client = new Client("defaultkey", "localhost", "7350");
    $nakama.client.ssl = false;

    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem("deviceId", deviceId);
    }

    $nakama.session = await $nakama.client.authenticateDevice(deviceId, true);
    localStorage.setItem("user_id", $nakama.session.user_id);

    // ep4
    const trace = false;
    $nakama.socket = $nakama.client.createSocket(false, trace);
    await $nakama.socket.connect($nakama.session);
  }

  async function authenticateEmail(email, password) {
    try {
      $nakama.client = new Client("defaultkey", "localhost", "7350");
      $nakama.client.ssl = false;

      $nakama.session = await $nakama.client.authenticateEmail(email, password);
      localStorage.setItem("user_id", $nakama.session.user_id);

      const trace = false;
      $nakama.socket = $nakama.client.createSocket(false, trace);
      await $nakama.socket.connect($nakama.session, true);

      console.log("User connected:", $nakama.session);
    } catch (error) {
      console.log(error);
    }
  }
</script>

<div class="flex flex-col items-center gap-4 mx-auto">
  <h1>Znam BG</h1>
  <button
    class="btn btn-blue"
    on:click={async () => await authenticateDevice()}
  >
    Влез като гост
  </button>
  или
  <form class="flex flex-col gap-4 m-0 p-0">
    <input
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      id="email"
      type="email"
      placeholder="Име"
      bind:value={email}
    />
    <div>
      <input
        class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        id="password"
        type="password"
        placeholder="Парола"
        bind:value={password}
      />
      <p class="text-red-500 text-xs italic">Моля изберете парола.</p>
    </div>

    <div class="flex items-center justify-between">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        on:click={async () => await authenticateEmail(email, password)}
      >
        Влез
      </button>
      <a
        class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
        href="#"
      >
        Забравена парола?
      </a>
    </div>
  </form>
  или
  <div class="flex gap-4">
    <button class="btn btn-blue">Гоогле</button>
    <button class="btn btn-blue">ФБ</button>
    <button class="btn btn-blue">Apple</button>
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

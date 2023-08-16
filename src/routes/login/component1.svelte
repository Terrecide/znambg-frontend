<script>
  import { getSession, session } from "$lib/services/nakama";
  import Nakama from "../../nakama";
</script>

<button on:click={() => console.log(Nakama.getClient(), Nakama.getSession())}
  >Hello</button
>

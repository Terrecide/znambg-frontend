<script>
    import { goto } from '$app/navigation';
    import { nakama } from '$lib/stores/nakama';
    import { browser } from '$app/environment';
    import { v4 as uuidv4 } from 'uuid';
    import { Client } from '@heroiclabs/nakama-js';

    let client = $nakama.client;
    let session = $nakama.session;
    let socket = $nakama.socket;

    let email = '';
    let password = '';
    let repeatPassword = '';

    // $: if (browser && !!$nakama.client) {
    //   goto("/");
    // }
    console.log($nakama.client);

    if (browser) {
        let token = localStorage.getItem('znambg-token');
        let refreshToken = localStorage.getItem('znambg-refresh_token');
        if (token && refreshToken) {
            session = Session.restore(token, refreshToken);
            token = session.token;
            refreshToken = session.refresh_token;
            localStorage.setItem('znambg-token', session.token);
            localStorage.setItem('znambg-refresh_token', session.refresh_token);
            console.log('REAUTH');

            goto('/');
        }
    }

    async function register(email, password) {
        try {
            client = new Client('defaultkey', 'localhost', '7350');
            client.ssl = false;

            $nakama.session = await client.authenticateEmail(email, password, true);
            localStorage.setItem('user_id', $nakama.session.user_id);

            const trace = false;
            socket = client.createSocket(false, trace);
            await socket.connect($nakama.session, true);

            console.log('User connected:', $nakama.session);
        } catch (error) {
            console.log(error);
        }
    }
</script>

<div class="flex flex-col items-center gap-4 mx-auto">
    <h1>Znam BG</h1>
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
        <div>
            <input
                class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="repeatPassword"
                type="password"
                placeholder="Повтори парола"
                bind:value={repeatPassword}
            />
            <p class="text-red-500 text-xs italic">Моля повтори паролата.</p>
        </div>

        <div class="flex items-center justify-between">
            <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                on:click={async () => await register(email, password)}
            >
                Регистрирай се
            </button>
        </div>
    </form>
    <div>
        Имаш акаунт? <a href="/login" class="text-blue-500 hover:text-blue-800">Влез оттук</a>.
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

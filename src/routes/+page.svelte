<script>
    import { goto } from '$app/navigation';
    import { nakama } from '$lib/stores/nakama';
    import { browser } from '$app/environment';
    import { Client, Session } from '@heroiclabs/nakama-js';

    let matchId = '';

    let client = $nakama.client;
    let session = $nakama.session;
    let socket = $nakama.socket;

    let token;
    let refreshToken;

    console.log(client);

    if (browser) {
        token = localStorage.getItem('znambg-token');
        refreshToken = localStorage.getItem('znambg-refresh_token');
        if (token && refreshToken) {
            session = Session.restore(token, refreshToken);
            token = session.token;
            refreshToken = session.refresh_token;
            localStorage.setItem('znambg-token', session.token);
            localStorage.setItem('znambg-refresh_token', session.refresh_token);
            console.log('REAUTH: ', session);

            goto('/');
        }
    }

    async function findMatch() {
        try {
            // ep4
            const rpcid = 'find_match_js';
            const matches = await client?.rpc(session, rpcid, {});

            matchId = matches.payload.matchIds[0];
            const match = await socket?.joinMatch(matchId);
            console.log('Match Presences', match?.presences);
            if (match?.presences) {
                $nakama.presences = match?.presences;
            }
            goto(`/match?id=${matchId}`);
            console.log('Matched joined!');
        } catch (error) {
            console.log(error);
        }
    }

    async function sendAnswer(index) {
        try {
            // ep4
            var data = { answer: index };
            await socket.sendMatchState(matchId, 4, JSON.stringify(data));
            console.log('Answer data sent');
        } catch (error) {
            console.log(error);
        }
    }

    async function logout() {
        client = new Client('defaultkey', 'localhost', '7350');
        await client.sessionLogout(session, token, refreshToken);
        localStorage.removeItem('znambg-token');
        localStorage.removeItem('znambg-refresh_token');

        goto('/login');
    }
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<button class="btn btn-blue" on:click={async () => await findMatch()}>Play</button>
<br />
<br />
<br />
<button class="btn btn-blue" on:click={async () => await logout()}>Logout</button>

<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0.6;
    }

    h1 {
        width: 100%;
    }

    .welcome {
        display: block;
        position: relative;
        width: 100%;
        height: 0;
        padding: 0 0 calc(100% * 495 / 2048) 0;
    }

    .welcome img {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        display: block;
    }
</style>

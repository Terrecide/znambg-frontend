import { Client, Session, type Socket } from '@heroiclabs/nakama-js';
import { v4 as uuidv4 } from 'uuid';

const useSSL = false;
export const client: Client = new Client('defaultkey', 'localhost', '7350', useSSL);
export const socket: Socket = client.createSocket(useSSL, false);
export let session: Session;

export async function authenticateGuest() {
    try {
        let deviceId: string = localStorage.getItem('deviceId') || '';
        if (!deviceId) {
            deviceId = uuidv4();
            localStorage.setItem('deviceId', deviceId);
        }

        session = await client.authenticateDevice(deviceId, true);
        await socket.connect(session, true);
        localStorage.setItem('user_id', session.user_id!);
        console.log('User connected:', session);
    } catch (error) {
        console.log(error);
    }
}

export async function authenticateEmail(email: string, password: string) {
    try {
        let session = await client.authenticateEmail(email, password);
        const test = await socket.connect(session, true);
        console.log(session);
        localStorage.setItem('znam-token', 'Tom');
        console.log('User connected:', session);
    } catch (error) {
        console.log(error);
    }
}

export function getSession() {
    return session;
}

/* try class or svelte stores */

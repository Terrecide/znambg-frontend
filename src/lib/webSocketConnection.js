import ioClient from "socket.io-client";
const ENDPOINT = import.meta.env.VITE_ZNAM_BE;
export const socket = ioClient(ENDPOINT);

export const io = socket;
import { checkCookies } from "$lib/server/auth";
import { redirect, type Handle } from "@sveltejs/kit";

const unprotected = ["/login", "/register"];

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.user = checkCookies(event);

  if (!event.locals.user && !unprotected.includes(event.url.pathname)) {
    throw redirect(303, "/login");
  }

  const response = await resolve(event);

  return response;
};
